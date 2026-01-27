-- Fix missing user profiles for users who exist in auth.users but not in public.users
-- This script identifies and creates missing user profiles

-- Step 1: Find users who exist in auth.users but not in public.users
SELECT 'Finding missing user profiles...' as status;

WITH missing_users AS (
    SELECT 
        au.id,
        au.email,
        au.raw_user_meta_data->>'full_name' as full_name,
        au.created_at
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
    AND au.email IS NOT NULL
)
SELECT 
    'Missing user profiles' as info,
    COUNT(*) as count,
    STRING_AGG(email, ', ') as sample_emails
FROM missing_users;

-- Step 2: Create missing user profiles
INSERT INTO public.users (
    id,
    email,
    full_name,
    user_type,
    created_at,
    updated_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
    'user',
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the fix
SELECT 'Verification - Missing profiles created:' as status;

WITH verification AS (
    SELECT 
        au.id,
        au.email,
        CASE WHEN pu.id IS NOT NULL THEN 'Fixed' ELSE 'Still Missing' END as status
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE au.email IS NOT NULL
)
SELECT 
    status,
    COUNT(*) as count
FROM verification
GROUP BY status;

-- Step 4: Show total counts after fix
SELECT 'Final user counts:' as info;
SELECT 
    'auth.users' as table_name,
    COUNT(*) as user_count
FROM auth.users
UNION ALL
SELECT 
    'public.users' as table_name,
    COUNT(*) as user_count
FROM public.users;

-- Step 5: Create wallet balances for any users who don't have them
INSERT INTO public.wallet_balances (
    user_id,
    balance,
    currency,
    created_at,
    updated_at
)
SELECT 
    pu.id,
    0.00,
    'USD',
    NOW(),
    NOW()
FROM public.users pu
LEFT JOIN public.wallet_balances wb ON pu.id = wb.user_id
WHERE wb.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

SELECT 'Wallet balances created for missing users' as status;
