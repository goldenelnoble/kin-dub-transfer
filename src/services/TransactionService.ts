
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

      if (senderError) throw senderError;

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
          recipient_id: recipientData.id
        })
        .select(`
          *,
          senders(*),
          recipients(*)
        `)
        .single();

      if (transactionError) throw transactionError;

      return this.mapDatabaseTransactionToTransaction(transactionData);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Get all transactions
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          senders(*),
          recipients(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(this.mapDatabaseTransactionToTransaction) || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get transaction by ID
  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          senders(*),
          recipients(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data ? this.mapDatabaseTransactionToTransaction(data) : null;
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
        .select(`
          *,
          senders(*),
          recipients(*)
        `)
        .single();

      if (error) throw error;

      return this.mapDatabaseTransactionToTransaction(data);
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
      direction: dbTransaction.direction,
      amount: dbTransaction.amount,
      receivingAmount: dbTransaction.receiving_amount,
      currency: dbTransaction.currency,
      commissionPercentage: dbTransaction.commission_percentage,
      commissionAmount: dbTransaction.commission_amount,
      paymentMethod: dbTransaction.payment_method,
      mobileMoneyNetwork: dbTransaction.mobile_money_network,
      status: dbTransaction.status,
      sender: {
        name: dbTransaction.senders.name,
        phone: dbTransaction.senders.phone,
        idNumber: dbTransaction.senders.id_number,
        idType: dbTransaction.senders.id_type
      },
      recipient: {
        name: dbTransaction.recipients.name,
        phone: dbTransaction.recipients.phone
      },
      notes: dbTransaction.notes,
      createdBy: dbTransaction.created_by,
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
          if (payload.new && payload.new.id) {
            const transaction = await this.getTransactionById(payload.new.id);
            if (transaction) {
              callback(transaction);
            }
          }
        }
      )
      .subscribe();
  }
}
