
import React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionService } from "@/services/TransactionService";
import { Transaction, TransactionStatus } from "@/types";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { useMemo } from "react";

export function CashFlowAnalysis() {
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

  const cashFlowAnalysis = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // Analyse mensuelle des flux de trésorerie
    const monthlyFlows = completedTransactions.reduce((acc, tx) => {
      const month = new Date(tx.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { 
          month, 
          inflow: 0, 
          outflow: 0, 
          netFlow: 0,
          cumulativeFlow: 0,
          transactions: 0
        };
      }
      const inflow = tx.commissionAmount;
      const outflow = tx.commissionAmount * 0.30; // Estimation des coûts
      
      acc[month].inflow += inflow;
      acc[month].outflow += outflow;
      acc[month].netFlow += (inflow - outflow);
      acc[month].transactions += 1;
      return acc;
    }, {} as Record<string, any>);

    // Calcul des flux cumulés
    const monthlyData = Object.values(monthlyFlows).slice(-12);
    let cumulativeFlow = 50000; // Trésorerie initiale
    monthlyData.forEach((month: any) => {
      cumulativeFlow += month.netFlow;
      month.cumulativeFlow = cumulativeFlow;
    });

    // Analyse quotidienne (derniers 30 jours)
    const dailyFlows = completedTransactions
      .filter(tx => {
        const txDate = new Date(tx.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return txDate >= thirtyDaysAgo;
      })
      .reduce((acc, tx) => {
        const day = new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        if (!acc[day]) {
          acc[day] = { day, inflow: 0, outflow: 0, netFlow: 0 };
        }
        const inflow = tx.commissionAmount;
        const outflow = tx.commissionAmount * 0.30;
        
        acc[day].inflow += inflow;
        acc[day].outflow += outflow;
        acc[day].netFlow += (inflow - outflow);
        return acc;
      }, {} as Record<string, any>);

    const dailyData = Object.values(dailyFlows);

    // Métriques clés
    const totalInflow = completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0);
    const totalOutflow = totalInflow * 0.30;
    const netCashFlow = totalInflow - totalOutflow;
    const currentCashPosition = 50000 + netCashFlow;
    
    // Projections (basées sur la moyenne des 3 derniers mois)
    const recentMonths = monthlyData.slice(-3);
    const avgMonthlyInflow = recentMonths.reduce((acc, month) => acc + month.inflow, 0) / recentMonths.length;
    const avgMonthlyOutflow = recentMonths.reduce((acc, month) => acc + month.outflow, 0) / recentMonths.length;
    const projectedMonthlyNet = avgMonthlyInflow - avgMonthlyOutflow;

    return {
      monthlyData,
      dailyData,
      totalInflow,
      totalOutflow,
      netCashFlow,
      currentCashPosition,
      avgMonthlyInflow,
      avgMonthlyOutflow,
      projectedMonthlyNet
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#43A047]"></div>
        <span className="ml-2">Chargement de l'analyse des flux...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047] flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Analyse des Flux de Trésorerie</span>
          </CardTitle>
          <CardDescription>
            Analyse détaillée des entrées et sorties de trésorerie
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Indicateurs de flux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      +{cashFlowAnalysis.totalInflow.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Entrées Totales</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-700">
                      -{cashFlowAnalysis.totalOutflow.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-600">Sorties Totales</div>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${cashFlowAnalysis.netCashFlow >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                      {cashFlowAnalysis.netCashFlow >= 0 ? '+' : ''}{cashFlowAnalysis.netCashFlow.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Flux Net</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 bg-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">
                      {cashFlowAnalysis.currentCashPosition.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-600">Position Actuelle</div>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique des flux mensuels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle des Flux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowAnalysis.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="inflow" stackId="1" stroke="#43A047" fill="#43A047" fillOpacity={0.6} name="Entrées" />
                      <Area type="monotone" dataKey="outflow" stackId="2" stroke="#F97316" fill="#F97316" fillOpacity={0.6} name="Sorties" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position de Trésorerie Cumulative</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashFlowAnalysis.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cumulativeFlow" stroke="#3B82F6" strokeWidth={3} name="Trésorerie Cumulative" />
                      <Line type="monotone" dataKey="netFlow" stroke="#F2C94C" strokeWidth={2} name="Flux Net Mensuel" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyse quotidienne récente */}
          <Card>
            <CardHeader>
              <CardTitle>Flux Quotidiens (30 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowAnalysis.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inflow" fill="#43A047" name="Entrées" />
                    <Bar dataKey="outflow" fill="#F97316" name="Sorties" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Projections Basées sur les Tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">
                    +{cashFlowAnalysis.avgMonthlyInflow.toLocaleString()} USD
                  </div>
                  <div className="text-sm text-green-600">Entrées Mensuelles Moyennes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-700">
                    -{cashFlowAnalysis.avgMonthlyOutflow.toLocaleString()} USD
                  </div>
                  <div className="text-sm text-red-600">Sorties Mensuelles Moyennes</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className={`text-xl font-bold ${cashFlowAnalysis.projectedMonthlyNet >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    {cashFlowAnalysis.projectedMonthlyNet >= 0 ? '+' : ''}{cashFlowAnalysis.projectedMonthlyNet.toLocaleString()} USD
                  </div>
                  <div className="text-sm text-blue-600">Flux Net Projeté/Mois</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
