
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function RecentTransactionsSection({ transactions, isLoading }: RecentTransactionsSectionProps) {
  const navigate = useNavigate();

  const getDirectionLabel = (direction: string) => {
    return direction === "kinshasa_to_dubai" ? "Kinshasa → Dubaï" : "Dubaï → Kinshasa";
  };

  return (
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
          ) : transactions.length === 0 ? (
            <div className="text-center text-muted-foreground space-y-2">
              <p>Aucune transaction récente</p>
              <CreateTransactionButton />
            </div>
          ) : (
            transactions.map(transaction => (
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
  );
}
