
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

export interface DatabaseSender {
  id: string;
  name: string;
  phone: string;
  id_number: string;
  id_type: string;
  created_at: string;
}

export interface DatabaseRecipient {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

export class TransactionService {
  // Create a new transaction with sender and recipient
  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // First, create the sender - use direct table access with proper typing
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

      if (senderError) throw senderError;
      const senderId = senderData.id;

      // Then, create the recipient
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .insert({
          name: transaction.recipient.name,
          phone: transaction.recipient.phone
        })
        .select()
        .single();

      if (recipientError) throw recipientError;
      const recipientId = recipientData.id;

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
          sender_id: senderId,
          recipient_id: recipientId,
          fees: transaction.commissionAmount,
          total: transaction.amount + transaction.commissionAmount,
          txn_id: `TXN${Date.now()}`
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Get the full transaction data with sender and recipient
      return await this.getTransactionById(transactionData.id);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Get all transactions
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      const enrichedTransactions = await Promise.all(
        (transactions || []).map(async (tx) => {
          // Get sender data with proper error handling
          const { data: senderData, error: senderError } = await supabase
            .from('senders')
            .select('*')
            .eq('id', tx.sender_id)
            .single();

          if (senderError) {
            console.warn('Failed to fetch sender:', senderError);
          }

          // Get recipient data with proper error handling
          const { data: recipientData, error: recipientError } = await supabase
            .from('recipients')
            .select('*')
            .eq('id', tx.recipient_id)
            .single();

          if (recipientError) {
            console.warn('Failed to fetch recipient:', recipientError);
          }

          return this.mapDatabaseTransactionToTransaction({
            ...tx,
            senders: senderData,
            recipients: recipientData
          });
        })
      );

      return enrichedTransactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get transaction by ID
  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (transactionError) throw transactionError;

      if (!transaction) return null;

      // Get sender data with proper error handling
      const { data: senderData, error: senderError } = await supabase
        .from('senders')
        .select('*')
        .eq('id', transaction.sender_id)
        .single();

      if (senderError) {
        console.warn('Failed to fetch sender:', senderError);
      }

      // Get recipient data with proper error handling
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .select('*')
        .eq('id', transaction.recipient_id)
        .single();

      if (recipientError) {
        console.warn('Failed to fetch recipient:', recipientError);
      }

      return this.mapDatabaseTransactionToTransaction({
        ...transaction,
        senders: senderData,
        recipients: recipientData
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  // Update transaction status
  static async updateTransactionStatus(
    id: string, 
    status: TransactionStatus, 
    validatedBy?: string
  ): Promise<Transaction> {
    try {
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

      if (error) throw error;

      // Return the updated transaction with full data
      return await this.getTransactionById(id) as Transaction;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  // Delete transaction
  static async deleteTransaction(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Map database transaction to application transaction
  private static mapDatabaseTransactionToTransaction(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.id,
      direction: dbTransaction.direction || TransactionDirection.KINSHASA_TO_DUBAI,
      amount: dbTransaction.amount || 0,
      receivingAmount: dbTransaction.receiving_amount || dbTransaction.amount || 0,
      currency: dbTransaction.currency || Currency.USD,
      commissionPercentage: dbTransaction.commission_percentage || 0,
      commissionAmount: dbTransaction.commission_amount || dbTransaction.fees || 0,
      paymentMethod: dbTransaction.payment_method || PaymentMethod.AGENCY,
      mobileMoneyNetwork: dbTransaction.mobile_money_network,
      status: dbTransaction.status || TransactionStatus.PENDING,
      sender: {
        name: dbTransaction.senders?.name || 'Unknown Sender',
        phone: dbTransaction.senders?.phone || '',
        idNumber: dbTransaction.senders?.id_number || '',
        idType: dbTransaction.senders?.id_type || 'passport'
      },
      recipient: {
        name: dbTransaction.recipients?.name || 'Unknown Recipient',
        phone: dbTransaction.recipients?.phone || ''
      },
      notes: dbTransaction.notes,
      createdBy: dbTransaction.created_by || 'System',
      createdAt: new Date(dbTransaction.created_at),
      updatedAt: new Date(dbTransaction.updated_at),
      validatedBy: dbTransaction.validated_by,
      validatedAt: dbTransaction.validated_at ? new Date(dbTransaction.validated_at) : undefined
    };
  }

  // Subscribe to real-time changes
  static subscribeToTransactionChanges(callback: (transaction: Transaction) => void) {
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
          if (payload.new && (payload.new as any).id) {
            const transaction = await this.getTransactionById((payload.new as any).id);
            if (transaction) {
              callback(transaction);
            }
          }
        }
      )
      .subscribe();
  }
}
