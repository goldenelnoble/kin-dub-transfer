
import { Transaction, TransactionStatus, TransactionDirection, PaymentMethod, Currency } from "@/types";

export class TransactionMapper {
  static mapDatabaseTransactionToTransaction(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.txn_id || dbTransaction.id, // Utiliser txn_id comme ID principal
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
}
