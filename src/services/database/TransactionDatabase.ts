
import { supabase } from "@/integrations/supabase/client";
import { DatabaseTransaction } from "../TransactionService";

export class TransactionDatabase {
  static async createTransactionRecord(transactionData: any, senderId: string, recipientId: string) {
    console.log('Creating transaction record in database...');
    
    const { data: dbTransaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        amount: transactionData.amount,
        receiving_amount: transactionData.receivingAmount,
        currency: transactionData.currency,
        commission_percentage: transactionData.commissionPercentage,
        commission_amount: transactionData.commissionAmount,
        payment_method: transactionData.paymentMethod,
        mobile_money_network: transactionData.mobileMoneyNetwork,
        status: transactionData.status,
        direction: transactionData.direction,
        notes: transactionData.notes,
        created_by: transactionData.createdBy,
        sender_id: senderId,
        recipient_id: recipientId,
        fees: transactionData.commissionAmount,
        total: transactionData.amount + transactionData.commissionAmount,
        txn_id: `TXN${Date.now()}`
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    console.log('Transaction created successfully:', dbTransaction);
    return dbTransaction;
  }

  static async getAllTransactions() {
    console.log('Fetching all transactions...');
    
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      throw transactionsError;
    }

    return transactions || [];
  }

  static async getTransactionById(id: string) {
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

    return transaction;
  }

  static async updateTransaction(id: string, updates: any) {
    console.log(`Updating transaction ${id}...`);
    
    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }

    return data;
  }

  static async deleteTransaction(id: string) {
    console.log(`Deleting transaction ${id}...`);
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }

  static async resetAllTransactions() {
    console.log('Resetting all transaction data...');
    
    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (transactionsError) {
      console.error('Error deleting transactions:', transactionsError);
      throw transactionsError;
    }
  }
}
