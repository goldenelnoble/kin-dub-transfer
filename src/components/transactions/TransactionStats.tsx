
import { Card, CardContent } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/types";
import { TrendingUp, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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

  const statCards = [
    {
      title: "Total Transactions",
      value: stats.total,
      subtitle: `Montant: ${stats.totalAmount.toLocaleString()} ${currencyFilter === "all" ? "" : currencyFilter}`,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "En Attente",
      value: stats.pending,
      subtitle: "Nécessitent validation",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      title: "Validées",
      value: stats.validated,
      subtitle: "Prêtes à être complétées",
      icon: AlertCircle,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      title: "Complétées",
      value: stats.completed,
      subtitle: `Commission: ${stats.totalCommission.toLocaleString()}`,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Annulées",
      value: stats.cancelled,
      subtitle: "Transactions annulées",
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className={`p-4 ${stat.bgColor} relative overflow-hidden`}>
            {/* Icône décorative en arrière-plan */}
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 opacity-10">
              <stat.icon className="h-16 w-16" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-sm`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              
              <div className="text-xs font-medium text-gray-600 mb-2">
                {stat.title}
              </div>
              
              <div className="text-xs text-gray-500">
                {stat.subtitle}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
