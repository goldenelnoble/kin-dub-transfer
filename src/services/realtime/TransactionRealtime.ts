
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { TransactionService } from "../TransactionService";

export class TransactionRealtime {
  private static subscription: any = null;
  private static listeners: ((transaction: Transaction) => void)[] = [];

  static subscribeToTransactionChanges(callback: (transaction: Transaction) => void) {
    console.log('Setting up real-time subscription...');
    
    // Ajouter le callback à la liste des listeners
    this.listeners.push(callback);
    
    // Si une souscription existe déjà, la réutiliser
    if (this.subscription) {
      console.log('Reusing existing subscription');
      return this.subscription;
    }
    
    this.subscription = supabase
      .channel('transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        async (payload) => {
          try {
            console.log('Real-time update received:', payload);
            
            if (payload.new && (payload.new as any).txn_id) {
              const transaction = await TransactionService.getTransactionById((payload.new as any).txn_id);
              if (transaction) {
                console.log('Broadcasting updated transaction to all listeners:', transaction.id);
                // Notifier tous les listeners
                this.listeners.forEach(listener => {
                  try {
                    listener(transaction);
                  } catch (error) {
                    console.error('Error in transaction listener:', error);
                  }
                });
              }
            }
          } catch (error) {
            console.error('Error in real-time subscription:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'CLOSED') {
          console.warn('Real-time subscription closed, will reconnect on next call');
          this.subscription = null;
        }
      });

    return this.subscription;
  }

  static unsubscribe(callback?: (transaction: Transaction) => void) {
    if (callback) {
      // Retirer un listener spécifique
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
    
    // Si plus de listeners, fermer la souscription
    if (this.listeners.length === 0 && this.subscription) {
      console.log('Closing real-time subscription - no more listeners');
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }

  static cleanup() {
    console.log('Cleaning up real-time subscription');
    this.listeners = [];
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }
}
