# Database Setup and RLS Policies

This directory contains SQL migration files for setting up and fixing database policies.

## Fixing Partner Withdrawal RLS Issue

If you're encountering the error:
```
new row violates row-level security policy for table "wallet_transactions"
```

You need to apply the RLS policy fixes by running the SQL file:

### Using Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix_wallet_rls_policies.sql`
4. Click **Run** to execute the SQL commands

### Using Supabase CLI:

```bash
supabase db push
```

Or if you want to apply the specific file:

```bash
supabase db reset  # This will reset and apply all migrations
```

## What the RLS Policies Do:

1. **Enable RLS** on `wallet_transactions` and `wallet_balances` tables
2. **Allow users** to:
   - View their own wallet transactions and balances
   - Insert new withdrawal and deposit transactions
   - Update their own transactions (if needed)
3. **Maintain security** by ensuring users can only access their own data
4. **Grant permissions** to authenticated users for wallet operations

## Tables Affected:

- `wallet_transactions` - Stores all wallet transaction records
- `wallet_balances` - Stores user wallet balances

## Verification:

After applying the policies, partners should be able to:
1. View their wallet balance
2. Submit withdrawal requests
3. View their transaction history
4. Receive proper error messages for insufficient funds

## Troubleshooting:

If issues persist after applying the policies:

1. Check that the user is properly authenticated
2. Verify the `auth.uid()` matches the `user_id` in the tables
3. Ensure the tables exist and have the correct structure
4. Check Supabase logs for detailed error information

## Security Notes:

- These policies ensure users can only access their own financial data
- Admin operations should use service role keys to bypass RLS when needed
- All wallet operations are logged for audit purposes
