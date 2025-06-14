
import { Transaction } from "@/types";
import { ActivityChart } from "./ActivityChart";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";

interface ActivitySectionProps {
  transactions: Transaction[];
}

export function ActivitySection({ transactions }: ActivitySectionProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Activité récente</h3>
        <span className="text-sm text-muted-foreground">
          {transactions.length} transaction(s)
        </span>
      </div>
      <div className="p-6">
        {transactions.length > 0 ? (
          <ActivityChart transactions={transactions} />
        ) : (
          <div className="h-[200px] bg-[#FEF7CD] rounded-md flex flex-col items-center justify-center">
            <p className="text-[#43A047] mb-2">Aucune donnée d'activité disponible</p>
            <CreateTransactionButton />
          </div>
        )}
      </div>
    </div>
  );
}
