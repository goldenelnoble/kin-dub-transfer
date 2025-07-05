
import { useState, useEffect } from "react";
import { Transaction, DashboardStats, TransactionStatus } from "@/types";
import { TransactionService } from "@/services/TransactionService";
import { TransactionRealtime } from "@/services/realtime/TransactionRealtime";
import { toast } from "@/components/ui/sonner";

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    cancelledTransactions: 0,
    totalAmount: 0,
    totalCommissions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      console.log('Dashboard: Loading dashboard data...');
      setIsLoading(true);
      
      const transactions = await TransactionService.getAllTransactions();
      console.log(`Dashboard: Loaded ${transactions.length} transactions`);
      
      setAllTransactions(transactions);
      
      // Calculate stats
      const newStats = {
        totalTransactions: transactions.length,
        pendingTransactions: transactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
        completedTransactions: transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length,
        cancelledTransactions: transactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length,
        totalAmount: transactions.reduce((acc, tx) => acc + tx.amount, 0),
        totalCommissions: transactions.reduce((acc, tx) => acc + tx.commissionAmount, 0)
      };
      
      setStats(newStats);
      console.log('Dashboard: Calculated stats:', newStats);
      
      // Get recent transactions (last 3)
      const recent = transactions
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
      setRecentTransactions(recent);
      
    } catch (error) {
      console.error("Dashboard: Error loading data:", error);
      toast.error("Erreur lors du chargement des données du tableau de bord");
      
      // Reset to default values on error
      setStats({
        totalTransactions: 0,
        pendingTransactions: 0,
        completedTransactions: 0,
        cancelledTransactions: 0,
        totalAmount: 0,
        totalCommissions: 0
      });
      setAllTransactions([]);
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Dashboard: Component mounted, loading data...');
    loadDashboardData();

    // Subscribe to real-time updates
    const handleDashboardUpdate = () => {
      console.log('Dashboard: Received real-time update, refreshing data...');
      loadDashboardData();
    };

    TransactionService.subscribeToTransactionChanges(handleDashboardUpdate);

    return () => {
      console.log('Dashboard: Cleaning up subscription...');
      TransactionRealtime.unsubscribe(handleDashboardUpdate);
    };
  }, []);

  return {
    stats,
    recentTransactions,
    allTransactions,
    isLoading,
    loadDashboardData
  };
}
