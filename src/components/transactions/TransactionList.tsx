
import { Card } from "@/components/ui/card";
import { UserRole } from "@/types";
import { TransactionListHeader } from "./TransactionListHeader";
import { TransactionListContent } from "./TransactionListContent";
import { TransactionListStats } from "./TransactionListStats";
import { TransactionListLoading } from "./TransactionListLoading";
import { useTransactionList } from "./hooks/useTransactionList";

export function TransactionList() {
  const {
    loading,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    startIndex,
    endIndex,
    transactions,
    currentPage,
    searchQuery,
    statusFilter,
    directionFilter,
    currencyFilter,
    paymentMethodFilter,
    dateFilter,
    user,
    setCurrentPage,
    setSearchQuery,
    setStatusFilter,
    setDirectionFilter,
    setCurrencyFilter,
    setPaymentMethodFilter,
    setDateFilter,
    handleDeleteTransaction,
    handleEditTransaction,
    handleUpdateStatus
  } = useTransactionList();

  if (loading) {
    return <TransactionListLoading />;
  }

  return (
    <Card>
      <TransactionListHeader 
        filteredCount={filteredTransactions.length}
        totalCount={transactions.length}
      />
      
      <TransactionListStats 
        transactions={filteredTransactions}
        currencyFilter={currencyFilter}
      />
      
      <TransactionListContent
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex}
        endIndex={endIndex}
        filteredCount={filteredTransactions.length}
        transactions={paginatedTransactions}
        onUpdateStatus={handleUpdateStatus}
        canEdit={!!user && user.role === UserRole.ADMIN}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </Card>
  );
}
