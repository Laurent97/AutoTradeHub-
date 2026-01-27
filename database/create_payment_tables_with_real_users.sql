-- Create missing payment-related tables and views (Using Real Users)
-- This script uses existing users instead of hardcoded UUIDs

-- Drop existing views first (if they exist)
DROP VIEW IF EXISTS v_stripe_payment_attempts_with_users CASCADE;
DROP VIEW IF EXISTS v_pending_payments_with_users CASCADE;
DROP VIEW IF EXISTS v_payment_security_logs_with_users CASCADE;

-- Create stripe_payment_attempts table
CREATE TABLE IF NOT EXISTS stripe_payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(255) NOT NULL,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_intent_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
    rejection_reason TEXT,
    collected_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pending_payments table
CREATE TABLE IF NOT EXISTS pending_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(255) NOT NULL,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_method VARCHAR(20) NOT NULL 
        CHECK (payment_method IN ('paypal', 'crypto')),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    paypal_email VARCHAR(255),
    paypal_transaction_id VARCHAR(255),
    crypto_address VARCHAR(255),
    crypto_transaction_id VARCHAR(255),
    crypto_type VARCHAR(20),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'pending_confirmation', 'confirmed', 'rejected', 'cancelled')),
    admin_notes TEXT,
    confirmed_by UUID REFERENCES auth.users(id),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL 
        CHECK (type IN ('deposit', 'withdrawal', 'order_payment', 'order_refund', 'commission', 'bonus')),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    payment_method VARCHAR(50),
    order_id VARCHAR(255),
    transaction_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_balances table
CREATE TABLE IF NOT EXISTS wallet_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_security_logs table
CREATE TABLE IF NOT EXISTS payment_security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create views for admin dashboard
CREATE OR REPLACE VIEW v_stripe_payment_attempts_with_users AS
SELECT 
    spa.*,
    u.full_name,
    u.email,
    u.user_type
FROM stripe_payment_attempts spa
LEFT JOIN users u ON spa.customer_id = u.id;

CREATE OR REPLACE VIEW v_pending_payments_with_users AS
SELECT 
    pp.*,
    u.full_name,
    u.email,
    u.user_type
FROM pending_payments pp
LEFT JOIN users u ON pp.customer_id = u.id;

CREATE OR REPLACE VIEW v_payment_security_logs_with_users AS
SELECT 
    psl.*,
    u.full_name,
    u.email,
    u.user_type
FROM payment_security_logs psl
LEFT JOIN users u ON psl.user_id = u.id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stripe_payment_attempts_customer_id ON stripe_payment_attempts(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_attempts_status ON stripe_payment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_attempts_created_at ON stripe_payment_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_attempts_order_id ON stripe_payment_attempts(order_id);

CREATE INDEX IF NOT EXISTS idx_pending_payments_customer_id ON pending_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);
CREATE INDEX IF NOT EXISTS idx_pending_payments_payment_method ON pending_payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_pending_payments_created_at ON pending_payments(created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_balances_user_id ON wallet_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_balances_balance ON wallet_balances(balance);

CREATE INDEX IF NOT EXISTS idx_payment_security_logs_user_id ON payment_security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_security_logs_event_type ON payment_security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_security_logs_created_at ON payment_security_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_stripe_payment_attempts_updated_at ON stripe_payment_attempts;
CREATE TRIGGER update_stripe_payment_attempts_updated_at
    BEFORE UPDATE ON stripe_payment_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pending_payments_updated_at ON pending_payments;
CREATE TRIGGER update_pending_payments_updated_at
    BEFORE UPDATE ON pending_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wallet_transactions_updated_at ON wallet_transactions;
CREATE TRIGGER update_wallet_transactions_updated_at
    BEFORE UPDATE ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wallet_balances_updated_at ON wallet_balances;
CREATE TRIGGER update_wallet_balances_updated_at
    BEFORE UPDATE ON wallet_balances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE stripe_payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_security_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same as before)
