import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus } from "@/types";
import { toast } from "@/components/ui/sonner";
import { TransactionStats } from "./TransactionStats";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { filterTransactions } from "./utils/transactionUtils";

// Sample transaction data (move to local state)
const getInitialTransactions = (): Transaction[] => [
  {
    id: "TXN123456",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 5000,
    receivingAmount: 5000,
    currency: Currency.USD,
    commissionPercentage: 3.5,
    commissionAmount: 175,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Jean Lumumba",
      phone: "+243 123456789",
      idNumber: "KIN12345",
      idType: "Passport"
    },
    recipient: {
      name: "Mohammed Ali",
      phone: "+971 501234567",
      idNumber: "UAE45678",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 15, 10, 30),
    updatedAt: new Date(2023, 3, 15, 12, 30),
    createdBy: "Operator User"
  },
  {
    id: "TXN123457",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 3000,
    receivingAmount: 3000,
    currency: Currency.USD,
    commissionPercentage: 3.0,
    commissionAmount: 90,
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    mobileMoneyNetwork: "M-Pesa",
    status: TransactionStatus.PENDING,
    sender: {
      name: "Abdullah Mohammed",
      phone: "+971 501234567",
      idNumber: "UAE78901",
      idType: "Passport"
    },
    recipient: {
      name: "Marie Kabila",
      phone: "+243 987654321",
      idNumber: "KIN67890",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 16, 11, 45),
    updatedAt: new Date(2023, 3, 16, 11, 45),
    createdBy: "Supervisor User"
  },
  {
    id: "TXN123458",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 2500,
    receivingAmount: 2500,
    currency: Currency.EUR,
    commissionPercentage: 3.5,
    commissionAmount: 87.5,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.CANCELLED,
    sender: {
      name: "Paul Mutombo",
      phone: "+243 234567890",
      idNumber: "KIN23456",
      idType: "Passport"
    },
    recipient: {
      name: "Rashed Ahmed",
      phone: "+971 502345678",
      idNumber: "UAE56789",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 17, 9, 15),
    updatedAt: new Date(2023, 3, 17, 10, 30),
    createdBy: "Operator User"
  },
  {
    id: "TXN123459",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 7500,
    receivingAmount: 7500,
    currency: Currency.USD,
    commissionPercentage: 3.5,
    commissionAmount: 262.5,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.VALIDATED,
    sender: {
      name: "Claude Makiese",
      phone: "+243 345678901",
      idNumber: "KIN34567",
      idType: "Passport"
    },
    recipient: {
      name: "Saeed Al Mansouri",
      phone: "+971 503456789",
      idNumber: "UAE67890",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 18, 14, 20),
    updatedAt: new Date(2023, 3, 18, 16, 45),
    createdBy: "Operator User"
  },
  {
    id: "TXN123460",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 4000,
    receivingAmount: 4000,
    currency: Currency.AED,
    commissionPercentage: 3.0,
    commissionAmount: 120,
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    mobileMoneyNetwork: "Orange Money",
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Fatima Ali",
      phone: "+971 504567890",
      idNumber: "UAE78901",
      idType: "Passport"
    },
    recipient: {
      name: "Jean-Marc Kabongo",
      phone: "+243 456789012",
      idNumber: "KIN45678",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 19, 16, 30),
    updatedAt: new Date(2023, 3, 19, 18, 45),
    createdBy: "Supervisor User"
  }
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      try {
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        const validTransactions = parsedTransactions.map((tx: any): Transaction => {
          return {
            ...tx,
            receivingAmount: tx.receivingAmount || tx.amount,
            commissionPercentage: tx.commissionPercentage || 3.5,
            paymentMethod: tx.paymentMethod || "agency",
            updatedAt: tx.updatedAt || new Date(),
            sender: {
              name: tx.sender?.name || "",
              phone: tx.sender?.phone || "",
              idNumber: tx.sender?.idNumber || "",
              idType: tx.sender?.idType || ""
            },
            recipient: {
              name: tx.recipient?.name || "",
              phone: tx.recipient?.phone || "",
              idNumber: tx.recipient?.idNumber || "",
              idType: tx.recipient?.idType || ""
            }
          };
        });
        
        setTransactions([...validTransactions, ...getInitialTransactions()]);
      } catch (error) {
        console.error("Erreur lors du parsing des transactions:", error);
        setTransactions(getInitialTransactions());
        toast.error("Erreur lors du chargement des transactions");
      }
    } else {
      setTransactions(getInitialTransactions());
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    const now = new Date();
    
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === id) {
        const updated = { 
          ...tx, 
          status: newStatus,
          updatedAt: now
        };
        
        if (newStatus === TransactionStatus.VALIDATED || newStatus === TransactionStatus.COMPLETED) {
          updated.validatedBy = "Admin User";
          updated.validatedAt = now;
        }
        
        return updated;
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    const statusMessages = {
      [TransactionStatus.VALIDATED]: "Transaction validée !",
      [TransactionStatus.COMPLETED]: "Transaction complétée !",
      [TransactionStatus.CANCELLED]: "Transaction annulée !"
    };
    
    if (statusMessages[newStatus]) {
      toast[newStatus === TransactionStatus.CANCELLED ? "error" : "success"](statusMessages[newStatus], {
        description: `La transaction ${id} a été ${newStatus === TransactionStatus.CANCELLED ? 'annulée' : 'mise à jour'}`
      });
    }
  };

  const filteredTransactions = filterTransactions(
    transactions,
    searchQuery,
    statusFilter,
    directionFilter,
    currencyFilter,
    paymentMethodFilter,
    dateFilter
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toutes les Transactions</CardTitle>
        <CardDescription>Liste complète des transactions avec filtres</CardDescription>
        <TransactionStats 
          transactions={filteredTransactions}
          currencyFilter={currencyFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TransactionFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            directionFilter={directionFilter}
            onDirectionChange={setDirectionFilter}
            currencyFilter={currencyFilter}
            onCurrencyChange={setCurrencyFilter}
            paymentMethodFilter={paymentMethodFilter}
            onPaymentMethodChange={setPaymentMethodFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
          <TransactionTable 
            transactions={filteredTransactions}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
}
