-- Update existing crypto addresses script
-- Use this if crypto addresses already exist but need to be updated/activated

-- Update existing crypto addresses with real wallet addresses
UPDATE crypto_addresses 
SET 
    address = '1FTUbAx5QNTWbxyerMPpxRbwqH3XnvwKQb',
    is_active = true,
    network = 'mainnet',
    xrp_tag = NULL,
    updated_at = NOW()
WHERE crypto_type = 'BTC';

UPDATE crypto_addresses 
SET 
    address = 'TYdFjAfhWL9DjaDBAe5LS7zUjBqpYGkRYB',
    is_active = true,
    network = 'TRON',
    xrp_tag = NULL,
    updated_at = NOW()
WHERE crypto_type = 'USDT';

UPDATE crypto_addresses 
SET 
    address = '0xd5fffaa3740af39c265563aec8c14bd08c05e838',
    is_active = true,
    network = 'mainnet',
    xrp_tag = NULL,
    updated_at = NOW()
WHERE crypto_type = 'ETH';

UPDATE crypto_addresses 
SET 
    address = 'rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV',
    is_active = true,
    network = 'mainnet',
    xrp_tag = '476565842',
    updated_at = NOW()
WHERE crypto_type = 'XRP';

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

-- Check active addresses count
SELECT 
    COUNT(*) as total_addresses,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_addresses
FROM crypto_addresses;

-- Success message
SELECT 'Crypto addresses updated successfully!' as status;
