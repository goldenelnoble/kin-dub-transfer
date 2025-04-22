
import { Transaction, TransactionStatus, UserRole } from "@/types";

export const filterTransactions = (
  transactions: Transaction[],
  searchQuery: string,
  statusFilter: string,
  directionFilter: string,
  currencyFilter: string,
  paymentMethodFilter: string,
  dateFilter: string
) => {
  return transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesDirection = directionFilter === "all" || transaction.direction === directionFilter;
    const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
    
    let matchesDate = true;
    const today = new Date();
    const txDate = new Date(transaction.createdAt);
    
    switch (dateFilter) {
      case "today":
        matchesDate = txDate.toDateString() === today.toDateString();
        break;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = txDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        matchesDate = txDate >= monthAgo;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesStatus && matchesDirection && matchesCurrency && 
           matchesPaymentMethod && matchesDate;
  });
};

/**
 * Gestionnaire de transactions avec validation par superviseur/administrateur
 */
export class TransactionManager {
  // Statistiques globales
  private static stats = {
    transactionTotal: 0,
    transactionCompletee: 0,
    transactionValidee: 0,
    transactionAnnulee: 0,
    montantTotal: 0,
    commissionTotale: 0
  };

  // Event bus pour la communication entre composants
  private static listeners: { [event: string]: Function[] } = {
    'transaction:created': [],
    'transaction:updated': [],
    'transaction:validated': [],
    'transaction:completed': [],
    'transaction:cancelled': []
  };

  /**
   * S'abonner à un événement de transaction
   */
  static subscribe(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Déclencher un événement
   */
  private static emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Obtenir les statistiques actuelles
   */
  static getStats() {
    return {...this.stats};
  }

  /**
   * Créer une transaction en attente
   */
  static createTransaction(transaction: Transaction): Transaction {
    // Assurons-nous que la transaction est en statut "pending" (en attente)
    transaction.status = TransactionStatus.PENDING;
    
    // Emettre l'événement de création
    this.emit('transaction:created', transaction);
    
    return transaction;
  }

  /**
   * Sauvegarder une transaction dans le localStorage
   */
  static saveTransaction(transaction: Transaction) {
    // Récupérer les transactions existantes
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Vérifier si la transaction existe déjà
    const existingIndex = existingTransactions.findIndex((tx: Transaction) => tx.id === transaction.id);
    
    if (existingIndex >= 0) {
      // Mettre à jour la transaction existante
      existingTransactions[existingIndex] = transaction;
    } else {
      // Ajouter la nouvelle transaction
      existingTransactions.unshift(transaction);
    }
    
    // Sauvegarder les transactions
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    return transaction;
  }

  /**
   * Valider ou annuler une transaction
   */
  static validateTransaction(
    transactions: Transaction[],
    transactionId: string, 
    validator: string, 
    action: "validate" | "complete" | "cancel",
    userRole: UserRole
  ): { 
    transaction: Transaction | null,
    success: boolean,
    message: string,
    stats: typeof TransactionManager.stats
  } {
    // Vérification du rôle utilisateur
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPERVISOR) {
      return {
        transaction: null,
        success: false, 
        message: "Seul un administrateur ou superviseur peut valider les transactions",
        stats: this.getStats()
      };
    }
    
    // Recherche de la transaction
    const transactionIndex = transactions.findIndex(tx => tx.id === transactionId);
    
    if (transactionIndex === -1) {
      return {
        transaction: null,
        success: false, 
        message: `Transaction ${transactionId} non trouvée`,
        stats: this.getStats()
      };
    }
    
    const transaction = transactions[transactionIndex];
    
    // Vérification que la transaction n'a pas déjà été traitée
    if (action === "validate" && transaction.status !== TransactionStatus.PENDING) {
      return {
        transaction,
        success: false, 
        message: `Transaction ${transactionId} déjà traitée (statut: ${transaction.status})`,
        stats: this.getStats()
      };
    }
    
    // Application de l'action
    const now = new Date();
    const updatedTransaction = { ...transaction, updatedAt: now };
    
    if (action === "validate") {
      // Mettre à jour en "validée"
      updatedTransaction.status = TransactionStatus.VALIDATED;
      updatedTransaction.validatedBy = validator;
      updatedTransaction.validatedAt = now;
      
      // Mise à jour des statistiques
      this.stats.transactionValidee++;
      
      if (this.stats.transactionTotal === 0) {
        // Si pas encore comptabilisée dans le total
        this.stats.transactionTotal++;
      }
      
      // Émettre l'événement
      this.emit('transaction:validated', updatedTransaction);
    } 
    else if (action === "complete") {
      // Mettre à jour en "complétée"
      updatedTransaction.status = TransactionStatus.COMPLETED;
      
      // Si nécessaire, enregistrer qui a complété la transaction
      if (!updatedTransaction.validatedBy) {
        updatedTransaction.validatedBy = validator;
        updatedTransaction.validatedAt = now;
      }
      
      // Mise à jour des statistiques
      this.stats.transactionCompletee++;
      
      if (this.stats.transactionTotal === 0) {
        // Si pas encore comptabilisée dans le total
        this.stats.transactionTotal++;
      }
      
      // Mettre à jour les montants
      this.stats.montantTotal += transaction.amount;
      this.stats.commissionTotale += transaction.commissionAmount;
      
      // Émettre l'événement
      this.emit('transaction:completed', updatedTransaction);
    } 
    else if (action === "cancel") {
      // Mettre à jour en "annulée"
      updatedTransaction.status = TransactionStatus.CANCELLED;
      updatedTransaction.validatedBy = validator;
      updatedTransaction.validatedAt = now;
      
      // Mise à jour des statistiques
      this.stats.transactionAnnulee++;
      
      if (this.stats.transactionTotal === 0) {
        // Si pas encore comptabilisée dans le total
        this.stats.transactionTotal++;
      }
      
      // Émettre l'événement
      this.emit('transaction:cancelled', updatedTransaction);
    }
    
    // Mise à jour de la transaction
    transactions[transactionIndex] = updatedTransaction;
    
    // Émettre l'événement de mise à jour
    this.emit('transaction:updated', updatedTransaction);
    
    return {
      transaction: updatedTransaction,
      success: true,
      message: `Transaction ${transactionId} ${action === "validate" ? "validée" : action === "complete" ? "complétée" : "annulée"} avec succès`,
      stats: this.getStats()
    };
  }

  /**
   * Réinitialiser les statistiques (utile pour les tests)
   */
  static resetStats() {
    this.stats = {
      transactionTotal: 0,
      transactionCompletee: 0,
      transactionValidee: 0,
      transactionAnnulee: 0,
      montantTotal: 0,
      commissionTotale: 0
    };
  }

  /**
   * Calculer les statistiques à partir des transactions
   */
  static calculateStatsFromTransactions(transactions: Transaction[]) {
    this.resetStats();
    
    // Parcourir toutes les transactions et mettre à jour les statistiques
    transactions.forEach(transaction => {
      this.stats.transactionTotal++;
      
      if (transaction.status === TransactionStatus.COMPLETED) {
        this.stats.transactionCompletee++;
        this.stats.montantTotal += transaction.amount;
        this.stats.commissionTotale += transaction.commissionAmount;
      } 
      else if (transaction.status === TransactionStatus.VALIDATED) {
        this.stats.transactionValidee++;
      } 
      else if (transaction.status === TransactionStatus.CANCELLED) {
        this.stats.transactionAnnulee++;
      }
    });
    
    return this.getStats();
  }
}
