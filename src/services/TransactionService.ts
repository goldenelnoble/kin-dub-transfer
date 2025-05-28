
import { Transaction, TransactionStatus } from "@/types";
import { TransactionDatabase } from "./database/TransactionDatabase";
import { SenderDatabase } from "./database/SenderDatabase";
import { RecipientDatabase } from "./database/RecipientDatabase";
import { TransactionMapper } from "./utils/TransactionMapper";
import { TransactionRealtime } from "./realtime/TransactionRealtime";

export interface DatabaseTransaction {
  id: string;
  amount: number;
  receiving_amount: number;
  currency: string;
  commission_percentage: number;
  commission_amount: number;
  payment_method: string;
  mobile_money_network?: string;
  status: string;
  direction: string;
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
  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('Creating transaction:', transaction);
      
      // Create sender
      const senderData = await SenderDatabase.createSender(transaction.sender);
      console.log('Sender created:', senderData);

      // Create recipient
      const recipientData = await RecipientDatabase.createRecipient(transaction.recipient);
      console.log('Recipient created:', recipientData);

      // Create transaction
      const transactionData = await TransactionDatabase.createTransactionRecord(
        transaction, 
        senderData.id, 
        recipientData.id
      );
      console.log('Transaction created:', transactionData);

      // Return the complete transaction with sender and recipient data
      return TransactionMapper.mapDatabaseTransactionToTransaction({
        ...transactionData,
        senders: senderData,
        recipients: recipientData
      });
    } catch (error) {
      console.error('Error in createTransaction:', error);
      throw error;
    }
  }

  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await TransactionDatabase.getAllTransactions();
      console.log(`Found ${transactions?.length || 0} transactions`);

      if (!transactions || transactions.length === 0) {
        return [];
      }

      const enrichedTransactions = await Promise.all(
        transactions.map(async (tx) => {
          try {
            const senderData = await SenderDatabase.getSenderById(tx.sender_id);
            const recipientData = await RecipientDatabase.getRecipientById(tx.recipient_id);

            return TransactionMapper.mapDatabaseTransactionToTransaction({
              ...tx,
              senders: senderData,
              recipients: recipientData
            });
          } catch (error) {
            console.error(`Error processing transaction ${tx.id}:`, error);
            return TransactionMapper.mapDatabaseTransactionToTransaction(tx);
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

  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await TransactionDatabase.getTransactionById(id);
      if (!transaction) {
        console.log(`Transaction ${id} not found`);
        return null;
      }

      const senderData = await SenderDatabase.getSenderById(transaction.sender_id);
      const recipientData = await RecipientDatabase.getRecipientById(transaction.recipient_id);

      const result = TransactionMapper.mapDatabaseTransactionToTransaction({
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

  static async updateTransactionStatus(
    id: string, 
    status: TransactionStatus, 
    validatedBy?: string
  ): Promise<Transaction> {
    try {
      console.log(`Updating transaction ${id} status to ${status}`);
      
      const updateData: any = { status };

      if (validatedBy && (status === TransactionStatus.VALIDATED || status === TransactionStatus.COMPLETED)) {
        updateData.validated_by = validatedBy;
        updateData.validated_at = new Date().toISOString();
      }

      await TransactionDatabase.updateTransaction(id, updateData);
      console.log(`Successfully updated transaction ${id}`);
      
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

  static async deleteTransaction(id: string): Promise<void> {
    try {
      await TransactionDatabase.deleteTransaction(id);
      console.log(`Successfully deleted transaction ${id}`);
    } catch (error) {
      console.error(`Error in deleteTransaction(${id}):`, error);
      throw error;
    }
  }

  static subscribeToTransactionChanges(callback: (transaction: Transaction) => void) {
    return TransactionRealtime.subscribeToTransactionChanges(callback);
  }

  static async resetAllData(): Promise<void> {
    try {
      console.log('Resetting all transaction data...');
      
      await TransactionDatabase.resetAllTransactions();
      await RecipientDatabase.resetAllRecipients();
      await SenderDatabase.resetAllSenders();

      console.log('Successfully reset all transaction data');
    } catch (error) {
      console.error('Error in resetAllData:', error);
      throw error;
    }
  }
}
