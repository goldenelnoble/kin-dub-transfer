
import { Transaction, TransactionStatus } from "@/types";

export const filterTransactions = (
  transactions: Transaction[],
  searchQuery: string,
  statusFilter: string,
  directionFilter: string,
  currencyFilter: string,
  paymentMethodFilter: string,
  dateFilter: string
) => {
  return transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesDirection = directionFilter === "all" || transaction.direction === directionFilter;
    const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
    
    let matchesDate = true;
    const today = new Date();
    const txDate = new Date(transaction.createdAt);
    
    switch (dateFilter) {
      case "today":
        matchesDate = txDate.toDateString() === today.toDateString();
        break;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = txDate >= weekAgo;
        break;
      case "month":
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        matchesDate = txDate >= monthAgo;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesStatus && matchesDirection && matchesCurrency && 
           matchesPaymentMethod && matchesDate;
  });
};
