-- Check current state of crypto addresses
-- Run this script to diagnose the issue

-- Check if table exists
SELECT 
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'crypto_addresses'
    ) as table_exists;

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'crypto_addresses'
ORDER BY ordinal_position;

-- Check current data in crypto_addresses
SELECT 
    crypto_type,
    address,
    is_active,
    network,
    xrp_tag,
    created_at,
    updated_at
FROM crypto_addresses 
ORDER BY crypto_type;

-- Check if there are any active addresses
SELECT 
    COUNT(*) as total_addresses,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_addresses
FROM crypto_addresses;

-- Check payment method config
SELECT 
    method_name,
    enabled,
    config_data
FROM payment_method_config 
WHERE method_name = 'crypto';
