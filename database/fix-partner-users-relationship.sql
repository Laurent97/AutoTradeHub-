-- Fix Partner Profiles and Users Relationship
-- This script adds the missing foreign key constraint between partner_profiles and users tables

-- First, let's check if the foreign key constraint already exists
DO $$
BEGIN
    -- Check if constraint exists, if not create it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'partner_profiles_user_id_fkey' 
        AND table_name = 'partner_profiles'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Add foreign key constraint
        ALTER TABLE partner_profiles 
        ADD CONSTRAINT partner_profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Added foreign key constraint: partner_profiles_user_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Also ensure the user_id column exists and is properly typed
DO $$
BEGIN
    -- Check if user_id column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'partner_profiles' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE partner_profiles ADD COLUMN user_id UUID;
        RAISE NOTICE 'Added user_id column to partner_profiles';
    END IF;
END $$;

-- Grant necessary permissions for the relationship to work in Supabase
GRANT REFERENCES ON TABLE users TO anon, authenticated;
GRANT REFERENCES ON TABLE partner_profiles TO anon, authenticated;

-- Enable Row Level Security if not already enabled
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create or replace policies to allow the join to work
DROP POLICY IF EXISTS "Partner profiles are viewable by everyone" ON partner_profiles;
CREATE POLICY "Partner profiles are viewable by everyone" ON partner_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Update the partner_profiles table to ensure proper indexing
CREATE INDEX IF NOT EXISTS idx_partner_profiles_user_id ON partner_profiles(user_id);

-- Verify the relationship
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
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
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'partner_profiles';
