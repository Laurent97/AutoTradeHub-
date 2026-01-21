import { supabase } from './client';

export const adminService = {
  // Get all users with their details
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Update user information
  async updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Update user wallet balance
  async updateWalletBalance(userId: string, amount: number, type: 'add' | 'subtract', reason: string) {
    // Get current balance
    const { data: currentBalance } = await supabase
      .from('wallet_balances')
      .select('available_balance')
      .eq('user_id', userId)
      .single();

    const current = currentBalance?.available_balance || 0;
    const newBalance = type === 'add' ? current + amount : current - amount;

    if (newBalance < 0) {
      throw new Error('Cannot set negative balance');
    }

    // Update balance
    const { error: balanceError } = await supabase
      .from('wallet_balances')
      .upsert({
        user_id: userId,
        available_balance: newBalance,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (balanceError) throw balanceError;

    return { success: true, newBalance };
  },

  // Get all orders with details
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Assign order to partner
  async assignOrderToPartner(orderId: string, partnerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        partner_id: partnerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  },

  // Update logistics information
  async updateLogistics(orderId: string, logisticsData: any) {
    const { data, error } = await supabase
      .from('logistics_tracking')
      .upsert({
        order_id: orderId,
        ...logisticsData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'order_id'
      })
      .select()
      .single();

    return { data, error };
  },

  // Get dashboard statistics
  async getDashboardStats() {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total partners
    const { count: totalPartners } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'partner')
      .eq('partner_status', 'approved');

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    // Get pending partner applications
    const { count: pendingPartners } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('partner_status', 'pending');

    return {
      totalUsers: totalUsers || 0,
      totalPartners: totalPartners || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingPartners: pendingPartners || 0
    };
  }
};
