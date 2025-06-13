
import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TransactionService } from "@/services/TransactionService";
import { Transaction, TransactionStatus } from "@/types";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";

const COLORS = ['#43A047', '#F2C94C', '#F97316', '#3B82F6', '#8B5CF6'];

export function AccountingReports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportData = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // Données mensuelles
    const monthlyData = completedTransactions.reduce((acc, tx) => {
      const month = new Date(tx.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, volume: 0, count: 0, profit: 0 };
      }
      acc[month].revenue += tx.commissionAmount;
      acc[month].volume += tx.amount;
      acc[month].count += 1;
      acc[month].profit += tx.commissionAmount * 0.70; // 70% de marge
      return acc;
    }, {} as Record<string, any>);

    // Données par devise
    const currencyData = completedTransactions.reduce((acc, tx) => {
      if (!acc[tx.currency]) {
        acc[tx.currency] = { currency: tx.currency, count: 0, volume: 0, revenue: 0 };
      }
      acc[tx.currency].count += 1;
      acc[tx.currency].volume += tx.amount;
      acc[tx.currency].revenue += tx.commissionAmount;
      return acc;
    }, {} as Record<string, any>);

    // Données de performance
    const performanceData = {
      totalRevenue: completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0),
      totalVolume: completedTransactions.reduce((acc, tx) => acc + tx.amount, 0),
      totalTransactions: completedTransactions.length,
      averageCommission: completedTransactions.length > 0 ? completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0) / completedTransactions.length : 0,
      conversionRate: transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0
    };

    return {
      monthlyChartData: Object.values(monthlyData).slice(-12),
      currencyChartData: Object.values(currencyData),
      performanceData
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#43A047]"></div>
        <span className="ml-2">Chargement des rapports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047] flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Rapports Comptables</span>
          </CardTitle>
          <CardDescription>
            Analyses détaillées et rapports de performance financière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center space-x-2">
                <LineChart className="h-4 w-4" />
                <span>Tendances</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center space-x-2">
                <PieChart className="h-4 w-4" />
                <span>Répartition</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              {/* KPIs de performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[#43A047]">
                      {reportData.performanceData.totalRevenue.toLocaleString()} USD
                    </div>
                    <div className="text-sm text-gray-600">Revenus Totaux</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[#43A047]">
                      {reportData.performanceData.totalVolume.toLocaleString()} USD
                    </div>
                    <div className="text-sm text-gray-600">Volume Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[#43A047]">
                      {reportData.performanceData.totalTransactions}
                    </div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-[#43A047]">
                      {reportData.performanceData.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Taux de Conversion</div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphique des revenus mensuels */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={reportData.monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#43A047" name="Revenus" />
                        <Bar dataKey="profit" fill="#F2C94C" name="Profit Net" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={reportData.monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#43A047" strokeWidth={3} name="Revenus" />
                        <Line type="monotone" dataKey="volume" stroke="#F2C94C" strokeWidth={2} name="Volume" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Devise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={reportData.currencyChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ currency, percent }) => `${currency} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {reportData.currencyChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques par Devise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.currencyChartData.map((currency: any, index: number) => (
                        <div key={currency.currency} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="font-medium">{currency.currency}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{currency.count} transactions</div>
                            <div className="text-sm text-gray-600">{currency.revenue.toLocaleString()} USD revenus</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
