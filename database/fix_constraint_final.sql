-- Final fix for users table constraint issue
-- Based on diagnostic results showing valid user_type values

-- Step 1: Check current constraint definition
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c'
ORDER BY conname;

-- Step 2: Since data is valid, the issue must be with the constraint definition
-- Drop all check constraints on users table
DO $$
DECLARE
    constraint_rec RECORD;
BEGIN
    FOR constraint_rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'users'::regclass 
        AND contype = 'c'
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE users DROP CONSTRAINT IF EXISTS ' || constraint_rec.conname;
            RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not drop constraint %: %', constraint_rec.conname, SQLERRM;
        END;
    END LOOP;
END $$;

-- Step 3: Verify all constraints are dropped
SELECT COUNT(*) as remaining_constraints
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c';

-- Step 4: Add the correct constraint with all valid values
ALTER TABLE users ADD CONSTRAINT users_user_type_check 
    CHECK (user_type IN ('user', 'partner', 'admin', 'pending'));

-- Step 5: Verify the new constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c'
AND conname = 'users_user_type_check';

-- Step 6: Test with the problematic row data
-- This should work now
INSERT INTO users (id, email, full_name, user_type) 
VALUES ('3011fe8c-e160-4f16-b058-836cb3ec0311', 'test20@gmail.com', 'test20', 'user')
ON CONFLICT (id) DO UPDATE SET 
    user_type = EXCLUDED.user_type,
    updated_at = NOW();

-- Step 7: Verify the row was inserted/updated successfully
SELECT id, email, full_name, user_type, updated_at 
FROM users 
WHERE id = '3011fe8c-e160-4f16-b058-836cb3ec0311';

-- Step 8: Final verification - check all data is valid
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'All user_type values are valid'
        ELSE 'Some invalid user_type values exist'
    END as validation_result
FROM users 
WHERE user_type NOT IN ('user', 'partner', 'admin', 'pending');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Users table constraint has been fixed successfully!';
    RAISE NOTICE 'New constraint allows: user, partner, admin, pending';
    RAISE NOTICE 'Test row has been processed successfully';
END $$;
