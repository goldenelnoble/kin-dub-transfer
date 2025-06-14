
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut, Plus } from "lucide-react";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({ onRefresh, onLogout, isRefreshing }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-noble-800 mb-2">
          Tableau de bord
        </h2>
        <p className="text-noble-600 font-inter">
          Vue d'ensemble des transactions et statistiques
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={onRefresh} 
          variant="outline"
          disabled={isRefreshing}
          className="border-noble-300 text-noble-700 hover:bg-noble-50 rounded-xl"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
        
        <Button 
          onClick={() => navigate("/transactions/new")}
          className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Transaction
        </Button>
        
        <Button 
          onClick={onLogout}
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
