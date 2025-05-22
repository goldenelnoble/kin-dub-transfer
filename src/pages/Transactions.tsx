
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionList } from "@/components/transactions/TransactionList";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { useEffect } from "react";
import { TransactionManager } from "@/components/transactions/utils/transactionUtils";

const Transactions = () => {
  // Recalculer les stats quand la page de transactions est chargée
  useEffect(() => {
    const transactions = TransactionManager.getAllTransactions();
    TransactionManager.calculateStatsFromTransactions(transactions);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Gérer et suivre toutes les transactions
            </p>
          </div>
          <CreateTransactionButton />
        </div>

        <TransactionList />
      </div>
    </AppLayout>
  );
};

export default Transactions;
