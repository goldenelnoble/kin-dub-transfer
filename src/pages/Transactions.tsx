
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionList } from "@/components/transactions/TransactionList";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { HomeButton } from "@/components/ui/home-button";
import { useEffect } from "react";
import { TransactionManager } from "@/components/transactions/utils/transactionUtils";
import { Plus, Zap, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

const Transactions = () => {
  // Recalculer les stats quand la page de transactions est chargée
  useEffect(() => {
    const transactions = TransactionManager.getAllTransactions();
    TransactionManager.calculateStatsFromTransactions(transactions);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* En-tête de page moderne */}
        <div className="relative">
          {/* Arrière-plan décoratif */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/5 via-transparent to-[#F2C94C]/5 rounded-3xl -m-2"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-[#F97316] to-[#F2C94C] rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
                  Centre de Transactions
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Gérez, suivez et analysez toutes vos transactions en temps réel avec des outils avancés de filtrage et de reporting.
              </p>
              
              {/* Badges informatifs */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Temps réel</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Filter className="h-3 w-3" />
                  <span>Filtres avancés</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  <span>Multi-devises</span>
                </div>
              </div>
            </div>
            
            {/* Bouton d'action principal */}
            <div className="flex flex-col sm:flex-row gap-3">
              <HomeButton />
              <CreateTransactionButton />
            </div>
          </div>
        </div>

        {/* Contenu principal avec card moderne */}
        <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
          <TransactionList />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Transactions;
