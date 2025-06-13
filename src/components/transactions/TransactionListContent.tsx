
import { CardContent } from "@/components/ui/card";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { TransactionPagination } from "./TransactionPagination";
import { Transaction, UserRole } from "@/types";

interface TransactionListContentProps {
  // Filter props
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  directionFilter: string;
  onDirectionChange: (value: string) => void;
  currencyFilter: string;
  onCurrencyChange: (value: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  
  // Pagination props
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  filteredCount: number;
  
  // Transaction props
  transactions: Transaction[];
  onUpdateStatus: (id: string, status: any) => void;
  canEdit: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionListContent({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  directionFilter,
  onDirectionChange,
  currencyFilter,
  onCurrencyChange,
  paymentMethodFilter,
  onPaymentMethodChange,
  dateFilter,
  onDateFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  filteredCount,
  transactions,
  onUpdateStatus,
  canEdit,
  onEdit,
  onDelete
}: TransactionListContentProps) {
  return (
    <CardContent>
      <div className="space-y-6">
        <TransactionFilters 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          directionFilter={directionFilter}
          onDirectionChange={onDirectionChange}
          currencyFilter={currencyFilter}
          onCurrencyChange={onCurrencyChange}
          paymentMethodFilter={paymentMethodFilter}
          onPaymentMethodChange={onPaymentMethodChange}
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
        />
        
        <div className="text-sm text-muted-foreground">
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredCount)} sur {filteredCount} résultat(s)
        </div>
        
        <TransactionTable 
          transactions={transactions}
          onUpdateStatus={onUpdateStatus}
          canEdit={canEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </CardContent>
  );
}
