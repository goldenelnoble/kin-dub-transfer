
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";

interface TransactionListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export function TransactionListHeader({ filteredCount, totalCount }: TransactionListHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Toutes les Transactions
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-1">
            Gestion complète des transactions avec filtres avancés
          </CardDescription>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 text-sm">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span className="font-medium text-gray-900">
          {filteredCount} transaction{filteredCount !== 1 ? 's' : ''} trouvée{filteredCount !== 1 ? 's' : ''}
        </span>
        {filteredCount !== totalCount && (
          <span className="text-gray-500">
            sur {totalCount} au total
          </span>
        )}
      </div>
    </CardHeader>
  );
}
