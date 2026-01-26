-- Create email_settings and payment_settings tables
-- These tables are required by the Admin Settings component

-- Create email_settings table
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    smtp_host VARCHAR(255),
    smtp_port INTEGER DEFAULT 587,
    smtp_username VARCHAR(255),
    smtp_password VARCHAR(255),
    smtp_encryption VARCHAR(20) DEFAULT 'tls', -- 'tls', 'ssl', 'none'
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    reply_to_email VARCHAR(255),
    enabled BOOLEAN DEFAULT true,
    test_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_public_key VARCHAR(255),
    stripe_secret_key VARCHAR(255),
    stripe_webhook_secret VARCHAR(255),
    paypal_client_id VARCHAR(255),
    paypal_client_secret VARCHAR(255),
    paypal_sandbox BOOLEAN DEFAULT true,
    crypto_enabled BOOLEAN DEFAULT true,
    bank_transfer_enabled BOOLEAN DEFAULT true,
    wallet_enabled BOOLEAN DEFAULT true,
    currency VARCHAR(3) DEFAULT 'USD',
    auto_approve_threshold DECIMAL(10,2) DEFAULT 100.00,
    require_admin_confirmation BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default email settings
INSERT INTO email_settings (
    smtp_host,
    smtp_port,
    smtp_username,
    from_email,
    from_name,
    reply_to_email,
    enabled
) VALUES (
    'smtp.gmail.com',
    587,
    'noreply@autotradehub.com',
    'noreply@autotradehub.com',
    'AutoTradeHub',
    'support@autotradehub.com',
    false
) ON CONFLICT DO NOTHING;

-- Insert default payment settings
INSERT INTO payment_settings (
    stripe_public_key,
    stripe_secret_key,
    paypal_client_id,
    paypal_client_secret,
    paypal_sandbox,
    crypto_enabled,
    bank_transfer_enabled,
    wallet_enabled,
    currency,
    auto_approve_threshold,
    require_admin_confirmation
) VALUES (
    'pk_test_...',
    'sk_test_...',
    'test_paypal_client_id',
    'test_paypal_client_secret',
    true,
    true,
    true,
    true,
    'USD',
    100.00,
    true
) ON CONFLICT DO NOTHING;

-- Create trigger to update updated_at for email_settings
DROP TRIGGER IF EXISTS update_email_settings_updated_at ON email_settings;
CREATE TRIGGER update_email_settings_updated_at 
    BEFORE UPDATE ON email_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at for payment_settings
DROP TRIGGER IF EXISTS update_payment_settings_updated_at ON payment_settings;
CREATE TRIGGER update_payment_settings_updated_at 
    BEFORE UPDATE ON payment_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Settings tables created successfully!' as status;
