
import { Transaction, User } from "@/types";
import { TransactionManager } from "@/components/transactions/utils/transactionUtils";
import { toast } from "@/components/ui/sonner";

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  date: string;
  status: string;
  details: string;
}

export class DataManagementService {
  // Clés de stockage local
  private static readonly TRANSACTIONS_KEY = 'transactions';
  private static readonly AUDIT_LOG_KEY = 'audit_log';
  private static readonly BACKUP_KEY = 'data_backup';
  
  /**
   * Enregistrer une entrée dans le journal d'audit
   */
  static logAction(action: string, user: string, status: string, details: string): AuditLogEntry {
    const auditEntries = this.getAuditLog();
    
    const newEntry: AuditLogEntry = {
      id: `${Date.now()}`,
      action,
      user,
      date: new Date().toISOString(),
      status,
      details
    };
    
    auditEntries.unshift(newEntry);
    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(auditEntries));
    
    return newEntry;
  }
  
  /**
   * Récupérer le journal d'audit complet
   */
  static getAuditLog(): AuditLogEntry[] {
    try {
      const storedLog = localStorage.getItem(this.AUDIT_LOG_KEY);
      return storedLog ? JSON.parse(storedLog) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération du journal d'audit:", error);
      return [];
    }
  }
  
  /**
   * Créer une sauvegarde complète des données
   */
  static createBackup(user: User | null): boolean {
    try {
      const transactions = localStorage.getItem(this.TRANSACTIONS_KEY);
      const auditLog = localStorage.getItem(this.AUDIT_LOG_KEY);
      
      const backup = {
        timestamp: new Date().toISOString(),
        createdBy: user ? user.name : 'Système',
        transactions: transactions ? JSON.parse(transactions) : [],
        auditLog: auditLog ? JSON.parse(auditLog) : []
      };
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      
      this.logAction(
        'Création de sauvegarde',
        user ? user.name : 'Système',
        'Succès',
        `Sauvegarde complète des données créée le ${new Date().toLocaleString()}`
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la création de la sauvegarde:", error);
      return false;
    }
  }
  
  /**
   * Récupérer la dernière sauvegarde
   */
  static getLastBackup() {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de la sauvegarde:", error);
      return null;
    }
  }
  
  /**
   * Restaurer depuis la sauvegarde
   */
  static restoreFromBackup(user: User | null): boolean {
    try {
      const backupData = this.getLastBackup();
      
      if (!backupData) {
        return false;
      }
      
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(backupData.transactions));
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(backupData.auditLog));
      
      // Recalculer les statistiques
      TransactionManager.calculateStatsFromTransactions(backupData.transactions);
      
      this.logAction(
        'Restauration depuis sauvegarde',
        user ? user.name : 'Système',
        'Succès',
        `Données restaurées depuis la sauvegarde du ${new Date(backupData.timestamp).toLocaleString()}`
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la restauration de la sauvegarde:", error);
      return false;
    }
  }
  
  /**
   * Réinitialiser toutes les données (sauf les logs de sécurité critiques)
   */
  static resetAllData(user: User | null): boolean {
    try {
      // Créer une sauvegarde avant la réinitialisation
      this.createBackup(user);
      
      // Conserver certains logs de sécurité critiques
      const auditLog = this.getAuditLog();
      const securityLogs = auditLog.filter(entry => 
        entry.action.includes('Connexion') || 
        entry.action.includes('Échec de connexion') || 
        entry.action.includes('Reset')
      );
      
      // Supprimer les transactions
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify([]));
      
      // Conserver uniquement les logs de sécurité
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(securityLogs));
      
      // Réinitialiser les statistiques
      TransactionManager.resetStats();
      
      // Enregistrer l'action dans les logs
      this.logAction(
        'Réinitialisation complète',
        user ? user.name : 'Système',
        'Succès',
        `Toutes les données ont été réinitialisées par ${user ? user.name : 'le système'}`
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error);
      
      // Log de l'échec
      this.logAction(
        'Réinitialisation complète',
        user ? user.name : 'Système',
        'Échec',
        `Erreur lors de la réinitialisation: ${error}`
      );
      
      return false;
    }
  }
  
  /**
   * Supprimer une transaction spécifique
   */
  static deleteTransaction(transactionId: string, user: User | null): boolean {
    try {
      const transactions = TransactionManager.getAllTransactions();
      const transactionToDelete = transactions.find(tx => tx.id === transactionId);
      
      if (!transactionToDelete) {
        return false;
      }
      
      // Retirer la transaction
      const updatedTransactions = transactions.filter(tx => tx.id !== transactionId);
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
      
      // Recalculer les statistiques
      TransactionManager.calculateStatsFromTransactions(updatedTransactions);
      
      // Log de l'action
      this.logAction(
        'Suppression de transaction',
        user ? user.name : 'Système',
        'Succès',
        `Transaction ${transactionId} supprimée par ${user ? user.name : 'le système'}`
      );
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
      
      // Log de l'échec
      this.logAction(
        'Suppression de transaction',
        user ? user.name : 'Système',
        'Échec',
        `Erreur lors de la suppression de la transaction ${transactionId}: ${error}`
      );
      
      return false;
    }
  }
}
