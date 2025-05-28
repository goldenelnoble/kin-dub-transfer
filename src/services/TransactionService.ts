
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionStatus, TransactionDirection, PaymentMethod, Currency } from "@/types";

export interface DatabaseTransaction {
  id: string;
  amount: number;
  receiving_amount: number;
  currency: Currency;
  commission_percentage: number;
  commission_amount: number;
  payment_method: PaymentMethod;
  mobile_money_network?: string;
  status: TransactionStatus;
  direction: TransactionDirection;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  validated_by?: string;
  validated_at?: string;
  sender_id: string;
  recipient_id: string;
}

export class TransactionService {
  // Create a new transaction with sender and recipient
  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('Creating transaction:', transaction);
      
      // First, create the sender
      const { data: senderData, error: senderError } = await supabase
        .from('senders')
        .insert({
          name: transaction.sender.name,
          phone: transaction.sender.phone,
          id_number: transaction.sender.idNumber,
          id_type: transaction.sender.idType
        })
        .select()
        .single();

      if (senderError) {
        console.error('Error creating sender:', senderError);
        throw senderError;
      }
      
      console.log('Sender created:', senderData);

      // Then, create the recipient
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .insert({
          name: transaction.recipient.name,
          phone: transaction.recipient.phone
        })
        .select()
        .single();

      if (recipientError) {
        console.error('Error creating recipient:', recipientError);
        throw recipientError;
      }
      
      console.log('Recipient created:', recipientData);

