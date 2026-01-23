-- Insert the specific order you're trying to access
-- This creates ORD-1769169628785 for user laurentjean535@gmail.com

-- Find the user ID for laurentjean535@gmail.com
DO $$
DECLARE
    user_uuid UUID;
    order_exists BOOLEAN;
BEGIN
    -- Find the specific user
    SELECT id INTO user_uuid FROM users WHERE email = 'laurentjean535@gmail.com' LIMIT 1;
    
    -- If user not found, we can't proceed
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User laurentjean535@gmail.com not found in database.';
    END IF;
    
    RAISE NOTICE 'Using user ID: %', user_uuid;
    
    -- Check if order already exists
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = 'ORD-1769169628785') INTO order_exists;
    
    IF order_exists THEN
        RAISE NOTICE 'Order ORD-1769169628785 already exists, updating...';
    END IF;
    
    -- Insert or update the specific order you're trying to access
    INSERT INTO orders (
        order_number,
        customer_id,
        total_amount,
        status,
        payment_status,
        payment_method,
        shipping_address,
        billing_address,
        notes
    ) VALUES (
        'ORD-1769169628785',
        user_uuid,
        149.99,
        'pending',
        'pending',
        'wallet',
        '{"full_name": "Laurent Jean", "address_line_1": "456 Customer Ave", "address_line_2": "", "city": "Customer City", "state": "CC", "postal_code": "67890", "country": "United States", "phone": "+1987654321"}',
        '{"full_name": "Laurent Jean", "address_line_1": "456 Customer Ave", "address_line_2": "", "city": "Customer City", "state": "CC", "postal_code": "67890", "country": "United States", "phone": "+1987654321"}',
        'Customer order for debugging purposes'
    ) ON CONFLICT (order_number) DO UPDATE SET
        customer_id = EXCLUDED.customer_id,
        total_amount = EXCLUDED.total_amount,
        status = EXCLUDED.status,
        payment_status = EXCLUDED.payment_status,
        payment_method = EXCLUDED.payment_method,
        shipping_address = EXCLUDED.shipping_address,
        billing_address = EXCLUDED.billing_address,
        notes = EXCLUDED.notes;
    
    RAISE NOTICE 'Order ORD-1769169628785 inserted/updated successfully';
END $$;

-- Verify the order was inserted
SELECT 
    id,
    order_number,
    customer_id,
    total_amount,
    status,
    payment_status,
    created_at
FROM orders 
WHERE order_number = 'ORD-1769169628785';

-- Insert some sample order items for this order
DO $$
DECLARE
    order_uuid UUID;
    product_uuid UUID;
BEGIN
    -- Get the order ID
    SELECT id INTO order_uuid FROM orders WHERE order_number = 'ORD-1769169628785';
    
    IF order_uuid IS NULL THEN
        RAISE EXCEPTION 'Order not found, cannot insert items';
    END IF;
    
    -- Try to find the carina product
    SELECT id INTO product_uuid FROM products WHERE title = 'carina' LIMIT 1;
    
    IF product_uuid IS NULL THEN
        -- Create the carina product if it doesn't exist
        INSERT INTO products (
            id,
            title,
            description,
            price,
            category,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'carina',
            'Carina product for order testing',
            149.99,
            'cars',
            NOW(),
            NOW()
        ) ON CONFLICT DO NOTHING;
        
        -- Get the product ID
        SELECT id INTO product_uuid FROM products WHERE title = 'carina' LIMIT 1;
    END IF;
    
    IF product_uuid IS NOT NULL THEN
        -- Insert sample order items
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            unit_price
        ) VALUES 
        (
            order_uuid,
            product_uuid,
            1,
            149.99
        )
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Order items inserted for order %', order_uuid;
    ELSE
        RAISE NOTICE 'Carina product not found, skipping order items insertion';
    END IF;
END $$;

-- Check the final result
SELECT 
    o.id,
    o.order_number,
    o.customer_id,
    u.email as customer_email,
    o.total_amount,
    o.status,
    o.payment_status,
    oi.quantity,
    oi.unit_price,
    oi.subtotal,
    p.title as product_title
FROM orders o
LEFT JOIN users u ON o.customer_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'ORD-1769169628785';
