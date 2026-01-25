-- ========================================
-- TEST ORDER LOOKUP
-- ========================================

-- Test looking up one of your existing orders
-- Replace with any order number from the list above

SELECT 
    o.*,
    u.email,
    u.full_name
FROM orders o
LEFT JOIN users u ON o.customer_id = u.id
WHERE o.order_number = 'ORD-1769174183616-SU6K5QDE3';

-- Test the foreign key relationship
SELECT 
    o.order_number,
    o.customer_id,
    u.email as customer_email,
    u.full_name as customer_name
FROM orders o
INNER JOIN users u ON o.customer_id = u.id
WHERE o.customer_id = 'e2731c06-58b4-4f37-96c7-f721af43263c'
LIMIT 5;
