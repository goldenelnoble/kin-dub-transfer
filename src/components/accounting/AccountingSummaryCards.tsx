
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/types";
import { DollarSign, TrendingUp, TrendingDown, PieChart, Wallet, CreditCard } from "lucide-react";
import { useMemo } from "react";

interface AccountingSummaryCardsProps {
  transactions: Transaction[];
}

export function AccountingSummaryCards({ transactions }: AccountingSummaryCardsProps) {
  const accountingMetrics = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // Revenus (commissions)
    const totalRevenue = completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0);
    
    // Volume des transactions
    const totalVolume = completedTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    
    // Transactions par statut
    const pendingCount = transactions.filter(tx => tx.status === TransactionStatus.PENDING).length;
    const completedCount = completedTransactions.length;
    const cancelledCount = transactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length;
    
    // Moyennes
    const averageTransaction = completedCount > 0 ? totalVolume / completedCount : 0;
    const averageCommission = completedCount > 0 ? totalRevenue / completedCount : 0;
    
    // Taux de conversion
    const conversionRate = transactions.length > 0 ? (completedCount / transactions.length) * 100 : 0;

    return {
      totalRevenue,
      totalVolume,
      pendingCount,
      completedCount,
      cancelledCount,
      averageTransaction,
      averageCommission,
      conversionRate
    };
  }, [transactions]);

  const summaryCards = [
    {
      title: "Revenus Totaux",
      value: `${accountingMetrics.totalRevenue.toLocaleString()} USD`,
      description: "Commissions perçues",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Volume des Transactions",
      value: `${accountingMetrics.totalVolume.toLocaleString()} USD`,
      description: "Montant total traité",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Transaction Moyenne",
      value: `${accountingMetrics.averageTransaction.toLocaleString()} USD`,
      description: "Montant moyen par transaction",
      icon: PieChart,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Commission Moyenne",
      value: `${accountingMetrics.averageCommission.toLocaleString()} USD`,
      description: "Commission moyenne par transaction",
      icon: Wallet,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Taux de Conversion",
      value: `${accountingMetrics.conversionRate.toFixed(1)}%`,
      description: "Transactions complétées",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      title: "En Attente",
      value: accountingMetrics.pendingCount.toString(),
      description: "Transactions à traiter",
      icon: CreditCard,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className={`p-4 ${card.bgColor} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 opacity-10">
              <card.icon className="h-16 w-16" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color} shadow-sm`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                {card.value}
              </div>
              
              <div className="text-xs font-medium text-gray-600 mb-2">
                {card.title}
              </div>
              
              <div className="text-xs text-gray-500">
                {card.description}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
