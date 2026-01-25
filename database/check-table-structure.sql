-- ========================================
-- TABLE STRUCTURE INSPECTION SCRIPT
-- ========================================
-- This script will help us understand the database schema
-- and identify any foreign key constraint names

-- 1. Check orders table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'orders'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints on orders table
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.table_name = 'orders'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 3. Check order_items table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'order_items'
ORDER BY ordinal_position;

-- 4. Check foreign key constraints on order_items table
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.table_name = 'order_items'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 5. Check users table structure (for reference)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- 6. Check products table structure (for reference)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'products'
ORDER BY ordinal_position;

-- 7. List all tables in the database
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 8. Check if there are any orders in the database
SELECT 
    COUNT(*) as total_orders,
    MIN(created_at) as oldest_order,
    MAX(created_at) as newest_order
FROM orders;

-- 9. Sample orders data (first 5 orders)
SELECT 
    id,
    order_number,
    customer_id,
    partner_id,
    total_amount,
    status,
    payment_status,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- 10. Sample order_items data (first 5 items)
SELECT 
    id,
    order_id,
    product_id,
    quantity,
    unit_price,
    created_at
FROM order_items 
ORDER BY created_at DESC 
LIMIT 5;
