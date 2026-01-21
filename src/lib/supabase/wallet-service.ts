import { supabase } from './client';

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'order_payment' | 'order_refund' | 'commission' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  payment_method?: string;
  order_id?: string;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  total_deposits: number;
  total_withdrawals: number;
  last_updated: string;
  created_at: string;
}

export interface WalletStats {
  totalEarnings: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingBalance: number;
  availableBalance: number;
  transactionCount: number;
  lastTransaction?: WalletTransaction;
}

export const walletService = {
  // Get wallet balance
  async getBalance(userId: string): Promise<{ data: WalletBalance | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If no balance record exists, create one
      if (error && error.code === 'PGRST116') {
        const { data: newBalance, error: insertError } = await supabase
          .from('wallet_balances')
          .insert({
            user_id: userId,
            available_balance: 0,
            pending_balance: 0,
            total_earnings: 0,
            total_deposits: 0,
            total_withdrawals: 0,
            last_updated: new Date().toISOString()
          })
          .select()
          .single();

        return { data: newBalance, error: insertError };
      }

      return { data, error };
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return { data: null, error };
    }
  },

  // Get wallet transactions
  async getTransactions(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<{ data: WalletTransaction[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      return { data: [], error };
    }
  },

  // Get wallet statistics
  async getStats(userId: string): Promise<{ data: WalletStats; error: any }> {
    try {
      // Get balance
      const { data: balance } = await this.getBalance(userId);

      // Get transactions
      const { data: transactions } = await this.getTransactions(userId, 1000);

      // Calculate stats
      const stats: WalletStats = {
        totalEarnings: balance?.total_earnings || 0,
        totalDeposits: balance?.total_deposits || 0,
        totalWithdrawals: balance?.total_withdrawals || 0,
        pendingBalance: balance?.pending_balance || 0,
        availableBalance: balance?.available_balance || 0,
        transactionCount: transactions?.length || 0,
        lastTransaction: transactions?.[0] || undefined
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting wallet stats:', error);
      return { 
        data: {
          totalEarnings: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          pendingBalance: 0,
          availableBalance: 0,
          transactionCount: 0
        }, 
        error 
      };
    }
  },

  // Create a transaction record
  async createTransaction(
    userId: string,
    type: WalletTransaction['type'],
    amount: number,
    description: string,
    options?: {
      payment_method?: string;
      order_id?: string;
      transaction_hash?: string;
    }
  ): Promise<{ data: WalletTransaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          type,
          amount,
          status: 'pending',
          description,
          payment_method: options?.payment_method,
          order_id: options?.order_id,
          transaction_hash: options?.transaction_hash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating transaction:', error);
      return { data: null, error };
    }
  },

  // Update transaction status
  async updateTransactionStatus(
    transactionId: string,
    status: WalletTransaction['status']
  ): Promise<{ data: WalletTransaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return { data: null, error };
    }
  },

  // Update wallet balance
  async updateBalance(
    userId: string,
    availableBalance: number,
    pendingBalance?: number,
    options?: {
      total_earnings?: number;
      total_deposits?: number;
      total_withdrawals?: number;
    }
  ): Promise<{ data: WalletBalance | null; error: any }> {
    try {
      const updateData: any = {
        available_balance: availableBalance,
        last_updated: new Date().toISOString()
      };

      if (pendingBalance !== undefined) {
        updateData.pending_balance = pendingBalance;
      }

      if (options?.total_earnings !== undefined) {
        updateData.total_earnings = options.total_earnings;
      }

      if (options?.total_deposits !== undefined) {
        updateData.total_deposits = options.total_deposits;
      }

      if (options?.total_withdrawals !== undefined) {
        updateData.total_withdrawals = options.total_withdrawals;
      }

      const { data, error } = await supabase
        .from('wallet_balances')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return { data: null, error };
    }
  },

  // Process deposit
  async processDeposit(
    userId: string,
    amount: number,
    paymentMethod: string,
    transactionHash?: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      // Create transaction record
      const { data: transaction, error: transactionError } = await this.createTransaction(
        userId,
        'deposit',
        amount,
        `Deposit via ${paymentMethod}`,
        {
          payment_method: paymentMethod,
          transaction_hash: transactionHash
        }
      );

      if (transactionError || !transaction) {
        return { success: false, error: transactionError };
      }

      // Get current balance
      const { data: balance } = await this.getBalance(userId);
      if (!balance) {
        return { success: false, error: 'Balance not found' };
      }

      // Update balance
      const newAvailableBalance = balance.available_balance + amount;
      const newTotalDeposits = balance.total_deposits + amount;

      const { error: updateError } = await this.updateBalance(
        userId,
        newAvailableBalance,
        undefined,
        { total_deposits: newTotalDeposits }
      );

      if (updateError) {
        return { success: false, error: updateError };
      }

      // Mark transaction as completed
      await this.updateTransactionStatus(transaction.id, 'completed');

      return { success: true, error: null };
    } catch (error) {
      console.error('Error processing deposit:', error);
      return { success: false, error };
    }
  },

  // Process withdrawal
  async processWithdrawal(
    userId: string,
    amount: number,
    paymentMethod: string,
    toAddress: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      // Check if user has sufficient balance
      const { data: balance } = await this.getBalance(userId);
      if (!balance || balance.available_balance < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await this.createTransaction(
        userId,
        'withdrawal',
        amount,
        `Withdrawal to ${paymentMethod}`,
        {
          payment_method: paymentMethod
        }
      );

      if (transactionError || !transaction) {
        return { success: false, error: transactionError };
      }

      // Update balance (deduct from available)
      const newAvailableBalance = balance.available_balance - amount;
      const newTotalWithdrawals = balance.total_withdrawals + amount;

      const { error: updateError } = await this.updateBalance(
        userId,
        newAvailableBalance,
        undefined,
        { total_withdrawals: newTotalWithdrawals }
      );

      if (updateError) {
        return { success: false, error: updateError };
      }

      // Mark transaction as pending (will be processed by admin/payment system)
      await this.updateTransactionStatus(transaction.id, 'pending');

      return { success: true, error: null };
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return { success: false, error };
    }
  }
};
