-- Fix duplicate function issue
-- Drop all versions of get_or_create_user_simple and create the correct one

-- Step 1: Drop all existing versions of the function
DROP FUNCTION IF EXISTS get_or_create_user_simple(text) CASCADE;
DROP FUNCTION IF EXISTS get_or_create_user_simple(text, text) CASCADE;
DROP FUNCTION IF EXISTS get_or_create_user_simple(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS get_or_create_user_simple() CASCADE;
DROP FUNCTION IF EXISTS get_or_create_user_simple CASCADE;

-- Step 2: Create the correct version with all parameters
CREATE OR REPLACE FUNCTION get_or_create_user_simple(
    user_email TEXT,
    user_full_name TEXT DEFAULT NULL,
    user_type TEXT DEFAULT 'user'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_user_id UUID;
    new_user_id UUID;
BEGIN
    -- First, try to find existing user by email
    SELECT id INTO existing_user_id
    FROM users
    WHERE email = user_email
    LIMIT 1;
    
    -- If user exists, return their ID
    IF existing_user_id IS NOT NULL THEN
        RETURN existing_user_id;
    END IF;
    
    -- If user doesn't exist, create them
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Insert the new user with the provided user_type
    INSERT INTO users (
        id,
        email,
        full_name,
        user_type,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        user_email,
        user_full_name,
        user_type,
        NOW(),
        NOW()
    );
    
    -- Return the new user ID
    RETURN new_user_id;
    
EXCEPTION
    WHEN unique_violation THEN
        -- Handle race condition where user was created by another process
        SELECT id INTO existing_user_id
        FROM users
        WHERE email = user_email
        LIMIT 1;
        
        IF existing_user_id IS NOT NULL THEN
            RETURN existing_user_id;
        ELSE
            RAISE EXCEPTION 'Failed to create or retrieve user for email: %', user_email;
        END IF;
END;
$$;

-- Step 3: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_user_simple TO authenticated;

-- Step 4: Verify the function was created correctly
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments,
    pg_get_function_result(oid) as return_type
FROM pg_proc 
WHERE proname = 'get_or_create_user_simple';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'get_or_create_user_simple function has been recreated successfully!';
    RAISE NOTICE 'Function signature: get_or_create_user_simple(user_email text, user_full_name text DEFAULT NULL, user_type text DEFAULT ''user'')';
    RAISE NOTICE 'Returns: UUID';
END $$;
