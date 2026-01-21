import { supabase } from './client';
import type { PartnerProfile, User } from '../types';

export interface PartnerRegistrationData {
  user_id: string;
  store_name: string;
  store_slug: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  country?: string;
  city?: string;
  tax_id?: string;
  bank_account_details?: Record<string, any>;
}

export const partnerService = {
  /**
   * Ensure user exists in public.users table
   * This fixes foreign key constraint violations
   */
  async ensureUserExists(userId: string, email: string) {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 errors

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        // Try to create user anyway
      }

      if (!existingUser) {
        // User doesn't exist, create them
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            user_type: 'customer',
            partner_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          // If it's a duplicate key error, ignore it
          if (!createError.message.includes('duplicate key') && !createError.message.includes('duplicate')) {
            console.error('Failed to create user record:', createError);
            throw new Error('Failed to create user account. Please try logging out and back in.');
          }
        }
      }

      return true;
    } catch (error: any) {
      console.error('ensureUserExists error:', error);
      // Continue anyway - the trigger should handle it
      return true;
    }
  },

  /**
   * Register as a partner
   */
  async register(data: PartnerRegistrationData) {
    try {
      // Step 1: Ensure user exists in public.users table
      await this.ensureUserExists(data.user_id, data.contact_email);

      // Step 2: Check if user is already a partner
      const { data: existingPartner, error: partnerCheckError } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('user_id', data.user_id)
        .maybeSingle(); // Use maybeSingle instead of single

      if (partnerCheckError) {
        console.error('Error checking existing partner:', partnerCheckError);
      }

      if (existingPartner) {
        return {
          data: null,
          error: new Error('You are already registered as a partner'),
        };
      }

      // Step 3: Check if store slug is available
      const sanitizedSlug = data.store_slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const { data: slugExists, error: slugCheckError } = await supabase
        .from('partner_profiles')
        .select('id')
        .eq('store_slug', sanitizedSlug)
        .maybeSingle(); // Use maybeSingle instead of single

      if (slugCheckError) {
        console.error('Error checking store slug:', slugCheckError);
      }

      if (slugExists) {
        return {
          data: null,
          error: new Error('Store URL is already taken. Please choose a different one.'),
        };
      }

      // Step 4: Update user type to partner with pending status
      const { error: userError } = await supabase
        .from('users')
        .update({
          user_type: 'partner',
          partner_status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.user_id);

      if (userError) {
        console.error('User update error:', userError);
        throw userError;
      }

      // Step 5: Create partner profile
      const { data: profile, error: profileError } = await supabase
        .from('partner_profiles')
        .insert({
          user_id: data.user_id,
          store_name: data.store_name,
          store_slug: sanitizedSlug,
          description: data.description || null,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || null,
          country: data.country || null,
          city: data.city || null,
          tax_id: data.tax_id || null,
          bank_account_details: data.bank_account_details || null,
          is_active: false, // Inactive until approved
        })
        .select()
        .single();

      if (profileError) {
        console.error('Partner profile creation error:', profileError);
        
        // Check for specific error codes
        if (profileError.code === '23503') {
          throw new Error('User account not found. Please try logging out and back in.');
        } else if (profileError.code === '23505') {
          throw new Error('Store name or URL is already taken.');
        } else {
          throw profileError;
        }
      }

      return { data: profile as PartnerProfile | null, error: null };
    } catch (error: any) {
      console.error('Partner registration error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get partner profile by user ID
   */
  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data: data as PartnerProfile | null, error };
  },

  /**
   * Get partner profile by ID
   */
  async getProfileById(partnerId: string) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .select(
        `
        *,
        user:users (*)
      `
      )
      .eq('id', partnerId)
      .single();

    return { data: data as PartnerProfile | null, error };
  },

  /**
   * Get all pending partner applications (admin only)
   */
  async getPendingApplications() {
    const { data, error } = await supabase
      .from('partner_profiles')
      .select(
        `
        *,
        user:users (*)
      `
      )
      .eq('is_active', false)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  /**
   * Approve partner application (admin only)
   */
  async approvePartner(partnerId: string) {
    // Update partner profile
    const { error: profileError } = await supabase
      .from('partner_profiles')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', partnerId);

    if (profileError) {
      return { data: null, error: profileError };
    }

    // Update user status
    const { data: profile } = await supabase
      .from('partner_profiles')
      .select('user_id')
      .eq('id', partnerId)
      .single();

    if (profile) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          partner_status: 'approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.user_id);

      if (userError) {
        return { data: null, error: userError };
      }
    }

    return { data: { success: true }, error: null };
  },

  /**
   * Reject partner application (admin only)
   */
  async rejectPartner(partnerId: string) {
    const { data: profile } = await supabase
      .from('partner_profiles')
      .select('user_id')
      .eq('id', partnerId)
      .single();

    if (profile) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          partner_status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.user_id);

      return { data: { success: true }, error: userError };
    }

    return { data: null, error: { message: 'Partner profile not found' } };
  },

  /**
   * Update partner profile
   */
  async updateProfile(partnerId: string, updates: Partial<PartnerProfile>) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', partnerId)
      .select()
      .single();

    return { data: data as PartnerProfile | null, error };
  },

  /**
   * Get partner analytics
   */
  async getAnalytics(partnerId: string) {
    // Get total earnings
    const { data: earnings } = await supabase
      .from('partner_earnings')
      .select('sale_amount, partner_share, status')
      .eq('partner_id', partnerId);

    // Get total orders
    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partnerId);

    // Get store visits
    const { count: visitCount } = await supabase
      .from('store_visits')
      .select('*', { count: 'exact', head: true })
      .eq('partner_id', partnerId);

    const totalEarnings =
      earnings?.reduce((sum, e) => sum + parseFloat(String(e.partner_share || 0)), 0) || 0;
    const pendingEarnings =
      earnings
        ?.filter((e) => e.status === 'pending')
        .reduce((sum, e) => sum + parseFloat(String(e.partner_share || 0)), 0) || 0;

    return {
      totalEarnings,
      pendingEarnings,
      availableBalance: totalEarnings - pendingEarnings,
      totalOrders: orderCount || 0,
      totalVisits: visitCount || 0,
      conversionRate: orderCount && visitCount ? (orderCount / visitCount) * 100 : 0,
    };
  },

  // ============================================
  // DASHBOARD SERVICE METHODS
  // ============================================

  /**
   * Get partner profile with analytics
   */
  async getPartnerProfile(userId: string) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data: data as PartnerProfile | null, error };
  },

  /**
   * Get partner analytics data for dashboard
   */
  async getPartnerAnalytics(partnerId: string) {
    try {
      // Get earnings data
      const { data: earnings, error: earningsError } = await supabase
        .from('partner_earnings')
        .select('partner_share, created_at, status')
        .eq('partner_id', partnerId);

      // Get orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('partner_id', partnerId);

      // Get store visits
      const { data: visits, error: visitsError } = await supabase
        .from('store_visits')
        .select('created_at')
        .eq('partner_id', partnerId);

      if (earningsError || ordersError || visitsError) {
        console.error('Error fetching analytics:', earningsError || ordersError || visitsError);
      }

      const totalEarnings = earnings?.reduce((sum, e) => sum + (e.partner_share || 0), 0) || 0;
      const totalSales = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'confirmed').length || 0;
      const totalVisits = visits?.length || 0;
      const conversionRate = totalVisits > 0 ? (totalSales / totalVisits) * 100 : 0;

      return {
        data: {
          total_sales: totalSales,
          pending_orders: pendingOrders,
          total_earnings: totalEarnings,
          conversion_rate: conversionRate,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      };
    }
  },

  // ============================================
  // PRODUCTS MANAGEMENT
  // ============================================

  /**
   * Get partner's products
   */
  async getPartnerProducts(partnerId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  /**
   * Get product by ID
   */
  async getProduct(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    return { data, error };
  },

  /**
   * Add new product
   */
  async addProduct(
    partnerId: string,
    productData: {
      name: string;
      description: string;
      price: number;
      cost: number;
      category: string;
      stock: number;
      images: string[];
      specifications?: Record<string, any>;
    }
  ) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        partner_id: partnerId,
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  },

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    updates: Partial<{
      name: string;
      description: string;
      price: number;
      cost: number;
      category: string;
      stock: number;
      images: string[];
      specifications: Record<string, any>;
    }>
  ) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Delete product
   */
  async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    return { data: { success: !error }, error };
  },

  // ============================================
  // ORDERS MANAGEMENT
  // ============================================

  /**
   * Get partner's orders
   */
  async getPartnerOrders(partnerId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        customer_id,
        total_amount,
        status,
        created_at,
        user:users(email, full_name),
        order_items(*)
      `
      )
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: data || [], error };
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items(*),
        user:users(*)
      `
      )
      .eq('id', orderId)
      .single();

    return { data, error };
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled') {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  },

  // ============================================
  // EARNINGS & WITHDRAWALS
  // ============================================

  /**
   * Get partner earnings
   */
  async getEarnings(partnerId: string) {
    const { data, error } = await supabase
      .from('partner_earnings')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  /**
   * Get earnings summary by period
   */
  async getEarningsSummary(partnerId: string) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const { data, error } = await supabase
      .from('partner_earnings')
      .select('partner_share, created_at')
      .eq('partner_id', partnerId);

    if (error) {
      return {
        data: {
          thisMonth: 0,
          lastMonth: 0,
          thisYear: 0,
          allTime: 0,
        },
        error,
      };
    }

    const filterByDate = (date: Date) =>
      (data || []).filter((e) => new Date(e.created_at) >= date);

    const thisMonthData = filterByDate(thisMonth);
    const lastMonthData = filterByDate(lastMonth).filter((e) => new Date(e.created_at) < thisMonth);
    const thisYearData = filterByDate(thisYear);

    return {
      data: {
        thisMonth: thisMonthData.reduce((sum, e) => sum + (e.partner_share || 0), 0),
        lastMonth: lastMonthData.reduce((sum, e) => sum + (e.partner_share || 0), 0),
        thisYear: thisYearData.reduce((sum, e) => sum + (e.partner_share || 0), 0),
        allTime: (data || []).reduce((sum, e) => sum + (e.partner_share || 0), 0),
      },
      error: null,
    };
  },

  /**
   * Get withdrawal history
   */
  async getWithdrawalHistory(partnerId: string) {
    const { data, error } = await supabase
      .from('partner_withdrawals')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  /**
   * Request withdrawal
   */
  async requestWithdrawal(
    partnerId: string,
    amount: number,
    method: 'bank_transfer' | 'paypal' | 'cryptocurrency'
  ) {
    const { data, error } = await supabase
      .from('partner_withdrawals')
      .insert({
        partner_id: partnerId,
        amount,
        withdrawal_method: method,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  },

  // ============================================
  // SETTINGS
  // ============================================

  /**
   * Get partner settings
   */
  async getPartnerSettings(partnerId: string) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .select(
        `
        id,
        store_name,
        description,
        contact_email,
        contact_phone,
        country,
        city,
        tax_id,
        bank_account_details,
        store_slug
      `
      )
      .eq('id', partnerId)
      .single();

    return { data, error };
  },

  /**
   * Update partner settings
   */
  async updatePartnerSettings(
    partnerId: string,
    settings: {
      store_name?: string;
      description?: string;
      contact_email?: string;
      contact_phone?: string;
      country?: string;
      city?: string;
      tax_id?: string;
      bank_account_details?: Record<string, any>;
    }
  ) {
    const { data, error } = await supabase
      .from('partner_profiles')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', partnerId)
      .select()
      .single();

    return { data, error };
  },

  // ============================================
  // ANALYTICS & INSIGHTS
  // ============================================

  /**
   * Get detailed analytics data
   */
  async getDetailedAnalytics(partnerId: string) {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get orders data
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('partner_id', partnerId)
      .gte('created_at', last30Days.toISOString());

    // Get earnings data
    const { data: earnings } = await supabase
      .from('partner_earnings')
      .select('partner_share, created_at')
      .eq('partner_id', partnerId)
      .gte('created_at', last30Days.toISOString());

    // Get store visits
    const { data: visits } = await supabase
      .from('store_visits')
      .select('created_at')
      .eq('partner_id', partnerId)
      .gte('created_at', last30Days.toISOString());

    // Group data by day for charts
    const viewsByDay = new Array(30).fill(0);
    const salesByDay = new Array(30).fill(0);
    const revenueByDay = new Array(30).fill(0);

    visits?.forEach((visit) => {
      const day = Math.floor(
        (now.getTime() - new Date(visit.created_at).getTime()) / (24 * 60 * 60 * 1000)
      );
      if (day >= 0 && day < 30) viewsByDay[29 - day]++;
    });

    orders?.forEach((order) => {
      const day = Math.floor(
        (now.getTime() - new Date(order.created_at).getTime()) / (24 * 60 * 60 * 1000)
      );
      if (day >= 0 && day < 30 && order.status === 'completed') {
        salesByDay[29 - day]++;
      }
    });

    earnings?.forEach((earning) => {
      const day = Math.floor(
        (now.getTime() - new Date(earning.created_at).getTime()) / (24 * 60 * 60 * 1000)
      );
      if (day >= 0 && day < 30) {
        revenueByDay[29 - day] += earning.partner_share || 0;
      }
    });

    // Calculate metrics
    const totalSales = orders?.length || 0;
    const totalRevenue = earnings?.reduce((sum, e) => sum + (e.partner_share || 0), 0) || 0;
    const totalVisits = visits?.length || 0;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const conversionRate = totalVisits > 0 ? (totalSales / totalVisits) * 100 : 0;

    return {
      data: {
        viewsByDay,
        salesByDay,
        revenueByDay,
        metrics: {
          avgOrderValue,
          conversionRate,
          totalRevenue,
          totalSales,
          totalVisits,
        },
      },
      error: null,
    };
  },
};
