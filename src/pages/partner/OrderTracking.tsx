import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, MapPin, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function OrderTracking() {
  const { orderId } = useParams();
  const { userProfile } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId, userProfile]);

  const loadOrderDetails = async () => {
    if (!orderId || !userProfile?.id) return;

    setLoading(true);
    setError(null);
    try {
      // Get auth user ID for partner verification
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.id) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products(*)
          ),
          logistics_tracking (*)
        `)
        .eq('id', orderId)
        .eq('store_id', authUser.id)
        .single();

      if (fetchError) throw fetchError;
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-6 h-6 text-warning" />;
      case 'processing':
        return <Package className="w-6 h-6 text-info" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-primary" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Clock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'processing':
        return 'bg-info/10 text-info border-info/30';
      case 'shipped':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'delivered':
        return 'bg-success/10 text-success border-success/30';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1">Error Loading Order</h3>
            <p>{error}</p>
            <Link to="/partner/dashboard/orders">
              <Button variant="outline" className="mt-4">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">Order not found</p>
        <Link to="/partner/dashboard/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const tracking = order.logistics_tracking?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/partner/dashboard/orders" className="inline-flex items-center gap-2 text-primary hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          <p className="text-muted-foreground">Order #{order.id?.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="font-semibold">{order.customer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="font-semibold text-primary text-lg">${order.total_amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Items</p>
                <p className="font-semibold">{order.order_items?.length || 0} item(s)</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {tracking ? (
            <div className="bg-card rounded-lg shadow-md p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">Tracking Information</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-semibold text-lg">{tracking.tracking_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Carrier</p>
                    <p className="font-semibold">{tracking.shipping_provider}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {[
                  {
                    status: 'Order Confirmed',
                    time: new Date(order.created_at).toLocaleString(),
                    icon: CheckCircle,
                    completed: true
                  },
                  {
                    status: 'Processing',
                    time: tracking.shipped_at ? new Date(tracking.shipped_at).toLocaleString() : 'In Progress',
                    icon: Package,
                    completed: !!tracking.shipped_at
                  },
                  {
                    status: 'Shipped',
                    time: tracking.shipped_at ? new Date(tracking.shipped_at).toLocaleString() : 'Pending',
                    icon: Truck,
                    completed: !!tracking.shipped_at
                  },
                  {
                    status: 'In Transit',
                    time: tracking.estimated_delivery_date ? new Date(tracking.estimated_delivery_date).toLocaleDateString() : 'In Transit',
                    icon: MapPin,
                    completed: false
                  },
                  {
                    status: 'Delivered',
                    time: tracking.delivered_at ? new Date(tracking.delivered_at).toLocaleString() : 'Expected',
                    icon: CheckCircle,
                    completed: !!tracking.delivered_at
                  }
                ].map((update, idx) => {
                  const Icon = update.icon;
                  return (
                    <div key={idx} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          update.completed ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {idx < 4 && (
                          <div className={`w-0.5 h-16 ${
                            update.completed ? 'bg-success' : 'bg-border'
                          }`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <h4 className={`font-bold text-lg ${
                          update.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {update.status}
                        </h4>
                        <p className="text-muted-foreground text-sm">{update.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-6 text-muted-foreground text-center">
              <p>No tracking information available yet.</p>
              <p className="text-sm mt-2">Tracking will be added once the order is shipped.</p>
            </div>
          )}

          {/* Items */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Items in Order</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold">{item.product?.name || 'Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-primary">
                    ${(item.quantity * item.price)?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h3>
            <p className="text-foreground font-semibold mb-2">{order.customer_name}</p>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {order.shipping_address || 'Address not available'}
            </p>
          </div>

          {/* Quick Info */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="font-bold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Carrier</p>
                <p className="font-semibold">{tracking?.shipping_provider || 'Not set'}</p>
              </div>
              {tracking?.estimated_delivery_date && (
                <div>
                  <p className="text-muted-foreground">Est. Delivery</p>
                  <p className="font-semibold">
                    {new Date(tracking.estimated_delivery_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="bg-primary/10 rounded-lg p-6 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-4">
                Need to update tracking or cancel this order?
              </p>
              <Link to={`/partner/dashboard/orders`}>
                <Button className="w-full">Back to Orders</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
