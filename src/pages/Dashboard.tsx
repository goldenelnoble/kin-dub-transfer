
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { Currency, DashboardStats } from "@/types";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { useState, useEffect } from "react";
import { TransactionManager } from "@/components/transactions/utils/transactionUtils";

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

  // Charger les statistiques au montage et lors des mises à jour
  useEffect(() => {
    // Récupérer les statistiques du gestionnaire de transactions
    const transactionStats = TransactionManager.getStats();
    
    // Convertir les statistiques du format du gestionnaire au format du tableau de bord
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

    // S'abonner aux événements pour mettre à jour automatiquement les stats
    const unsubscribeCreated = TransactionManager.subscribe('transaction:created', updateStats);
    const unsubscribeUpdated = TransactionManager.subscribe('transaction:updated', updateStats);
    const unsubscribeValidated = TransactionManager.subscribe('transaction:validated', updateStats);
    const unsubscribeCompleted = TransactionManager.subscribe('transaction:completed', updateStats);
    const unsubscribeCancelled = TransactionManager.subscribe('transaction:cancelled', updateStats);
    
    return () => {
      // Nettoyer les abonnements
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeValidated();
      unsubscribeCompleted();
      unsubscribeCancelled();
    };
  }, []);

  // Fonction pour mettre à jour les statistiques
  const updateStats = () => {
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

        {/* Utiliser les statistiques réelles */}
        <DashboardSummary 
          stats={stats} 
          currency={Currency.USD}
          onStatClick={handleSummaryClick}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Activité récente</h3>
              </div>
              <div className="p-6">
                {/* Ici afficher le futur graphique d'activité */}
                <div className="h-[200px] bg-[#FEF7CD] rounded-md flex items-center justify-center">
                  <p className="text-[#43A047]">Graphique d'activité des transactions</p>
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-[#F97316]">TXN12345{i}</p>
                        <p className="text-sm text-[#F2C94C]">
                          {i % 2 === 0 ? "Dubaï → Kinshasa" : "Kinshasa → Dubaï"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#43A047]">$2,{i}00.00</p>
                        <p className="text-sm text-[#F97316]">
                          {new Date().toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
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
