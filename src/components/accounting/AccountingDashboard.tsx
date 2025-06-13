
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionService } from "@/services/TransactionService";
import { Transaction } from "@/types";
import { AccountingSummaryCards } from "./AccountingSummaryCards";
import { AccountingCharts } from "./AccountingCharts";
import { RecentTransactionsAccounting } from "./RecentTransactionsAccounting";

export function AccountingDashboard() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#43A047]"></div>
        <span className="ml-2">Chargement des données comptables...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#43A047] mb-2">Tableau de Bord Comptable</h2>
        <p className="text-gray-600">Vue d'ensemble de votre situation financière</p>
      </div>

      {/* Cartes de résumé */}
      <AccountingSummaryCards transactions={transactions} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountingCharts transactions={transactions} />
        <RecentTransactionsAccounting transactions={transactions.slice(0, 10)} />
      </div>
    </div>
  );
}
