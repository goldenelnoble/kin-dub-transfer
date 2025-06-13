
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Currency, PaymentMethod, TransactionDirection, TransactionStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const activeFilters = [
    { key: 'status', value: statusFilter, label: statusFilter !== 'all' ? `Status: ${statusFilter}` : null },
    { key: 'direction', value: directionFilter, label: directionFilter !== 'all' ? `Direction: ${directionFilter}` : null },
    { key: 'currency', value: currencyFilter, label: currencyFilter !== 'all' ? `Devise: ${currencyFilter}` : null },
    { key: 'payment', value: paymentMethodFilter, label: paymentMethodFilter !== 'all' ? `Paiement: ${paymentMethodFilter}` : null },
    { key: 'date', value: dateFilter, label: dateFilter !== 'all' ? `Période: ${dateFilter}` : null },
  ].filter(filter => filter.label);

  const clearAllFilters = () => {
    onStatusChange('all');
    onDirectionChange('all');
    onCurrencyChange('all');
    onPaymentMethodChange('all');
    onDateFilterChange('all');
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par ID, expéditeur, bénéficiaire..."
          className="pl-10 pr-4 h-12 text-base border-2 border-gray-200 focus:border-[#F97316] rounded-xl shadow-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Filtres avancés */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px] h-10 border-gray-300 focus:border-[#F97316] rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-[#F97316]" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <SelectItem value="all" className="rounded-md">Tous les statuts</SelectItem>
              <SelectItem value={TransactionStatus.PENDING} className="rounded-md">En attente</SelectItem>
              <SelectItem value={TransactionStatus.VALIDATED} className="rounded-md">Validée</SelectItem>
              <SelectItem value={TransactionStatus.COMPLETED} className="rounded-md">Complétée</SelectItem>
              <SelectItem value={TransactionStatus.CANCELLED} className="rounded-md">Annulée</SelectItem>
            </SelectContent>
          </Select>

          <Select value={directionFilter} onValueChange={onDirectionChange}>
            <SelectTrigger className="w-[180px] h-10 border-gray-300 focus:border-[#F97316] rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-[#F97316]" />
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <SelectItem value="all" className="rounded-md">Toutes les directions</SelectItem>
              <SelectItem value={TransactionDirection.KINSHASA_TO_DUBAI} className="rounded-md">Kinshasa → Dubaï</SelectItem>
              <SelectItem value={TransactionDirection.DUBAI_TO_KINSHASA} className="rounded-md">Dubaï → Kinshasa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currencyFilter} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-[140px] h-10 border-gray-300 focus:border-[#F97316] rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-[#F97316]" />
              <SelectValue placeholder="Devise" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <SelectItem value="all" className="rounded-md">Toutes les devises</SelectItem>
              <SelectItem value={Currency.USD} className="rounded-md">USD</SelectItem>
              <SelectItem value={Currency.EUR} className="rounded-md">EUR</SelectItem>
              <SelectItem value={Currency.AED} className="rounded-md">AED</SelectItem>
              <SelectItem value={Currency.CDF} className="rounded-md">CDF</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentMethodFilter} onValueChange={onPaymentMethodChange}>
            <SelectTrigger className="w-[160px] h-10 border-gray-300 focus:border-[#F97316] rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-[#F97316]" />
              <SelectValue placeholder="Paiement" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <SelectItem value="all" className="rounded-md">Tous les moyens</SelectItem>
              <SelectItem value={PaymentMethod.AGENCY} className="rounded-md">Agence</SelectItem>
              <SelectItem value={PaymentMethod.MOBILE_MONEY} className="rounded-md">Mobile Money</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-[150px] h-10 border-gray-300 focus:border-[#F97316] rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-[#F97316]" />
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-gray-200">
              <SelectItem value="all" className="rounded-md">Toute période</SelectItem>
              <SelectItem value="today" className="rounded-md">Aujourd'hui</SelectItem>
              <SelectItem value="week" className="rounded-md">Cette semaine</SelectItem>
              <SelectItem value="month" className="rounded-md">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 hover:bg-[#F97316]/20 px-3 py-1"
              >
                {filter.label}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 ml-2"
            >
              <X className="h-4 w-4 mr-1" />
              Tout effacer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
