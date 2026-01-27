# Loan Applications Database System

This document describes the complete database structure and setup for the loan applications system in the Auto Trade Hub platform.

## Overview

The loan applications system allows partners to apply for business financing and administrators to manage these applications through a comprehensive review and approval process.

## Database Tables

### 1. `loan_applications` Table

The main table that stores all loan application data.

#### Key Columns:
- `id`: UUID primary key
- `application_number`: Unique application number (e.g., "APP001")
- `partner_id`: Foreign key to partner_profiles
- `user_id`: Foreign key to auth.users
- `business_name`: Applicant's business name
- `contact_person`: Primary contact person
- `email`: Contact email
- `phone`: Contact phone number
- `loan_amount`: Requested loan amount (USD)
- `loan_purpose`: Purpose of the loan
- `loan_term`: Loan term in months
- `credit_score`: Applicant's credit score (300-850)
- `annual_revenue`: Annual business revenue (USD)
- `tax_id`: Business tax ID
- `status`: Application status (pending, under_review, approved, rejected, cancelled)
- `applied_date`: When the application was submitted
- `approved_date`: When the application was approved
- `rejected_date`: When the application was rejected
- `reviewed_date`: When the application was reviewed
- `reviewed_by`: Admin who reviewed the application
- `rejection_reason`: Reason for rejection
- `admin_notes`: Internal admin notes
- `documents`: JSON array of uploaded documents
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

#### Constraints:
- Loan amount: $1,000 - $1,000,000
- Loan term: 1 - 120 months
- Credit score: 300 - 850
- Valid email format required

## Database Views

### 1. `v_loan_applications_admin`

Comprehensive view for administrators with all related information.

**Includes:**
- All loan application fields
- Partner profile information (store name, contact details, location)
- User information (full name, email)
- Reviewer information (admin who processed the application)

### 2. `v_loan_applications_partner`

Simplified view for partners to see their own applications.

**Includes:**
- Application details (excluding admin-only fields)
- Status and dates
- Documents and notes

### 3. `v_loan_application_documents`

View showing all loan application documents with metadata.

**Includes:**
- Application ID and number
- Document name, type, and URL
- Upload timestamp and file size

## Storage Setup

### `loan_documents` Bucket

Storage bucket for loan application documents with the following features:

**File Types Allowed:**
- PDF documents
- JPEG images
- PNG images
- Word documents (.doc, .docx)

**File Size Limit:** 10MB per file

**Folder Structure:** `application_id/document_type_timestamp.extension`

## Database Functions

### 1. `generate_application_number()`

Automatically generates sequential application numbers (APP001, APP002, etc.).

**Trigger:** Runs before insert when application_number is NULL or empty.

### 2. `approve_loan_application(p_application_id, p_admin_id, p_admin_notes)`

Approves a loan application and sets appropriate dates and reviewer information.

**Returns:** BOOLEAN (success/failure)

**Validations:**
- Application must exist
- Status must be 'pending' or 'under_review'

### 3. `reject_loan_application(p_application_id, p_admin_id, p_rejection_reason, p_admin_notes)`

Rejects a loan application with a reason.

**Returns:** BOOLEAN (success/failure)

**Validations:**
- Application must exist
- Status must be 'pending' or 'under_review'
- Rejection reason is required

### 4. `update_updated_at_column()`

Automatically updates the `updated_at` timestamp on record updates.

## Row Level Security (RLS) Policies

### Loan Applications Table

1. **Partners can view own applications**
   - Users can see applications where they are the user_id or partner_id

2. **Partners can create own applications**
   - Users can insert applications with their own user_id

3. **Partners can update own applications**
   - Users can update applications in 'pending' or 'under_review' status

4. **Admins can view all applications**
   - Admin users can view all loan applications

5. **Admins can update all applications**
   - Admin users can update any loan application

### Storage Policies

1. **Users can upload loan documents**
   - Users can upload to their own application folders

2. **Users can view own loan documents**
   - Users can view documents from their own applications

3. **Admins can manage all loan documents**
   - Admin users have full access to all documents

## Indexes

Performance indexes for common queries:

