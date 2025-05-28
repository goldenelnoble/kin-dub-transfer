
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { TransactionStats } from "./TransactionStats";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { filterTransactions } from "./utils/transactionUtils";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/services/TransactionService";

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    loadTransactions();

    // Subscribe to real-time updates
    const subscription = TransactionService.subscribeToTransactionChanges((updatedTransaction) => {
      setTransactions(current => {
        const existingIndex = current.findIndex(tx => tx.id === updatedTransaction.id);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = updatedTransaction;
          return updated;
        } else {
          return [updatedTransaction, ...current];
        }
      });
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
      toast.error("Erreur lors du chargement des transactions");
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
      await TransactionService.deleteTransaction(id);
      setTransactions(current => current.filter(tx => tx.id !== id));
      toast.success("Transaction supprimée !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la transaction");
    }
  };

  const handleEditTransaction = (id: string) => {
    window.location.href = `/transactions/${id}?edit=1`;
  };

  const handleUpdateStatus = async (id: string, newStatus: TransactionStatus) => {
    let action: "validate" | "complete" | "cancel";
    switch (newStatus) {
      case TransactionStatus.VALIDATED:
        action = "validate";
        break;
      case TransactionStatus.COMPLETED:
        action = "complete";
        break;
      case TransactionStatus.CANCELLED:
        action = "cancel";
        break;
      default:
        toast.error("Action non prise en charge");
        return;
    }
    
    try {
      const updatedTransaction = await TransactionService.updateTransactionStatus(
        id,
        newStatus,
        user?.name || "Admin User"
      );
      
      // Update local state
      setTransactions(current => 
        current.map(tx => tx.id === id ? updatedTransaction : tx)
      );
      
      const statusMessages = {
        [TransactionStatus.VALIDATED]: "Transaction validée !",
        [TransactionStatus.COMPLETED]: "Transaction complétée !",
        [TransactionStatus.CANCELLED]: "Transaction annulée !"
      };
      
      if (statusMessages[newStatus]) {
        toast[newStatus === TransactionStatus.CANCELLED ? "error" : "success"](
          statusMessages[newStatus]
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F97316]"></div>
          <span className="ml-2">Chargement des transactions...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toutes les Transactions</CardTitle>
        <CardDescription>Liste complète des transactions avec filtres</CardDescription>
        <TransactionStats 
          transactions={filteredTransactions}
          currencyFilter={currencyFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TransactionFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            directionFilter={directionFilter}
            onDirectionChange={setDirectionFilter}
            currencyFilter={currencyFilter}
            onCurrencyChange={setCurrencyFilter}
            paymentMethodFilter={paymentMethodFilter}
            onPaymentMethodChange={setPaymentMethodFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
          <TransactionTable 
            transactions={filteredTransactions}
            onUpdateStatus={handleUpdateStatus}
            canEdit={!!user && user.role === UserRole.ADMIN}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </CardContent>
    </Card>
  );
}
