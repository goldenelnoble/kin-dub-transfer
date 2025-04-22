import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus, Currency, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { TransactionStats } from "./TransactionStats";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { filterTransactions, TransactionManager } from "./utils/transactionUtils";
import { useAuth } from "@/context/AuthContext";

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    // Suppression de la réinitialisation automatique (plus de clear localStorage ou resetStats ici)
    // Charger toutes les transactions existantes si elles existent
    loadTransactions();

    // S'abonner uniquement aux événements de création et mise à jour
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
    loadTransactions(); // Recharger les transactions
    toast.success("Nouvelle transaction créée", {
      description: `La transaction ${transaction.id} a été créée avec succès`
    });
  };

  // Gestionnaire pour une transaction mise à jour
  const handleTransactionUpdated = (transaction: Transaction) => {
    setTransactions(current => {
      const updated = current.map(tx => tx.id === transaction.id ? transaction : tx);
      TransactionManager.calculateStatsFromTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  };

  // Gestion suppression d’une transaction (ADMIN uniquement)
  const handleDeleteTransaction = (id: string) => {
    if (!user || user.role !== UserRole.ADMIN) {
      toast.error("Seul un administrateur peut supprimer une transaction.");
      return;
    }
    // Confirmation
    if (!window.confirm("Voulez-vous vraiment supprimer cette transaction ?")) return;

    const updatedTransactions = transactions.filter(tx => tx.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    TransactionManager.calculateStatsFromTransactions(updatedTransactions);
    toast.success("Transaction supprimée !");
  };

  // Gestion édition (remonte le contrôle à un parent ou navigation vers la fiche)
  const handleEditTransaction = (id: string) => {
    // Simple navigation vers la page de détails (fonction d’édition centralisée)
    window.location.href = `/transactions/${id}?edit=1`;
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
            onDirectionChange={setDirectionChange}
            currencyFilter={currencyFilter}
            onCurrencyChange={setCurrencyChange}
            paymentMethodFilter={paymentMethodFilter}
            onPaymentMethodChange={setPaymentMethodChange}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
          <TransactionTable 
            transactions={filteredTransactions}
            onUpdateStatus={handleUpdateStatus}
            // Ajout des props d’admin
            canEdit={!!user && user.role === UserRole.ADMIN}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </CardContent>
    </Card>
  );
}
