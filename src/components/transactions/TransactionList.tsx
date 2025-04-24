
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
    // Charger toutes les transactions existantes
    loadTransactions();

    // S'abonner aux événements de transaction pour des mises à jour en temps réel
    const unsubscribeCreated = TransactionManager.subscribe('transaction:created', handleTransactionCreated);
    const unsubscribeUpdated = TransactionManager.subscribe('transaction:updated', handleTransactionUpdated);
    const unsubscribeValidated = TransactionManager.subscribe('transaction:validated', handleTransactionUpdated);
    const unsubscribeCompleted = TransactionManager.subscribe('transaction:completed', handleTransactionUpdated);
    const unsubscribeCancelled = TransactionManager.subscribe('transaction:cancelled', handleTransactionUpdated);

    return () => {
      // Nettoyage des abonnements lors du démontage du composant
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeValidated();
      unsubscribeCompleted();
      unsubscribeCancelled();
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
    // Mettre à jour l'état local avec la nouvelle transaction
    setTransactions(current => {
      const newTransactions = [transaction, ...current];
      // Mettre à jour les statistiques globales
      TransactionManager.calculateStatsFromTransactions(newTransactions);
      return newTransactions;
    });
    
    toast.success("Nouvelle transaction créée", {
      description: `La transaction ${transaction.id} a été créée avec succès`
    });
  };

  // Gestionnaire pour une transaction mise à jour
  const handleTransactionUpdated = (transaction: Transaction) => {
    setTransactions(current => {
      const updated = current.map(tx => tx.id === transaction.id ? transaction : tx);
      // Recalculer les statistiques avec les transactions mises à jour
      TransactionManager.calculateStatsFromTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
      return updated;
    });
  };

  // Gestion suppression d'une transaction (ADMIN uniquement)
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
    // Simple navigation vers la page de détails (fonction d'édition centralisée)
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
      user?.name || "Admin User", // Utiliser le nom de l'utilisateur connecté si disponible
      action,
      user?.role || UserRole.ADMIN 
    );
    
    if (result.success) {
      // Mettre à jour l'état des transactions - déjà géré via les événements
      
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
            canEdit={!!user && user.role === UserRole.ADMIN}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </CardContent>
    </Card>
  );
}
