import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase/client';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Stripe payments will not work.');
}

export const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  userId: string;
  orderId?: string;
  metadata?: Record<string, string>;
}

export interface SavePaymentMethodData {
  userId: string;
  paymentMethodId: string;
  cardLast4: string;
  cardBrand: string;
  cardExpMonth: number;
  cardExpYear: number;
}

export const stripeService = {
  // Create payment intent (will need backend API)
  async createPaymentIntent(data: CreatePaymentIntentData) {
    // Note: This requires a backend API endpoint
    // For now, return mock data - implement with actual API
    console.warn('Stripe payment intent creation requires backend API');
    
    // In production, call your backend API:
    // const response = await fetch('/api/stripe/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();

    return {
      clientSecret: 'mock_client_secret',
      paymentIntentId: 'mock_payment_intent_id',
    };
  },

  // Save customer payment method
  async savePaymentMethod(data: SavePaymentMethodData) {
    const { error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: data.userId,
        method_type: 'card',
        provider: 'stripe',
        details: {
          payment_method_id: data.paymentMethodId,
        },
        stripe_payment_method_id: data.paymentMethodId,
        card_last4: data.cardLast4,
        card_brand: data.cardBrand,
        card_exp_month: data.cardExpMonth,
        card_exp_year: data.cardExpYear,
        is_default: true,
      });

    if (error) throw error;
  },

  // Get user's saved payment methods
  async getUserPaymentMethods(userId: string) {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('method_type', 'card')
      .eq('is_active', true)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Set default payment method
  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // First, unset all defaults
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('method_type', 'card');

    // Then set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('stripe_payment_method_id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Delete payment method
  async deletePaymentMethod(userId: string, paymentMethodId: string) {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_active: false })
      .eq('stripe_payment_method_id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Get payment intent status
  async getPaymentIntentStatus(paymentIntentId: string) {
    const { data, error } = await supabase
      .from('stripe_payment_intents')
      .select('status')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (error) throw error;
    return data;
  },
};
