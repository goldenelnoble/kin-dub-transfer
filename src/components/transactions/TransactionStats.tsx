
import { Card, CardContent } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/types";

interface TransactionStatsProps {
  transactions: Transaction[];
  currencyFilter: string;
}

export const TransactionStats = ({ transactions, currencyFilter }: TransactionStatsProps) => {
  const stats = {
    total: transactions.length,
    pending: transactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
    validated: transactions.filter(tx => tx.status === TransactionStatus.VALIDATED).length,
    completed: transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length,
    cancelled: transactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length,
    totalAmount: transactions.reduce((acc, tx) => acc + tx.amount, 0),
    totalCommission: transactions.reduce((acc, tx) => acc + tx.commissionAmount, 0),
  };

  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
      <div className="bg-[#f3f4f6] p-2 rounded-md text-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-lg font-bold">{stats.total}</div>
        <div className="text-sm text-muted-foreground">
          {currencyFilter === "all" ? "Montant total" : `Total en ${currencyFilter}`}:
          {stats.totalAmount.toLocaleString()} 
        </div>
      </div>
      <div className="bg-[#FEF3CF] p-2 rounded-md text-center">
        <div className="text-sm text-[#F7C33F]">En attente</div>
        <div className="text-lg font-bold text-[#F7C33F]">{stats.pending}</div>
      </div>
      <div className="bg-[#F2C94C]/20 p-2 rounded-md text-center">
        <div className="text-sm text-[#F7C33F]">Validées</div>
        <div className="text-lg font-bold text-[#F7C33F]">{stats.validated}</div>
      </div>
      <div className="bg-[#43A047]/20 p-2 rounded-md text-center">
        <div className="text-sm text-[#43A047]">Complétées</div>
        <div className="text-lg font-bold text-[#43A047]">{stats.completed}</div>
        <div className="text-sm text-muted-foreground">
          Commission: {stats.totalCommission.toLocaleString()}
        </div>
      </div>
      <div className="bg-[#FEC6A1] p-2 rounded-md text-center">
        <div className="text-sm text-[#F97316]">Annulées</div>
        <div className="text-lg font-bold text-[#F97316]">{stats.cancelled}</div>
      </div>
    </div>
  );
};
