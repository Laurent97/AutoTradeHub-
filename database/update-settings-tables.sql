-- Update existing email_settings and payment_settings tables
-- This script adds missing columns to existing tables

-- Check and add missing columns to email_settings table
DO $$
BEGIN
    -- Add smtp_host if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'smtp_host') THEN
        ALTER TABLE email_settings ADD COLUMN smtp_host VARCHAR(255);
    END IF;
    
    -- Add smtp_port if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'smtp_port') THEN
        ALTER TABLE email_settings ADD COLUMN smtp_port INTEGER DEFAULT 587;
    END IF;
    
    -- Add smtp_username if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'smtp_username') THEN
        ALTER TABLE email_settings ADD COLUMN smtp_username VARCHAR(255);
    END IF;
    
    -- Add smtp_password if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'smtp_password') THEN
        ALTER TABLE email_settings ADD COLUMN smtp_password VARCHAR(255);
    END IF;
    
    -- Add smtp_encryption if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'smtp_encryption') THEN
        ALTER TABLE email_settings ADD COLUMN smtp_encryption VARCHAR(20) DEFAULT 'tls';
    END IF;
    
    -- Add from_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'from_email') THEN
        ALTER TABLE email_settings ADD COLUMN from_email VARCHAR(255) NOT NULL DEFAULT 'noreply@autotradehub.com';
    END IF;
    
    -- Add from_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'from_name') THEN
        ALTER TABLE email_settings ADD COLUMN from_name VARCHAR(255) NOT NULL DEFAULT 'AutoTradeHub';
    END IF;
    
    -- Add reply_to_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'reply_to_email') THEN
        ALTER TABLE email_settings ADD COLUMN reply_to_email VARCHAR(255);
    END IF;
    
    -- Add enabled if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'enabled') THEN
        ALTER TABLE email_settings ADD COLUMN enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- Add test_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'test_email') THEN
        ALTER TABLE email_settings ADD COLUMN test_email VARCHAR(255);
    END IF;
    
    -- Add created_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'created_at') THEN
        ALTER TABLE email_settings ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_settings' AND column_name = 'updated_at') THEN
        ALTER TABLE email_settings ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- Check and add missing columns to payment_settings table
DO $$
BEGIN
    -- Add stripe_public_key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'stripe_public_key') THEN
        ALTER TABLE payment_settings ADD COLUMN stripe_public_key VARCHAR(255);
    END IF;
    
    -- Add stripe_secret_key if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'stripe_secret_key') THEN
        ALTER TABLE payment_settings ADD COLUMN stripe_secret_key VARCHAR(255);
    END IF;
    
    -- Add stripe_webhook_secret if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'stripe_webhook_secret') THEN
        ALTER TABLE payment_settings ADD COLUMN stripe_webhook_secret VARCHAR(255);
    END IF;
    
    -- Add paypal_client_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'paypal_client_id') THEN
        ALTER TABLE payment_settings ADD COLUMN paypal_client_id VARCHAR(255);
    END IF;
    
    -- Add paypal_client_secret if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'paypal_client_secret') THEN
        ALTER TABLE payment_settings ADD COLUMN paypal_client_secret VARCHAR(255);
    END IF;
    
    -- Add paypal_sandbox if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'paypal_sandbox') THEN
        ALTER TABLE payment_settings ADD COLUMN paypal_sandbox BOOLEAN DEFAULT true;
    END IF;
    
    -- Add crypto_enabled if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'crypto_enabled') THEN
        ALTER TABLE payment_settings ADD COLUMN crypto_enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- Add bank_transfer_enabled if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'bank_transfer_enabled') THEN
        ALTER TABLE payment_settings ADD COLUMN bank_transfer_enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- Add wallet_enabled if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'wallet_enabled') THEN
        ALTER TABLE payment_settings ADD COLUMN wallet_enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- Add currency if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'currency') THEN
        ALTER TABLE payment_settings ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
    END IF;
    
    -- Add auto_approve_threshold if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'auto_approve_threshold') THEN
        ALTER TABLE payment_settings ADD COLUMN auto_approve_threshold DECIMAL(10,2) DEFAULT 100.00;
    END IF;
    
    -- Add require_admin_confirmation if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'require_admin_confirmation') THEN
        ALTER TABLE payment_settings ADD COLUMN require_admin_confirmation BOOLEAN DEFAULT true;
    END IF;
    
    -- Add created_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'created_at') THEN
        ALTER TABLE payment_settings ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_settings' AND column_name = 'updated_at') THEN
        ALTER TABLE payment_settings ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- Insert default data if tables are empty
INSERT INTO email_settings (
    smtp_host, smtp_port, smtp_username, from_email, from_name, reply_to_email, enabled
) 
SELECT 'smtp.gmail.com', 587, 'noreply@autotradehub.com', 'noreply@autotradehub.com', 'AutoTradeHub', 'support@autotradehub.com', false
WHERE NOT EXISTS (SELECT 1 FROM email_settings LIMIT 1);

INSERT INTO payment_settings (
    stripe_public_key, stripe_secret_key, paypal_client_id, paypal_client_secret, 
    paypal_sandbox, crypto_enabled, bank_transfer_enabled, wallet_enabled, 
    currency, auto_approve_threshold, require_admin_confirmation
) 
SELECT 'pk_test_...', 'sk_test_...', 'test_paypal_client_id', 'test_paypal_client_secret', 
    true, true, true, true, 'USD', 100.00, true
WHERE NOT EXISTS (SELECT 1 FROM payment_settings LIMIT 1);

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_email_settings_updated_at ON email_settings;
CREATE TRIGGER update_email_settings_updated_at 
    BEFORE UPDATE ON email_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON payment_settings;
CREATE TRIGGER update_payment_settings_updated_at 
    BEFORE UPDATE ON payment_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Settings tables updated successfully!' as status;
