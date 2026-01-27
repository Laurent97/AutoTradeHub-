-- Fix RLS policies for wallet_transactions table
-- This file resolves the "new row violates row-level security policy" error for partner withdrawals

-- First, ensure RLS is enabled on the table
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON wallet_transactions;

-- Create policy for users to view their own transactions
CREATE POLICY "Users can view own transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own transactions (withdrawals and deposits)
CREATE POLICY "Users can insert own transactions" ON wallet_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own transactions (if needed)
CREATE POLICY "Users can update own transactions" ON wallet_transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Ensure RLS is enabled on wallet_balances table as well
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for wallet_balances if they exist
DROP POLICY IF EXISTS "Users can view own balance" ON wallet_balances;
DROP POLICY IF EXISTS "Users can update own balance" ON wallet_balances;

-- Create policies for wallet_balances
CREATE POLICY "Users can view own balance" ON wallet_balances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balance" ON wallet_balances
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT ON wallet_transactions TO authenticated;
GRANT SELECT, UPDATE ON wallet_balances TO authenticated;

-- Allow service role to bypass RLS for admin operations
ALTER TABLE wallet_transactions FORCE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances FORCE ROW LEVEL SECURITY;
