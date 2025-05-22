
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { Currency, DashboardStats, Transaction } from "@/types";
import { ArrowRight, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { useState, useEffect } from "react";
import { TransactionManager } from "@/components/transactions/utils/transactionUtils";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    cancelledTransactions: 0,
    totalAmount: 0,
    totalCommissions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les statistiques au montage et lors des mises à jour
  useEffect(() => {
    // Charger les données initiales
    updateDashboard();
    setIsInitialized(true);
    setIsLoading(false);

    // S'abonner aux événements pour mettre à jour automatiquement les stats et transactions
    const unsubscribeCreated = TransactionManager.subscribe('transaction:created', handleTransactionCreated);
    const unsubscribeUpdated = TransactionManager.subscribe('transaction:updated', updateDashboard);
    const unsubscribeValidated = TransactionManager.subscribe('transaction:validated', updateDashboard);
    const unsubscribeCompleted = TransactionManager.subscribe('transaction:completed', updateDashboard);
    const unsubscribeCancelled = TransactionManager.subscribe('transaction:cancelled', updateDashboard);
    const unsubscribeStats = TransactionManager.subscribe('stats:updated', handleStatsUpdated);
    
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeValidated();
      unsubscribeCompleted();
      unsubscribeCancelled();
      unsubscribeStats();
    };
  }, []);

  // Gestion spécifique pour les nouvelles transactions
  const handleTransactionCreated = (transaction: Transaction) => {
    // Mise à jour immédiate des statistiques
    updateDashboard();
    
    // Notification visuelle pour l'utilisateur
    if (isInitialized) {
      toast.success("Nouvelle transaction créée", {
        description: `La transaction ${transaction.id} a été ajoutée avec succès`,
      });
    }
  };

  // Gestion des mises à jour de statistiques
  const handleStatsUpdated = (updatedStats: ReturnType<typeof TransactionManager.getStats>) => {
    setStats({
      totalTransactions: updatedStats.transactionTotal,
      pendingTransactions: updatedStats.transactionTotal - 
                          (updatedStats.transactionCompletee + 
                           updatedStats.transactionValidee + 
                           updatedStats.transactionAnnulee),
      completedTransactions: updatedStats.transactionCompletee,
      cancelledTransactions: updatedStats.transactionAnnulee,
      totalAmount: updatedStats.montantTotal,
      totalCommissions: updatedStats.commissionTotale
    });

    // Mise à jour immédiate des transactions récentes également
    updateRecentTransactions();
  };

  // Mise à jour des transactions récentes uniquement
  const updateRecentTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        const allTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        const recent = allTransactions
          .sort((a: Transaction, b: Transaction) => 
            b.createdAt.getTime() - a.createdAt.getTime()
          )
          .slice(0, 3);
        
        setRecentTransactions(recent);
      } catch (error) {
        console.error("Erreur lors du chargement des transactions récentes:", error);
        setRecentTransactions([]);
      }
    } else {
      setRecentTransactions([]);
    }
  };

  // Fonction pour mettre à jour les statistiques et transactions récentes
  const updateDashboard = () => {
    // Vérifier que les transactions existent
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        // Forcer le recalcul complet des statistiques
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        // Recalculer les statistiques à partir de toutes les transactions
        TransactionManager.calculateStatsFromTransactions(parsedTransactions);
        
        // Obtenir les statistiques mises à jour
        const transactionStats = TransactionManager.getStats();
        setStats({
          totalTransactions: transactionStats.transactionTotal,
          pendingTransactions: transactionStats.transactionTotal - 
                            (transactionStats.transactionCompletee + 
                             transactionStats.transactionValidee + 
                             transactionStats.transactionAnnulee),
          completedTransactions: transactionStats.transactionCompletee,
          cancelledTransactions: transactionStats.transactionAnnulee,
          totalAmount: transactionStats.montantTotal,
          totalCommissions: transactionStats.commissionTotale
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du tableau de bord:", error);
      }
    }

    // Mettre à jour les transactions récentes dans tous les cas
    updateRecentTransactions();
  };

  // Nouvelle navigation après clic sur une statistique
  const handleSummaryClick = (type: keyof DashboardStats) => {
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

  const getDirectionLabel = (direction: string) => {
    return direction === "kinshasa_to_dubai" ? "Dubaï → Kinshasa" : "Kinshasa → Dubaï";
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
                Vue d'ensemble des transactions et statistiques
              </p>
            </div>
          </div>
          <CreateTransactionButton />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
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
              </div>
              <div className="p-6">
                <div className="h-[200px] bg-[#FEF7CD] rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center text-[#43A047]">
                    <ChartBar className="h-8 w-8 mb-2" />
                    <p>Graphique d'activité des transactions</p>
                  </div>
                </div>
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
                    <p className="text-center text-muted-foreground">Aucune transaction récente</p>
                  ) : (
                    recentTransactions.map(transaction => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                      >
                        <div>
                          <p className="font-medium text-[#F97316]">{transaction.id}</p>
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
      </div>
    </AppLayout>
  );
};

export default Dashboard;
