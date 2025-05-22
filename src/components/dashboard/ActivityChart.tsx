
import React from "react";
import { Transaction } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface ActivityChartProps {
  transactions: Transaction[];
  days?: number;
}

export const ActivityChart = ({ transactions, days = 7 }: ActivityChartProps) => {
  // Préparation des données pour le graphique
  const chartData = React.useMemo(() => {
    // Obtenir la date d'aujourd'hui et calculer la date de début
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    
    // Initialiser un tableau pour chaque jour
    const dailyData: { date: Date; count: number; amount: number }[] = [];
    
    // Créer une entrée pour chaque jour
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dailyData.push({
        date: new Date(currentDate),
        count: 0,
        amount: 0,
      });
    }
    
    // Compter les transactions pour chaque jour
    transactions.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      // Vérifier si la transaction est dans la période
      if (txDate >= startDate && txDate <= today) {
        // Trouver le jour correspondant
        const dayIndex = Math.floor((txDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < dailyData.length) {
          dailyData[dayIndex].count += 1;
          dailyData[dayIndex].amount += tx.amount;
        }
      }
    });
    
    // Formater pour Recharts
    return dailyData.map(day => ({
      name: day.date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      fullDate: day.date,
      Transactions: day.count,
      Montant: day.amount,
    }));
  }, [transactions, days]);

  const chartConfig = {
    Transactions: {
      label: "Transactions",
      color: "#F97316"
    },
    Montant: {
      label: "Montant",
      color: "#43A047"
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[200px]">
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          tickLine={false} 
          axisLine={false}
          tick={{ fill: '#888', fontSize: 12 }}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false}
          tick={{ fill: '#888', fontSize: 12 }}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <ChartTooltipContent
                  className="bg-white border border-gray-200 rounded-md shadow-md"
                  formatter={(value: number, name: string) => {
                    if (name === "Montant") return `${value.toLocaleString()} USD`;
                    return value;
                  }}
                  labelFormatter={() => {
                    return formatDate(data.fullDate as Date);
                  }}
                />
              );
            }
            return null;
          }}
        />
        <Bar dataKey="Transactions" fill="#F97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};