      // Finally, create the transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          amount: transaction.amount,
          receiving_amount: transaction.receivingAmount,
          currency: transaction.currency,
          commission_percentage: transaction.commissionPercentage,
          commission_amount: transaction.commissionAmount,
          payment_method: transaction.paymentMethod,
          mobile_money_network: transaction.mobileMoneyNetwork,
          status: transaction.status,
          direction: transaction.direction,
          notes: transaction.notes,
          created_by: transaction.createdBy,
          sender_id: senderData.id,
          recipient_id: recipientData.id,
          fees: transaction.commissionAmount,
          total: transaction.amount + transaction.commissionAmount,
          txn_id: `TXN${Date.now()}`
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        throw transactionError;
      }

      console.log('Transaction created:', transactionData);

      // Return the complete transaction with sender and recipient data
      return this.mapDatabaseTransactionToTransaction({
        ...transactionData,
        senders: senderData,
        recipients: recipientData
      });
    } catch (error) {
      console.error('Error in createTransaction:', error);
      throw error;
    }
  }

  // Get all transactions with proper error handling
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      console.log('Fetching all transactions...');
      
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
      }

      console.log(`Found ${transactions?.length || 0} transactions`);

      if (!transactions || transactions.length === 0) {
        return [];
      }

      const enrichedTransactions = await Promise.all(
        transactions.map(async (tx) => {
          try {
            // Get sender data
            const { data: senderData, error: senderError } = await supabase
              .from('senders')
              .select('*')
              .eq('id', tx.sender_id)
              .single();

            if (senderError) {
              console.warn(`Failed to fetch sender ${tx.sender_id}:`, senderError);
            }

            // Get recipient data
            const { data: recipientData, error: recipientError } = await supabase
              .from('recipients')
              .select('*')
              .eq('id', tx.recipient_id)
              .single();

            if (recipientError) {
              console.warn(`Failed to fetch recipient ${tx.recipient_id}:`, recipientError);
            }

            return this.mapDatabaseTransactionToTransaction({
              ...tx,
              senders: senderData,
              recipients: recipientData
            });
          } catch (error) {
            console.error(`Error processing transaction ${tx.id}:`, error);
            // Return a basic transaction if there's an error
            return this.mapDatabaseTransactionToTransaction(tx);
          }
        })
      );

      console.log('Successfully enriched all transactions');
      return enrichedTransactions;
    } catch (error) {
      console.error('Error in getAllTransactions:', error);
      throw error;
    }
  }

  // Get transaction by ID with proper error handling
  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      console.log(`Fetching transaction ${id}...`);
      
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (transactionError) {
        console.error(`Error fetching transaction ${id}:`, transactionError);
        throw transactionError;
      }

      if (!transaction) {
        console.log(`Transaction ${id} not found`);
        return null;
      }

      // Get sender data
      const { data: senderData, error: senderError } = await supabase
        .from('senders')
        .select('*')
        .eq('id', transaction.sender_id)
        .single();

      if (senderError) {
        console.warn(`Failed to fetch sender for transaction ${id}:`, senderError);
      }

      // Get recipient data
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .select('*')
        .eq('id', transaction.recipient_id)
        .single();

      if (recipientError) {
        console.warn(`Failed to fetch recipient for transaction ${id}:`, recipientError);
      }

      const result = this.mapDatabaseTransactionToTransaction({
        ...transaction,
        senders: senderData,
        recipients: recipientData
      });

      console.log(`Successfully fetched transaction ${id}`);
      return result;
    } catch (error) {
      console.error(`Error in getTransactionById(${id}):`, error);
      throw error;
    }
  }

  // Update transaction status with proper validation
  static async updateTransactionStatus(
    id: string, 
    status: TransactionStatus, 
    validatedBy?: string
  ): Promise<Transaction> {
    try {
      console.log(`Updating transaction ${id} status to ${status}`);
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (validatedBy && (status === TransactionStatus.VALIDATED || status === TransactionStatus.COMPLETED)) {
        updateData.validated_by = validatedBy;
        updateData.validated_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating transaction ${id}:`, error);
        throw error;
      }

      console.log(`Successfully updated transaction ${id}`);
      
      // Return the updated transaction with full data
      const updatedTransaction = await this.getTransactionById(id);
      if (!updatedTransaction) {
        throw new Error(`Failed to fetch updated transaction ${id}`);
      }
      
      return updatedTransaction;
    } catch (error) {
      console.error(`Error in updateTransactionStatus(${id}):`, error);
      throw error;
    }
  }

  // Delete transaction with proper cleanup
  static async deleteTransaction(id: string): Promise<void> {
    try {
      console.log(`Deleting transaction ${id}...`);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting transaction ${id}:`, error);
        throw error;
      }

      console.log(`Successfully deleted transaction ${id}`);
    } catch (error) {
      console.error(`Error in deleteTransaction(${id}):`, error);
      throw error;
    }
  }

  // Map database transaction to application transaction with better defaults
  private static mapDatabaseTransactionToTransaction(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.id,
      direction: dbTransaction.direction || TransactionDirection.KINSHASA_TO_DUBAI,
      amount: Number(dbTransaction.amount) || 0,
      receivingAmount: Number(dbTransaction.receiving_amount) || Number(dbTransaction.amount) || 0,
      currency: dbTransaction.currency || Currency.USD,
      commissionPercentage: Number(dbTransaction.commission_percentage) || 0,
      commissionAmount: Number(dbTransaction.commission_amount) || Number(dbTransaction.fees) || 0,
      paymentMethod: dbTransaction.payment_method || PaymentMethod.AGENCY,
      mobileMoneyNetwork: dbTransaction.mobile_money_network,
      status: dbTransaction.status || TransactionStatus.PENDING,
      sender: {
        name: dbTransaction.senders?.name || 'Expéditeur inconnu',
        phone: dbTransaction.senders?.phone || '',
        idNumber: dbTransaction.senders?.id_number || '',
        idType: dbTransaction.senders?.id_type || 'passport'
      },
      recipient: {
        name: dbTransaction.recipients?.name || 'Bénéficiaire inconnu',
        phone: dbTransaction.recipients?.phone || ''
      },
      notes: dbTransaction.notes,
      createdBy: dbTransaction.created_by || 'Système',
      createdAt: new Date(dbTransaction.created_at),
      updatedAt: new Date(dbTransaction.updated_at),
      validatedBy: dbTransaction.validated_by,
      validatedAt: dbTransaction.validated_at ? new Date(dbTransaction.validated_at) : undefined
    };
  }

  // Subscribe to real-time changes with proper error handling
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
              const transaction = await this.getTransactionById((payload.new as any).id);
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

  // Reset all data (for admin use)
  static async resetAllData(): Promise<void> {
    try {
      console.log('Resetting all transaction data...');
      
      // Delete all transactions first (due to foreign key constraints)
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (transactionsError) {
        console.error('Error deleting transactions:', transactionsError);
        throw transactionsError;
      }

      // Delete all recipients
      const { error: recipientsError } = await supabase
        .from('recipients')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (recipientsError) {
        console.error('Error deleting recipients:', recipientsError);
        throw recipientsError;
      }

      // Delete all senders
      const { error: sendersError } = await supabase
        .from('senders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (sendersError) {
        console.error('Error deleting senders:', sendersError);
        throw sendersError;
      }

      console.log('Successfully reset all transaction data');
    } catch (error) {
      console.error('Error in resetAllData:', error);
      throw error;
    }
  }
}
