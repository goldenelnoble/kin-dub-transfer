
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowDown, 
  ArrowUp, 
  CheckCheck, 
  Clock, 
  DollarSign, 
  Percent, 
  X 
} from "lucide-react";
import { DashboardStats, Currency } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

interface DashboardSummaryProps {
  stats: DashboardStats;
  currency: Currency;
}

export function DashboardSummary({ stats, currency }: DashboardSummaryProps) {
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const statCards = [
    {
      title: "Transactions totales",
      value: stats.totalTransactions.toString(),
      description: "Toutes les transactions",
      icon: <DollarSign className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100"
    },
    {
      title: "En attente",
      value: stats.pendingTransactions.toString(),
      description: "Transactions à valider",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-100"
    },
    {
      title: "Complétées",
      value: stats.completedTransactions.toString(),
      description: "Transactions terminées",
      icon: <CheckCheck className="h-5 w-5 text-app-green-500" />,
      color: "bg-green-100"
    },
    {
      title: "Annulées",
      value: stats.cancelledTransactions.toString(),
      description: "Transactions annulées",
      icon: <X className="h-5 w-5 text-app-red-500" />,
      color: "bg-red-100"
    },
    {
      title: "Volume total",
      value: `${currencySymbol}${stats.totalAmount.toLocaleString()}`,
      description: "Montant total transféré",
      icon: <DollarSign className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100"
    },
    {
      title: "Commissions",
      value: `${currencySymbol}${stats.totalCommissions.toLocaleString()}`,
      description: "Total des commissions",
      icon: <Percent className="h-5 w-5 text-app-gold-500" />,
      color: "bg-app-gold-100"
    },
    {
      title: "Kinshasa → Dubai",
      value: "56",
      description: "Nombre de transferts",
      icon: <ArrowRight className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100"
    },
    {
      title: "Dubai → Kinshasa",
      value: "37",
      description: "Nombre de transferts",
      icon: <ArrowLeft className="h-5 w-5 text-app-green-500" />,
      color: "bg-green-100"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <div className={`${card.color} p-2 rounded-full`}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
