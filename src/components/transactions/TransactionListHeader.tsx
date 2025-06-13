
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, BarChart3, Database } from "lucide-react";

interface TransactionListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export function TransactionListHeader({ filteredCount, totalCount }: TransactionListHeaderProps) {
  return (
    <CardHeader className="pb-6 bg-gradient-to-r from-[#F97316]/5 to-[#F2C94C]/5 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 bg-gradient-to-r from-[#F97316] to-[#F2C94C] rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Transactions
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-1">
              Gestion complète et suivi en temps réel
            </CardDescription>
          </div>
        </div>

        {/* Indicateurs de performance */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-1 text-[#F97316] mb-1">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Base</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{totalCount}</div>
          </div>
          
          <div className="h-8 w-px bg-gray-300"></div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1 text-green-600 mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrées</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{filteredCount}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-gray-900 text-base">
            {filteredCount} transaction{filteredCount !== 1 ? 's' : ''} trouvée{filteredCount !== 1 ? 's' : ''}
          </span>
          {filteredCount !== totalCount && (
            <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-sm">
              sur {totalCount} au total
            </span>
          )}
        </div>

        {/* Indicateur de statut */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Données à jour</span>
        </div>
      </div>
    </CardHeader>
  );
}
