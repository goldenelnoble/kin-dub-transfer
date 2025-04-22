
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currency, PaymentMethod, TransactionDirection, TransactionStatus } from "@/types";

interface TransactionFiltersProps {
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
}

export const TransactionFilters = ({
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
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par ID, expéditeur ou bénéficiaire..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value={TransactionStatus.PENDING}>En attente</SelectItem>
            <SelectItem value={TransactionStatus.VALIDATED}>Validée</SelectItem>
            <SelectItem value={TransactionStatus.COMPLETED}>Complétée</SelectItem>
            <SelectItem value={TransactionStatus.CANCELLED}>Annulée</SelectItem>
          </SelectContent>
        </Select>

        <Select value={directionFilter} onValueChange={onDirectionChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les directions</SelectItem>
            <SelectItem value={TransactionDirection.KINSHASA_TO_DUBAI}>Kinshasa → Dubaï</SelectItem>
            <SelectItem value={TransactionDirection.DUBAI_TO_KINSHASA}>Dubaï → Kinshasa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currencyFilter} onValueChange={onCurrencyChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Devise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les devises</SelectItem>
            <SelectItem value={Currency.USD}>USD</SelectItem>
            <SelectItem value={Currency.EUR}>EUR</SelectItem>
            <SelectItem value={Currency.AED}>AED</SelectItem>
            <SelectItem value={Currency.CDF}>CDF</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentMethodFilter} onValueChange={onPaymentMethodChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les moyens</SelectItem>
            <SelectItem value={PaymentMethod.AGENCY}>Agence</SelectItem>
            <SelectItem value={PaymentMethod.MOBILE_MONEY}>Mobile Money</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[150px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute période</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
