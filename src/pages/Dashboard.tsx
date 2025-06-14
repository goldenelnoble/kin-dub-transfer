import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { AdminUserManagement } from "@/components/dashboard/AdminUserManagement";
import { Currency, DashboardStats, Transaction, TransactionStatus } from "@/types";
import { ArrowRight, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { TransactionService } from "@/services/TransactionService";
import { SystemResetService } from "@/services/SystemResetService";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    cancelledTransactions: 0,
    totalAmount: 0,
    totalCommissions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('Dashboard: Component mounted, loading data...');
    loadDashboardData();

    // Subscribe to real-time updates
    const subscription = TransactionService.subscribeToTransactionChanges(() => {
      console.log('Dashboard: Received real-time update, refreshing data...');
      loadDashboardData();
    });

    return () => {
      console.log('Dashboard: Cleaning up subscription...');
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Dashboard: Loading dashboard data...');
      setIsLoading(true);
      
      const transactions = await TransactionService.getAllTransactions();
      console.log(`Dashboard: Loaded ${transactions.length} transactions`);
      
      setAllTransactions(transactions);
      
      // Calculate stats
      const newStats = {
        totalTransactions: transactions.length,
        pendingTransactions: transactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
        completedTransactions: transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length,
        cancelledTransactions: transactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length,
        totalAmount: transactions.reduce((acc, tx) => acc + tx.amount, 0),
        totalCommissions: transactions.reduce((acc, tx) => acc + tx.commissionAmount, 0)
      };
      
      setStats(newStats);
      console.log('Dashboard: Calculated stats:', newStats);
      
      // Get recent transactions (last 3)
      const recent = transactions
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
      setRecentTransactions(recent);
      
    } catch (error) {
      console.error("Dashboard: Error loading data:", error);
      toast.error("Erreur lors du chargement des données du tableau de bord");
      
      // Reset to default values on error
      setStats({
        totalTransactions: 0,
        pendingTransactions: 0,
        completedTransactions: 0,
        cancelledTransactions: 0,
        totalAmount: 0,
        totalCommissions: 0
      });
      setAllTransactions([]);
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success("Données actualisées");
  };

  const handleSummaryClick = (type: keyof DashboardStats) => {
    console.log(`Dashboard: Summary card clicked: ${type}`);
    switch (type) {
      case "totalTransactions":
      case "pendingTransactions":
      case "cancelledTransactions":
        navigate("/transactions");
        break;
      case "completedTransactions":
        navigate("/reports");
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getDirectionLabel = (direction: string) => {
    return direction === "kinshasa_to_dubai" ? "Kinshasa → Dubaï" : "Dubaï → Kinshasa";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" className="h-12" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Tableau de bord</h1>
              <p className="text-[#43A047]">
                Vue d'ensemble des transactions et statistiques - Synchronisé en temps réel
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <CreateTransactionButton />
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
            <span className="ml-2 text-[#43A047]">Chargement des données...</span>
          </div>
        ) : (
          <DashboardSummary 
            stats={stats} 
            currency={Currency.USD}
            onStatClick={handleSummaryClick}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Activité récente</h3>
                <span className="text-sm text-muted-foreground">
                  {allTransactions.length} transaction(s)
                </span>
              </div>
              <div className="p-6">
                {allTransactions.length > 0 ? (
                  <ActivityChart transactions={allTransactions} />
                ) : (
                  <div className="h-[200px] bg-[#FEF7CD] rounded-md flex flex-col items-center justify-center">
                    <p className="text-[#43A047] mb-2">Aucune donnée d'activité disponible</p>
                    <CreateTransactionButton />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Transactions récentes</h3>
                <Button variant="ghost" size="sm" className="text-[#43A047]" onClick={() => navigate("/transactions")}>
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F97316]"></div>
                    </div>
                  ) : recentTransactions.length === 0 ? (
                    <div className="text-center text-muted-foreground space-y-2">
                      <p>Aucune transaction récente</p>
                      <CreateTransactionButton />
                    </div>
                  ) : (
                    recentTransactions.map(transaction => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                      >
                        <div>
                          <p className="font-medium text-[#F97316]">{transaction.id.slice(0, 8)}...</p>
                          <p className="text-sm text-[#F2C94C]">
                            {getDirectionLabel(transaction.direction)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#43A047]">
                            {transaction.currency} {transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#F97316]">
                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Comptabilité - placeholder pour future implémentation */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Comptabilité</h3>
            <Button variant="ghost" size="sm" className="text-[#43A047]" onClick={() => navigate("/accounting")}>
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center">Section comptabilité disponible via le menu principal</p>
          </div>
        </div>

        {/* Section Gestion des Utilisateurs - maintenant placée après comptabilité */}
        {isAdmin() && (
          <AdminUserManagement />
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
