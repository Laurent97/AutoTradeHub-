-- Create loan_applications table
-- This table handles partner loan applications for financing

-- Create the loan_applications table
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Application Details
    application_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "APP001", "APP002"
    business_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Loan Details
    loan_amount DECIMAL(12, 2) NOT NULL CHECK (loan_amount > 0),
    loan_purpose VARCHAR(255) NOT NULL,
    loan_term INTEGER NOT NULL CHECK (loan_term > 0), -- in months
    
    -- Financial Information
    credit_score INTEGER CHECK (credit_score >= 300 AND credit_score <= 850),
    annual_revenue DECIMAL(12, 2) CHECK (annual_revenue >= 0),
    tax_id VARCHAR(50),
    
    -- Application Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'cancelled')),
    
    -- Dates
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_date TIMESTAMP WITH TIME ZONE,
    rejected_date TIMESTAMP WITH TIME ZONE,
    reviewed_date TIMESTAMP WITH TIME ZONE,
    
    -- Admin Actions
    reviewed_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Document Management
    documents JSONB DEFAULT '[]', -- Array of document objects with name, url, type, etc.
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_loan_amount CHECK (loan_amount BETWEEN 1000 AND 1000000),
    CONSTRAINT valid_loan_term CHECK (loan_term BETWEEN 1 AND 120),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loan_applications_partner_id ON loan_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_user_id ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_applied_date ON loan_applications(applied_date);
CREATE INDEX IF NOT EXISTS idx_loan_applications_application_number ON loan_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_loan_applications_email ON loan_applications(email);

-- Create a function to generate application numbers
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
    new_number TEXT;
    max_num INTEGER;
BEGIN
    -- Get the highest existing number
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 4) AS INTEGER)), 0) 
    INTO max_num
    FROM loan_applications
    WHERE application_number ~ '^APP[0-9]+$';
    
    -- Generate new number
    new_number := 'APP' || LPAD((max_num + 1)::TEXT, 3, '0');
    
    NEW.application_number := new_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate application numbers
CREATE TRIGGER loan_applications_generate_number
    BEFORE INSERT ON loan_applications
    FOR EACH ROW
    WHEN (NEW.application_number IS NULL OR NEW.application_number = '')
    EXECUTE FUNCTION generate_application_number();

-- Enable Row Level Security
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Partners can view their own applications
CREATE POLICY "Partners can view own loan applications" ON loan_applications
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM partner_profiles 
            WHERE id = partner_id AND user_id = auth.uid()
        )
    );

-- Partners can insert their own applications
CREATE POLICY "Partners can create own loan applications" ON loan_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Partners can update their own applications (only certain fields before review)
CREATE POLICY "Partners can update own loan applications" ON loan_applications
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        status IN ('pending', 'under_review')
    );

-- Admins can view all applications
CREATE POLICY "Admins can view all loan applications" ON loan_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Admins can update all applications
CREATE POLICY "Admins can update all loan applications" ON loan_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT ON loan_applications TO authenticated;
GRANT UPDATE ON loan_applications TO authenticated;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for admin dashboard with partner information
CREATE OR REPLACE VIEW v_loan_applications_admin AS
SELECT 
    la.id,
    la.application_number,
    la.partner_id,
    la.user_id,
    la.business_name,
    la.contact_person,
    la.email,
    la.phone,
    la.loan_amount,
    la.loan_purpose,
    la.loan_term,
    la.credit_score,
    la.annual_revenue,
    la.tax_id,
    la.status,
    la.applied_date,
    la.approved_date,
    la.rejected_date,
    la.reviewed_date,
    la.reviewed_by,
    la.rejection_reason,
    la.admin_notes,
    la.documents,
    la.created_at,
    la.updated_at,
    -- Partner profile information
    pp.store_name as partner_store_name,
    pp.store_slug,
    pp.contact_email as partner_contact_email,
    pp.contact_phone as partner_contact_phone,
    pp.country,
    pp.city,
    -- User information
    u.full_name as user_full_name,
    u.email as user_email,
    -- Reviewer information
    reviewer.full_name as reviewer_name,
    reviewer.email as reviewer_email
