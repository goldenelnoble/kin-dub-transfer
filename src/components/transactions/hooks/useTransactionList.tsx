
import { useState, useEffect } from "react";
import { Transaction, TransactionStatus, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { filterTransactions } from "../utils/transactionUtils";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/services/TransactionService";
import { TransactionRealtime } from "@/services/realtime/TransactionRealtime";

const ITEMS_PER_PAGE = 10;

export function useTransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    console.log('useTransactionList: Loading transactions...');
    loadTransactions();

    // Subscribe to real-time updates
    const handleTransactionUpdate = (updatedTransaction: Transaction) => {
      console.log('useTransactionList: Received real-time update for transaction:', updatedTransaction.id);
      setTransactions(current => {
        const existingIndex = current.findIndex(tx => tx.id === updatedTransaction.id);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = updatedTransaction;
          console.log('useTransactionList: Updated existing transaction in list');
          return updated;
        } else {
          console.log('useTransactionList: Added new transaction to list');
          return [updatedTransaction, ...current];
        }
      });
    };

    TransactionService.subscribeToTransactionChanges(handleTransactionUpdate);

    return () => {
      console.log('useTransactionList: Cleaning up subscription...');
      TransactionRealtime.unsubscribe(handleTransactionUpdate);
    };
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, directionFilter, currencyFilter, paymentMethodFilter, dateFilter]);

  const loadTransactions = async () => {
    try {
      console.log('useTransactionList: Starting to load transactions...');
      setLoading(true);
      
      const data = await TransactionService.getAllTransactions();
      console.log(`useTransactionList: Loaded ${data.length} transactions`);
      
      setTransactions(data);
      toast.success(`${data.length} transactions chargées avec succès`);
    } catch (error) {
      console.error("useTransactionList: Error loading transactions:", error);
      toast.error("Erreur lors du chargement des transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user || user.role !== UserRole.ADMIN) {
      toast.error("Seul un administrateur peut supprimer une transaction.");
      return;
    }
    
    if (!window.confirm("Voulez-vous vraiment supprimer cette transaction ?")) return;

    try {
      console.log(`useTransactionList: Deleting transaction ${id}...`);
      await TransactionService.deleteTransaction(id);
      
      setTransactions(current => current.filter(tx => tx.id !== id));
      toast.success("Transaction supprimée avec succès !");
      console.log(`useTransactionList: Successfully deleted transaction ${id}`);
    } catch (error) {
      console.error("useTransactionList: Error deleting transaction:", error);
      toast.error("Erreur lors de la suppression de la transaction");
    }
  };

  const handleEditTransaction = (id: string) => {
    console.log(`useTransactionList: Navigating to edit transaction ${id}`);
    window.location.href = `/transactions/${id}?edit=1`;
  };

  const handleUpdateStatus = async (id: string, newStatus: TransactionStatus) => {
    console.log(`useTransactionList: Updating transaction ${id} status to ${newStatus}`);
    
    try {
      const updatedTransaction = await TransactionService.updateTransactionStatus(
        id,
        newStatus,
        user?.name || "Admin User"
      );
      
      setTransactions(current => 
        current.map(tx => tx.id === id ? updatedTransaction : tx)
      );
      
      const statusMessages = {
        [TransactionStatus.VALIDATED]: "Transaction validée avec succès !",
        [TransactionStatus.COMPLETED]: "Transaction complétée avec succès !",
        [TransactionStatus.CANCELLED]: "Transaction annulée !"
      };
      
      if (statusMessages[newStatus]) {
        toast[newStatus === TransactionStatus.CANCELLED ? "error" : "success"](
          statusMessages[newStatus]
        );
      }
      
      console.log(`useTransactionList: Successfully updated transaction ${id} status`);
    } catch (error) {
      console.error("useTransactionList: Error updating transaction status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const filteredTransactions = filterTransactions(
    transactions,
    searchQuery,
    statusFilter,
    directionFilter,
    currencyFilter,
    paymentMethodFilter,
    dateFilter
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  return {
    // State
    transactions,
    loading,
    currentPage,
    searchQuery,
    statusFilter,
    directionFilter,
    currencyFilter,
    paymentMethodFilter,
    dateFilter,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    startIndex,
    endIndex,
    user,
    
    // Setters
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setDirectionFilter,
    setCurrencyFilter,
    setPaymentMethodFilter,
    setDateFilter,
    
    // Handlers
    handleDeleteTransaction,
    handleEditTransaction,
    handleUpdateStatus,
    
    // Utils
    ITEMS_PER_PAGE
  };
}
