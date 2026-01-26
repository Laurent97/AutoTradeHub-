import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../lib/supabase/wallet-service';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  RefreshCw,
  Download,
  Upload,
  History,
  AlertCircle,
  Clock,
  CreditCard,
  Bitcoin,
  Mail,
  Shield,
  Zap,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface WalletBalance {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'order_payment' | 'order_refund' | 'commission' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  created_at: string;
  payment_method?: string;
  order_id?: string;
  transaction_hash?: string;
}

export default function DashboardWallet() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Real-time wallet data
  const { data: walletData, loading: walletLoading, refresh: refreshWallet } = useRealtimeSubscription(
    async () => {
      if (!user) return [];
      const { data } = await walletService.getBalance(user.id);
      return data ? [data] : [];
    },
    {
      table: 'wallet_balances',
      event: '*',
      filter: `user_id=eq.${user?.id}`
    }
  );

  const { data: transactions, loading: transactionsLoading, refresh: refreshTransactions } = useRealtimeSubscription(
    async () => {
      if (!user) return [];
      const { data } = await walletService.getTransactions(user.id, 20);
      return data || [];
    },
    {
      table: 'wallet_transactions',
      event: '*',
      filter: `user_id=eq.${user?.id}`
    }
  );
  
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalWithdrawn: 0,
    totalDeposits: 0,
    pendingBalance: 0,
    availableBalance: 0,
    transactionCount: 0
  });

  const wallet = walletData?.[0] || null;

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const totalEarnings = transactions
        .filter(t => (t.type === 'commission' || t.type === 'bonus') && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalWithdrawn = transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalDeposits = transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const pendingBalance = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalEarnings,
        totalWithdrawn,
        totalDeposits,
        pendingBalance,
        availableBalance: wallet?.balance || 0,
        transactionCount: transactions.length
      });
    }
  }, [transactions, wallet]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshWallet(), refreshTransactions()]);
    setRefreshing(false);
  };

  const handleDeposit = () => {
    navigate('/partner/dashboard/wallet/deposit');
  };

  const handleWithdraw = () => {
    navigate('/payment/withdraw');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'stripe':
        return { icon: <CreditCard className="w-4 h-4" />, name: 'Card', color: 'text-blue-600' };
      case 'paypal':
        return { icon: <Mail className="w-4 h-4" />, name: 'PayPal', color: 'text-blue-500' };
      case 'crypto':
        return { icon: <Bitcoin className="w-4 h-4" />, name: 'Crypto', color: 'text-orange-500' };
      case 'wallet':
        return { icon: <Wallet className="w-4 h-4" />, name: 'Wallet', color: 'text-green-600' };
      default:
        return { icon: <DollarSign className="w-4 h-4" />, name: method || 'Unknown', color: 'text-gray-600' };
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'order_payment':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'order_refund':
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'commission':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'bonus':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const loading = walletLoading || transactionsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Wallet Dashboard</h1>
            <p className="text-muted-foreground">Manage your earnings and transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-2"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBalance ? 'Hide' : 'Show'} Balance
            </Button>
          </div>
        </div>

        {/* Main Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-semibold mb-2">Available Balance</CardTitle>
                <p className="text-primary-foreground/80">Your current wallet balance</p>
              </div>
              <Wallet className="w-8 h-8 text-primary-foreground/50" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">
              {showBalance ? formatCurrency(wallet?.balance || 0) : '••••••'}
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleDeposit}
                className="bg-white text-primary hover:bg-gray-100 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Deposit Funds
              </Button>
              <Button 
                variant="outline"
                onClick={handleWithdraw}
                className="border-white/20 text-primary-foreground hover:bg-white/10 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.totalEarnings)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawn</CardTitle>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.totalWithdrawn)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.pendingBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
                <History className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.transactionCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
                <p className="text-muted-foreground">Your latest wallet activity</p>
              </div>
              <Link to="/partner/dashboard/wallet/history">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
                <p className="text-muted-foreground mb-4">Start earning to see your transaction history</p>
                <Button onClick={handleDeposit} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Make Your First Deposit
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 10).map((transaction) => {
                  const paymentInfo = getPaymentMethodInfo(transaction.payment_method || '');
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-muted">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground capitalize">
                              {transaction.type.replace('_', ' ')}
                            </p>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {paymentInfo.icon}
                            <span className={`text-xs ${paymentInfo.color}`}>
                              {paymentInfo.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(transaction.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'commission' || transaction.type === 'bonus'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'commission' || transaction.type === 'bonus' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleDeposit}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quick Deposit</CardTitle>
                  <p className="text-sm text-muted-foreground">Add funds instantly</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleWithdraw}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Withdraw Funds</CardTitle>
                  <p className="text-sm text-muted-foreground">Transfer to your account</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <p className="text-sm text-muted-foreground">Protected transactions</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
