import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus, TransactionDirection, Currency, PaymentMethod, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { TransactionStats } from "./TransactionStats";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { filterTransactions, TransactionManager } from "./utils/transactionUtils";

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Effet pour réinitialiser toutes les données au chargement
  useEffect(() => {
    // Reset TransactionManager stats
    TransactionManager.resetStats();
    
    // Clear localStorage
    localStorage.clear();
    
    // Initialize empty transactions state
    setTransactions([]);
    
    // Afficher une notification de confirmation
    toast.success("Toutes les données ont été réinitialisées", {
      description: "Les compteurs et transactions ont été remis à zéro"
    });
    
    // S'abonner aux événements du gestionnaire de transactions
    const unsubscribeCreated = TransactionManager.subscribe('transaction:created', handleTransactionCreated);
    const unsubscribeUpdated = TransactionManager.subscribe('transaction:updated', handleTransactionUpdated);
    
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, []);

  // Fonction pour charger les transactions depuis localStorage
  const loadTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      try {
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        setTransactions(parsedTransactions);
        TransactionManager.calculateStatsFromTransactions(parsedTransactions);
      } catch (error) {
        console.error("Erreur lors du parsing des transactions:", error);
        setTransactions([]);
        toast.error("Erreur lors du chargement des transactions");
      }
    } else {
      setTransactions([]);
      TransactionManager.resetStats();
    }
  };

  // Gestionnaire pour une nouvelle transaction créée
  const handleTransactionCreated = (transaction: Transaction) => {
    toast.success("Nouvelle transaction créée", {
      description: `La transaction ${transaction.id} a été créée avec succès`
    });
    loadTransactions(); // Recharger les transactions
  };

  // Gestionnaire pour une transaction mise à jour
  const handleTransactionUpdated = (transaction: Transaction) => {
    // Mettre à jour l'état local sans recharger toutes les transactions
    setTransactions(current => 
      current.map(tx => tx.id === transaction.id ? transaction : tx)
    );
    
    // Sauvegarder dans localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  };

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    const now = new Date();
    
    // Déterminer l'action appropriée en fonction du nouveau statut
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
    
    // Utiliser le TransactionManager pour effectuer la validation
    const result = TransactionManager.validateTransaction(
      transactions,
      id,
      "Admin User", // Normalement, cela devrait venir de l'utilisateur connecté
      action,
      UserRole.ADMIN // Utilisation de l'énumération UserRole au lieu de la chaîne
    );
    
    if (result.success) {
      // Mettre à jour l'état des transactions
      setTransactions([...transactions]);
      
      // Enregistrer les modifications dans localStorage
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Afficher une notification appropriée
      const statusMessages = {
        [TransactionStatus.VALIDATED]: "Transaction validée !",
        [TransactionStatus.COMPLETED]: "Transaction complétée !",
        [TransactionStatus.CANCELLED]: "Transaction annulée !"
      };
      
      if (statusMessages[newStatus]) {
        toast[newStatus === TransactionStatus.CANCELLED ? "error" : "success"](
          statusMessages[newStatus], 
          {
            description: `${result.message}`
          }
        );
      }
    } else {
      // Afficher une erreur en cas d'échec
      toast.error(result.message);
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
          />
        </div>
      </CardContent>
    </Card>
  );
}