DROP POLICY IF EXISTS "Users can view own stripe attempts" ON stripe_payment_attempts;
CREATE POLICY "Users can view own stripe attempts" ON stripe_payment_attempts
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all stripe attempts" ON stripe_payment_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view own pending payments" ON pending_payments;
CREATE POLICY "Users can view own pending payments" ON pending_payments
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all pending payments" ON pending_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can update pending payments" ON pending_payments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view own wallet transactions" ON wallet_transactions;
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallet transactions" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can update wallet transactions" ON wallet_transactions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view own wallet balance" ON wallet_balances;
CREATE POLICY "Users can view own wallet balance" ON wallet_balances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet balance" ON wallet_balances
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallet balances" ON wallet_balances
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can update all wallet balances" ON wallet_balances
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can view own security logs" ON payment_security_logs;
CREATE POLICY "Users can view own security logs" ON payment_security_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security logs" ON payment_security_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON stripe_payment_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON pending_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON wallet_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON wallet_balances TO authenticated;
GRANT SELECT, INSERT ON payment_security_logs TO authenticated;

GRANT SELECT ON v_stripe_payment_attempts_with_users TO authenticated;
GRANT SELECT ON v_pending_payments_with_users TO authenticated;
GRANT SELECT ON v_payment_security_logs_with_users TO authenticated;

-- Insert sample data using REAL existing users
-- First, let's create wallet balances for existing users
INSERT INTO wallet_balances (user_id, balance) 
SELECT id, 0 FROM users WHERE user_type = 'admin'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO wallet_balances (user_id, balance) 
SELECT id, 1500.00 FROM users WHERE user_type = 'partner'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO wallet_balances (user_id, balance) 
SELECT id, 250.00 FROM users WHERE user_type = 'user'
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample wallet transactions using real users
INSERT INTO wallet_transactions (user_id, type, amount, status, description)
SELECT id, 'deposit', 1000.00, 'completed', 'Initial deposit'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO wallet_transactions (user_id, type, amount, status, description)
SELECT id, 'withdrawal', 50.00, 'pending', 'Withdrawal request'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO wallet_transactions (user_id, type, amount, status, description)
SELECT id, 'deposit', 250.00, 'completed', 'Wallet funding'
FROM users WHERE user_type = 'user' LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample stripe payment attempts using real users
INSERT INTO stripe_payment_attempts (order_id, customer_id, amount, status)
SELECT 'ORD001', id, 150.00, 'succeeded'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO stripe_payment_attempts (order_id, customer_id, amount, status)
SELECT 'ORD002', id, 75.00, 'failed'
FROM users WHERE user_type = 'user' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO stripe_payment_attempts (order_id, customer_id, amount, status)
SELECT 'ORD003', id, 200.00, 'pending'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample pending payments using real users
INSERT INTO pending_payments (order_id, customer_id, payment_method, amount, status)
SELECT 'ORD004', id, 'paypal', 300.00, 'pending_confirmation'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO pending_payments (order_id, customer_id, payment_method, amount, status)
SELECT 'ORD005', id, 'crypto', 100.00, 'pending'
FROM users WHERE user_type = 'user' LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample security logs using real users
INSERT INTO payment_security_logs (user_id, event_type, event_data)
SELECT id, 'payment_initiated', '{"amount": 150, "method": "stripe"}'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO payment_security_logs (user_id, event_type, event_data)
SELECT id, 'payment_failed', '{"reason": "insufficient_funds"}'
FROM users WHERE user_type = 'user' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO payment_security_logs (user_id, event_type, event_data)
SELECT id, 'login_attempt', '{"ip": "192.168.1.1"}'
FROM users WHERE user_type = 'partner' LIMIT 1
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE stripe_payment_attempts IS 'Records of Stripe payment attempts with metadata';
COMMENT ON TABLE pending_payments IS 'Pending PayPal and cryptocurrency payments awaiting confirmation';
COMMENT ON TABLE wallet_transactions IS 'Transaction history for user wallets';
COMMENT ON TABLE wallet_balances IS 'Current balance for each user wallet';
COMMENT ON TABLE payment_security_logs IS 'Security and audit logs for payment events';

COMMENT ON VIEW v_stripe_payment_attempts_with_users IS 'Stripe payment attempts with user details';
COMMENT ON VIEW v_pending_payments_with_users IS 'Pending payments with user details';
COMMENT ON VIEW v_payment_security_logs_with_users IS 'Security logs with user details';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Payment tables created successfully using real user data!';
    RAISE NOTICE 'Sample data inserted using existing users from your database';
    RAISE NOTICE 'Foreign key constraints now properly reference existing users';
END $$;
