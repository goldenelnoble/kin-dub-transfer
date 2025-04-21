
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
  X,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { DashboardStats, Currency } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

interface DashboardSummaryProps {
  stats: DashboardStats;
  currency: Currency;
}

export function DashboardSummary({ stats, currency }: DashboardSummaryProps) {
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Transactions totales",
      value: stats.totalTransactions.toString(),
      description: "Toutes les transactions",
      icon: <DollarSign className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100",
      onClick: undefined
    },
    {
      title: "En attente",
      value: stats.pendingTransactions.toString(),
      description: "Transactions à valider",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-100",
      onClick: undefined
    },
    {
      title: "Complétées",
      value: stats.completedTransactions.toString(),
      description: "Transactions terminées",
      icon: <CheckCheck className="h-5 w-5 text-app-green-500" />,
      color: "bg-green-100",
      onClick: undefined
    },
    {
      title: "Annulées",
      value: stats.cancelledTransactions.toString(),
      description: "Transactions annulées",
      icon: <X className="h-5 w-5 text-app-red-500" />,
      color: "bg-red-100",
      onClick: undefined
    },
    {
      title: "Volume total",
      value: `${currencySymbol}${stats.totalAmount.toLocaleString()}`,
      description: "Montant total transféré",
      icon: <DollarSign className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100",
      onClick: undefined
    },
    {
      title: "Commissions",
      value: `${currencySymbol}${stats.totalCommissions.toLocaleString()}`,
      description: "Total des commissions",
      icon: <Percent className="h-5 w-5 text-app-gold-500" />,
      color: "bg-app-gold-100",
      onClick: undefined
    },
    {
      title: "Kinshasa → Dubai",
      value: "56",
      description: "Nombre de transferts",
      icon: <ArrowRight className="h-5 w-5 text-app-blue-500" />,
      color: "bg-app-blue-100",
      // Clique : filtre direction Kinshasa → Dubai
      onClick: () => navigate("/transactions?direction=kinshasa_to_dubai")
    },
    {
      title: "Dubai → Kinshasa",
      value: "37",
      description: "Nombre de transferts",
      icon: <ArrowLeft className="h-5 w-5 text-app-green-500" />,
      color: "bg-green-100",
      // Clique : filtre direction Dubai → Kinshasa
      onClick: () => navigate("/transactions?direction=dubai_to_kinshasa")
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        if (card.onClick) {
          return (
            <button
              key={index}
              onClick={card.onClick}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-app-blue-500 rounded-lg"
            >
              <Card className="transition-transform hover:scale-[1.025] cursor-pointer border-2 border-transparent hover:border-app-blue-400">
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
            </button>
          );
        }
        return (
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
        );
      })}
    </div>
  );
}
