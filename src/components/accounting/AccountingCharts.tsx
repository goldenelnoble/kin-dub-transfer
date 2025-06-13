
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useMemo } from "react";

interface AccountingChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#43A047', '#F2C94C', '#F97316', '#3B82F6', '#8B5CF6'];

export function AccountingCharts({ transactions }: AccountingChartsProps) {
  const chartData = useMemo(() => {
    // Données pour le graphique des revenus mensuels
    const monthlyData = transactions
      .filter(tx => tx.status === TransactionStatus.COMPLETED)
      .reduce((acc, tx) => {
        const month = new Date(tx.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { month, revenue: 0, volume: 0, count: 0 };
        }
        acc[month].revenue += tx.commissionAmount;
        acc[month].volume += tx.amount;
        acc[month].count += 1;
        return acc;
      }, {} as Record<string, any>);

    const monthlyChartData = Object.values(monthlyData).slice(-6);

    // Données pour le graphique des statuts
    const statusData = [
      { name: 'Complétées', value: transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length, color: '#43A047' },
      { name: 'En attente', value: transactions.filter(tx => tx.status === TransactionStatus.PENDING).length, color: '#F2C94C' },
      { name: 'Validées', value: transactions.filter(tx => tx.status === TransactionStatus.VALIDATED).length, color: '#3B82F6' },
      { name: 'Annulées', value: transactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length, color: '#F97316' }
    ].filter(item => item.value > 0);

    return { monthlyChartData, statusData };
  }, [transactions]);

  return (
    <>
      {/* Graphique des revenus mensuels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047]">Évolution des Revenus</CardTitle>
          <CardDescription>Revenus et volume des 6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} ${name === 'revenue' ? 'USD (Revenus)' : name === 'volume' ? 'USD (Volume)' : 'Transactions'}`,
                    name === 'revenue' ? 'Revenus' : name === 'volume' ? 'Volume' : 'Nombre'
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#43A047" name="Revenus" />
                <Bar dataKey="volume" fill="#F2C94C" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphique des statuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047]">Répartition par Statut</CardTitle>
          <CardDescription>Distribution des transactions par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
