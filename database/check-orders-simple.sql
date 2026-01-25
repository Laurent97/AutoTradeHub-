-- ========================================
-- QUICK ORDERS TABLE CHECK
-- ========================================

-- 1. Check orders table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'orders'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints on orders table
SELECT 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
    AND tc.table_name = 'orders'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 3. Check actual orders data
SELECT 
    id,
    order_number,
    customer_id,
    total_amount,
    status,
    payment_status,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
