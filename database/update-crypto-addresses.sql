-- Update Crypto Addresses Script
-- Run this script to update existing crypto addresses with new real addresses
-- This script handles existing data gracefully using UPSERT operations

-- Update or insert crypto addresses with real wallet addresses
INSERT INTO crypto_addresses (crypto_type, address, is_active, network, xrp_tag) 
VALUES 
    ('BTC', '1FTUbAx5QNTWbxyerMPpxRbwqH3XnvwKQb', true, 'mainnet', NULL),
    ('USDT', 'TYdFjAfhWL9DjaDBAe5LS7zUjBqpYGkRYB', true, 'TRON', NULL),
    ('ETH', '0xd5fffaa3740af39c265563aec8c14bd08c05e838', true, 'mainnet', NULL),
    ('XRP', 'rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV', true, 'mainnet', '476565842')
ON CONFLICT (crypto_type) 
DO UPDATE SET 
    address = EXCLUDED.address,
    is_active = EXCLUDED.is_active,
    network = EXCLUDED.network,
    xrp_tag = EXCLUDED.xrp_tag,
    updated_at = NOW();

-- Update payment method configuration with new crypto addresses
INSERT INTO payment_method_config (method_name, enabled, customer_access, partner_access, admin_access, admin_confirmation_required, collect_data_only, config_data) 
VALUES 
    ('crypto', true, true, true, true, true, false, '{"wallets": {"BTC": "1FTUbAx5QNTWbxyerMPpxRbwqH3XnvwKQb", "USDT": "TYdFjAfhWL9DjaDBAe5LS7zUjBqpYGkRYB", "ETH": "0xd5fffaa3740af39c265563aec8c14bd08c05e838", "XRP": "rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV", "XRP_TAG": "476565842"}}')
ON CONFLICT (method_name) 
DO UPDATE SET 
    config_data = EXCLUDED.config_data,
    updated_at = NOW();

-- Verify the updates
SELECT 
    crypto_type,
    address,
    is_active,
    network,
    xrp_tag,
    updated_at
FROM crypto_addresses 
ORDER BY crypto_type;

-- Success message
SELECT 'Crypto addresses updated successfully!' as status;
