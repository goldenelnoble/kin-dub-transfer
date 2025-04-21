
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionForm } from "@/components/transactions/TransactionForm";

const NewTransaction = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Transaction</h1>
          <p className="text-muted-foreground">
            Créer une nouvelle transaction de transfert d'argent
          </p>
        </div>

        <TransactionForm />
      </div>
    </AppLayout>
  );
};

export default NewTransaction;
