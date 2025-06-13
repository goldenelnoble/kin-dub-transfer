
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
 * Générateur d'ID de transaction court (6 caractères)
 */
export class TransactionIdGenerator {
  private static generateShortId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateUniqueId(existingIds: string[] = []): string {
    let newId = this.generateShortId();
    let attempts = 0;
    const maxAttempts = 100;
    
    while (existingIds.includes(newId) && attempts < maxAttempts) {
      newId = this.generateShortId();
      attempts++;
    }
    
    return newId;
  }
}

/**
 * Gestionnaire de transactions avec validation par superviseur/administrateur
 * et mise à jour en temps réel des statistiques
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
    'transaction:cancelled': [],
    'stats:updated': []  // Événement pour les mises à jour de statistiques
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
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erreur dans le gestionnaire d'événement ${event}:`, error);
        }
      });
    }
  }

  /**
   * Obtenir les statistiques actuelles
   */
  static getStats() {
    return {...this.stats};
  }

  /**
   * Créer une transaction en attente avec un ID court
   */
  static createTransaction(transaction: Transaction): Transaction {
    // Générer un ID court de 6 caractères si pas déjà défini
    if (!transaction.id || transaction.id.length !== 6) {
      const existingTransactions = this.getAllTransactions();
      const existingIds = existingTransactions.map(tx => tx.id);
      transaction.id = TransactionIdGenerator.generateUniqueId(existingIds);
    }

    // Assurons-nous que la transaction est en statut "pending" (en attente)
    transaction.status = TransactionStatus.PENDING;
    
    // Sauvegarder la transaction immédiatement
    this.saveTransaction(transaction);
    
    // Récupérer toutes les transactions pour recalculer les statistiques
    const existingTransactions = this.getAllTransactions();
    this.calculateStatsFromTransactions(existingTransactions);
    
    // Émettre l'événement de création
    this.emit('transaction:created', transaction);
    
    return transaction;
  }
  
  /**
   * Récupérer toutes les transactions du localStorage
   */
  static getAllTransactions(): Transaction[] {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        return JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
    }
    return [];
  }

  private static updateStatsWithTransaction(transaction: Transaction) {
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
    
    // Émettre l'événement de mise à jour des stats
    this.emit('stats:updated', this.getStats());
    
    return this.getStats();
  }

  static saveTransaction(transaction: Transaction) {
    // Récupérer les transactions existantes
    const existingTransactions = this.getAllTransactions();
    
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
    try {
      localStorage.setItem('transactions', JSON.stringify(existingTransactions));
      
      // Déclencher une mise à jour des statistiques
      this.calculateStatsFromTransactions(existingTransactions);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des transactions:", error);
    }
    
    return transaction;
  }

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
      
      // Mettre à jour les statistiques
      if (transaction.status !== TransactionStatus.VALIDATED) {
        this.stats.transactionValidee++;
      }
      
      // Émettre l'événement
      this.emit('transaction:validated', updatedTransaction);
    } 
    else if (action === "complete") {
      // Mettre à jour en "complétée"
      const wasAlreadyCompleted = transaction.status === TransactionStatus.COMPLETED;
      updatedTransaction.status = TransactionStatus.COMPLETED;
      
      // Si nécessaire, enregistrer qui a complété la transaction
      if (!updatedTransaction.validatedBy) {
        updatedTransaction.validatedBy = validator;
        updatedTransaction.validatedAt = now;
      }
      
      // Mise à jour des statistiques
      if (!wasAlreadyCompleted) {
        this.stats.transactionCompletee++;
        
        // Mettre à jour les montants
        this.stats.montantTotal += transaction.amount;
        this.stats.commissionTotale += transaction.commissionAmount;
      }
      
      // Émettre l'événement
      this.emit('transaction:completed', updatedTransaction);
    } 
    else if (action === "cancel") {
      // Mettre à jour en "annulée"
      const wasAlreadyCancelled = transaction.status === TransactionStatus.CANCELLED;
      updatedTransaction.status = TransactionStatus.CANCELLED;
      updatedTransaction.validatedBy = validator;
      updatedTransaction.validatedAt = now;
      
      // Mise à jour des statistiques
      if (!wasAlreadyCancelled) {
        this.stats.transactionAnnulee++;
      }
      
      // Émettre l'événement
      this.emit('transaction:cancelled', updatedTransaction);
    }
    
    // Mise à jour de la transaction
    transactions[transactionIndex] = updatedTransaction;
    
    // Sauvegarder les transactions mises à jour dans localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Émettre l'événement de mise à jour
    this.emit('transaction:updated', updatedTransaction);
    
    // Recalculer les statistiques avec toutes les transactions à jour
    this.calculateStatsFromTransactions(transactions);
    
    return {
      transaction: updatedTransaction,
      success: true,
      message: `Transaction mise à jour avec succès`,
      stats: this.getStats()
    };
  }

  static resetStats() {
    this.stats = {
      transactionTotal: 0,
      transactionCompletee: 0,
      transactionValidee: 0,
      transactionAnnulee: 0,
      montantTotal: 0,
      commissionTotale: 0
    };
    
    // Notification que les stats ont été réinitialisées
    this.emit('stats:updated', this.getStats());
  }

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
    
    // Notifier tous les composants que les statistiques ont changé
    this.emit('stats:updated', this.getStats());
    
    return this.getStats();
  }
}