- `idx_loan_applications_partner_id`: Partner lookups
- `idx_loan_applications_user_id`: User lookups
- `idx_loan_applications_status`: Status filtering
- `idx_loan_applications_applied_date`: Date ordering
- `idx_loan_applications_application_number`: Application number search
- `idx_loan_applications_email`: Email search

## Setup Instructions

### 1. Create the Main Table

```sql
-- Run the create_loan_applications_table.sql file
-- This creates the table, indexes, triggers, and RLS policies
```

### 2. Setup Storage

```sql
-- Run the setup_loan_documents_storage.sql file
-- This creates the storage bucket and policies
```

### 3. Grant Permissions

The SQL files include all necessary GRANT statements for:
- Table access (SELECT, INSERT, UPDATE)
- View access (SELECT)
- Function execution
- Storage bucket operations

## API Integration

### Frontend Service

Use the `loanService` in `src/lib/supabase/loan-service.ts` for:

- Creating new applications
- Fetching applications (admin/partner views)
- Approving/rejecting applications
- Managing documents
- Search and filtering

### Key Functions

```typescript
// Create application
loanService.createLoanApplication(data)

// Get admin applications
loanService.getAdminLoanApplications()

// Get partner applications
loanService.getPartnerLoanApplications(userId)

// Approve application
loanService.approveLoanApplication(applicationId, adminId, notes)

// Reject application
loanService.rejectLoanApplication(applicationId, adminId, reason, notes)

// Upload document
loanService.uploadDocument(applicationId, file, documentType)
```

## Data Flow

### Application Submission

1. Partner fills out loan application form
2. Frontend validates data and calls `createLoanApplication()`
3. Database generates application number automatically
4. Documents are uploaded to storage bucket
5. Application status is set to 'pending'

### Admin Review

1. Admin views applications in dashboard
2. Uses admin view to see all application details
3. Can approve, reject, or request more information
4. Status updates trigger appropriate date stamps
5. Email notifications can be sent (implementation dependent)

### Partner Tracking

1. Partner views their applications through partner view
2. Can see status updates and admin notes
3. Can upload additional documents if needed
4. Can withdraw applications (if implemented)

## Security Considerations

- All data access is controlled by RLS policies
- Partners can only access their own applications
- Admin access is restricted to users with 'admin' role
- Document access is controlled by storage policies
- All functions use SECURITY DEFINER for proper privilege handling

## Monitoring and Maintenance

### Regular Tasks

1. **Monitor application volumes** - Track submission trends
2. **Review approval rates** - Ensure consistent decision-making
3. **Storage cleanup** - Remove documents from cancelled applications
4. **Index maintenance** - Rebuild indexes if performance degrades

### Recommended Queries

```sql
-- Application statistics
SELECT status, COUNT(*) as count, AVG(loan_amount) as avg_amount
FROM loan_applications
GROUP BY status;

-- Approval rate by month
SELECT 
  DATE_TRUNC('month', applied_date) as month,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  ROUND(COUNT(*) FILTER (WHERE status = 'approved') * 100.0 / COUNT(*), 2) as approval_rate
FROM loan_applications
GROUP BY month
ORDER BY month DESC;

-- Document storage usage
SELECT 
  COUNT(*) as total_documents,
  SUM(size) as total_size
FROM storage.objects
WHERE bucket_id = 'loan_documents';
```

## Troubleshooting

### Common Issues

1. **Application number conflicts**
   - Check the trigger function is working
   - Verify sequence isn't out of sync

2. **RLS policy violations**
   - Ensure user has proper role in users table
   - Check partner profile exists for partner access

3. **Storage upload failures**
   - Verify bucket policies are correctly applied
   - Check file size and type restrictions

4. **Performance issues**
   - Review query execution plans
   - Consider additional indexes for common filters

## Future Enhancements

### Potential Improvements

1. **Workflow automation**
   - Automated credit score checks
   - Risk assessment scoring
   - Automated document verification

2. **Integration features**
   - Credit bureau API integration
   - Banking system integration
   - Email/SMS notifications

3. **Advanced reporting**
   - Financial analytics dashboard
   - Risk assessment reports
   - Compliance reporting

4. **Document management**
   - OCR processing for documents
   - Automated document classification
   - Digital signature integration
