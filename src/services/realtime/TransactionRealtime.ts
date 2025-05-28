
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { TransactionService } from "../TransactionService";

export class TransactionRealtime {
  static subscribeToTransactionChanges(callback: (transaction: Transaction) => void) {
    console.log('Setting up real-time subscription...');
    
    return supabase
      .channel('transactions-changes')
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
            
            if (payload.new && (payload.new as any).id) {
              const transaction = await TransactionService.getTransactionById((payload.new as any).id);
              if (transaction) {
                console.log('Broadcasting updated transaction:', transaction.id);
                callback(transaction);
              }
            }
          } catch (error) {
            console.error('Error in real-time subscription:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  }
}