FROM loan_applications la
LEFT JOIN partner_profiles pp ON la.partner_id = pp.id
LEFT JOIN users u ON la.user_id = u.id
LEFT JOIN users reviewer ON la.reviewed_by = reviewer.id;

-- Grant access to the view
GRANT SELECT ON v_loan_applications_admin TO authenticated;

-- Create view for partners to see their own applications
CREATE OR REPLACE VIEW v_loan_applications_partner AS
SELECT 
    la.id,
    la.application_number,
    la.business_name,
    la.contact_person,
    la.email,
    la.phone,
    la.loan_amount,
    la.loan_purpose,
    la.loan_term,
    la.credit_score,
    la.annual_revenue,
    la.tax_id,
    la.status,
    la.applied_date,
    la.approved_date,
    la.rejected_date,
    la.reviewed_date,
    la.rejection_reason,
    la.admin_notes,
    la.documents,
    la.created_at,
    la.updated_at
FROM loan_applications la
WHERE la.user_id = auth.uid();

-- Grant access to the partner view
GRANT SELECT ON v_loan_applications_partner TO authenticated;

-- Create function for approving loan application
CREATE OR REPLACE FUNCTION approve_loan_application(
    p_application_id UUID,
    p_admin_id UUID,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_status TEXT;
BEGIN
    -- Get current status
    SELECT status INTO current_status
    FROM loan_applications
    WHERE id = p_application_id;
    
    -- Check if application exists and is in approvable state
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found';
    END IF;
    
    IF current_status NOT IN ('pending', 'under_review') THEN
        RAISE EXCEPTION 'Application cannot be approved. Current status: %', current_status;
    END IF;
    
    -- Update the application
    UPDATE loan_applications
    SET 
        status = 'approved',
        approved_date = NOW(),
        reviewed_date = NOW(),
        reviewed_by = p_admin_id,
        admin_notes = p_admin_notes,
        updated_at = NOW()
    WHERE id = p_application_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for rejecting loan application
CREATE OR REPLACE FUNCTION reject_loan_application(
    p_application_id UUID,
    p_admin_id UUID,
    p_rejection_reason TEXT,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_status TEXT;
BEGIN
    -- Get current status
    SELECT status INTO current_status
    FROM loan_applications
    WHERE id = p_application_id;
    
    -- Check if application exists and is in rejectable state
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found';
    END IF;
    
    IF current_status NOT IN ('pending', 'under_review') THEN
        RAISE EXCEPTION 'Application cannot be rejected. Current status: %', current_status;
    END IF;
    
    -- Update the application
    UPDATE loan_applications
    SET 
        status = 'rejected',
        rejected_date = NOW(),
        reviewed_date = NOW(),
        reviewed_by = p_admin_id,
        rejection_reason = p_rejection_reason,
        admin_notes = p_admin_notes,
        updated_at = NOW()
    WHERE id = p_application_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION approve_loan_application TO authenticated;
GRANT EXECUTE ON FUNCTION reject_loan_application TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE loan_applications IS 'Table for managing partner loan applications for business financing';
COMMENT ON COLUMN loan_applications.application_number IS 'Unique application number (e.g., APP001)';
COMMENT ON COLUMN loan_applications.loan_amount IS 'Requested loan amount in USD';
COMMENT ON COLUMN loan_applications.loan_term IS 'Loan term in months';
COMMENT ON COLUMN loan_applications.credit_score IS 'Applicant credit score (300-850)';
COMMENT ON COLUMN loan_applications.annual_revenue IS 'Applicant annual business revenue in USD';
COMMENT ON COLUMN loan_applications.documents IS 'JSON array of uploaded documents';
COMMENT ON VIEW v_loan_applications_admin IS 'Admin view with all loan applications and related partner/user information';
COMMENT ON VIEW v_loan_applications_partner IS 'Partner view for their own loan applications';
COMMENT ON FUNCTION approve_loan_application IS 'Function to approve a loan application';
COMMENT ON FUNCTION reject_loan_application IS 'Function to reject a loan application with reason';
