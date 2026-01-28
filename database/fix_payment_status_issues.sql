-- Fix payment status issues between orders and pending_payments tables
-- This script identifies and fixes cases where orders show 'pending' payment status 
-- but payments have been confirmed in pending_payments

-- First, let's see the current state of problematic orders
SELECT 
  'CURRENT ISSUES' as analysis_type,
  o.id as order_id,
  o.order_number,
  o.payment_status as order_payment_status,
  o.status as order_status,
  pp.id as payment_id,
  pp.order_id as payment_order_id,
  pp.status as payment_table_status,
  pp.payment_method,
  pp.amount,
  pp.confirmed_at
FROM orders o
LEFT JOIN pending_payments pp ON (
  o.order_number = pp.order_id OR 
  o.id::text = pp.order_id OR
  pp.order_id LIKE '%' || o.order_number || '%'
)
WHERE o.payment_status = 'pending' 
  AND pp.status IN ('confirmed', 'pending_confirmation')
ORDER BY o.created_at DESC;

-- Fix 1: Update orders where payment was confirmed but order status wasn't updated
-- Match by order_number first
UPDATE orders 
SET 
  payment_status = 'paid',
  status = 'confirmed',
  updated_at = NOW()
WHERE payment_status = 'pending'
  AND EXISTS (
    SELECT 1 FROM pending_payments pp 
    WHERE pp.order_id = orders.order_number 
    AND pp.status = 'confirmed'
  );

-- Fix 2: Update orders where payment was confirmed but order status wasn't updated
-- Match by order_id (UUID) as string
UPDATE orders 
SET 
  payment_status = 'paid',
  status = 'confirmed',
  updated_at = NOW()
WHERE payment_status = 'pending'
  AND EXISTS (
    SELECT 1 FROM pending_payments pp 
    WHERE pp.order_id = orders.id::text 
    AND pp.status = 'confirmed'
  );

-- Fix 3: Update orders where payment is pending_confirmation but should be treated as paid
UPDATE orders 
SET 
  payment_status = 'paid',
  status = 'confirmed',
  updated_at = NOW()
WHERE payment_status = 'pending'
  AND EXISTS (
    SELECT 1 FROM pending_payments pp 
    WHERE (pp.order_id = orders.order_number OR pp.order_id = orders.id::text)
    AND pp.status = 'pending_confirmation'
  );

-- Show the results after fixes
SELECT 
  'AFTER FIXES' as analysis_type,
  o.id as order_id,
  o.order_number,
  o.payment_status as order_payment_status,
  o.status as order_status,
  pp.id as payment_id,
  pp.order_id as payment_order_id,
  pp.status as payment_table_status,
  pp.payment_method,
  pp.amount,
  pp.confirmed_at
FROM orders o
LEFT JOIN pending_payments pp ON (
  o.order_number = pp.order_id OR 
  o.id::text = pp.order_id OR
  pp.order_id LIKE '%' || o.order_number || '%'
)
WHERE o.payment_status = 'pending' 
  AND pp.status IN ('confirmed', 'pending_confirmation')
ORDER BY o.created_at DESC;

-- Also check for any orders that might have been shipped but still show pending payment
SELECT 
  'SHIPPED ORDERS WITH PENDING PAYMENT' as analysis_type,
  o.id as order_id,
  o.order_number,
  o.payment_status as order_payment_status,
  o.status as order_status,
  pp.id as payment_id,
  pp.order_id as payment_order_id,
  pp.status as payment_table_status,
  pp.payment_method,
  pp.amount
FROM orders o
LEFT JOIN pending_payments pp ON (
  o.order_number = pp.order_id OR 
  o.id::text = pp.order_id
)
WHERE o.status = 'shipped' 
  AND o.payment_status = 'pending'
ORDER BY o.created_at DESC;

-- Force fix shipped orders with confirmed payments
UPDATE orders 
SET 
  payment_status = 'paid',
  updated_at = NOW()
WHERE status = 'shipped' 
  AND payment_status = 'pending'
  AND EXISTS (
    SELECT 1 FROM pending_payments pp 
    WHERE (pp.order_id = orders.order_number OR pp.order_id = orders.id::text)
    AND pp.status IN ('confirmed', 'pending_confirmation')
  );
