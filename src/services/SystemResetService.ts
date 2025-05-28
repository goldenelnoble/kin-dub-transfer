
import { TransactionService } from "./TransactionService";
import { toast } from "@/components/ui/sonner";

export interface ResetOptions {
  resetTransactions?: boolean;
  resetUsers?: boolean;
  resetSettings?: boolean;
}

export class SystemResetService {
  
  /**
   * Réinitialise complètement le système
   */
  static async resetSystem(options: ResetOptions = { resetTransactions: true }): Promise<boolean> {
    try {
      console.log('SystemResetService: Starting system reset with options:', options);
      
      if (options.resetTransactions) {
        await TransactionService.resetAllData();
        console.log('SystemResetService: Transaction data reset completed');
      }
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        console.log('SystemResetService: Local storage cleared');
      }
      
      toast.success("Système réinitialisé avec succès !");
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('SystemResetService: Error during system reset:', error);
      toast.error("Erreur lors de la réinitialisation du système");
      return false;
    }
  }
  
  /**
   * Vérifie l'état du système
   */
  static async getSystemStatus() {
    try {
      const transactions = await TransactionService.getAllTransactions();
      
      return {
        transactionCount: transactions.length,
        lastReset: localStorage.getItem('lastSystemReset'),
        systemReady: true
      };
    } catch (error) {
      console.error('SystemResetService: Error getting system status:', error);
      return {
        transactionCount: 0,
        lastReset: null,
        systemReady: false
      };
    }
  }
}
