
// Re-export UserRole from AuthContext to maintain compatibility
export { UserRole } from "@/context/AuthContext";
export type { User } from "@/context/AuthContext";

// Transaction direction
export enum TransactionDirection {
  KINSHASA_TO_DUBAI = "kinshasa_to_dubai",
  DUBAI_TO_KINSHASA = "dubai_to_kinshasa"
}

// Transaction status
export enum TransactionStatus {
  PENDING = "pending",
  VALIDATED = "validated",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Payment method
export enum PaymentMethod {
  AGENCY = "agency",
  MOBILE_MONEY = "mobile_money"
}

// Currency types
export enum Currency {
  USD = "USD",
  EUR = "EUR",
  AED = "AED", // Emirati Dirham
  CDF = "CDF"  // Congolese Franc
}

// Mobile money network
export interface MobileMoneyNetwork {
  id: string;
  name: string;
  country: string;
  active: boolean;
}

// Transaction interface
export interface Transaction {
  id: string;
  direction: TransactionDirection;
  amount: number;
  receivingAmount: number;
  currency: Currency;
  commissionPercentage: number;
  commissionAmount: number;
  paymentMethod: PaymentMethod;
  mobileMoneyNetwork?: string;
  status: TransactionStatus;
  sender: {
    name: string;
    phone: string;
    idNumber: string;
    idType: string;
  };
  recipient: {
    name: string;
    phone: string;
    idNumber?: string;
    idType?: string;
  };
  notes?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

// Dashboard summary stats
export interface DashboardStats {
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  cancelledTransactions: number;
  totalAmount: number;
  totalCommissions: number;
}
