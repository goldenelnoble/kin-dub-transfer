
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({ onRefresh, onLogout, isRefreshing }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div className="flex items-center gap-4">
        <img src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" className="h-12" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Tableau de bord</h1>
          <p className="text-[#43A047]">
            Vue d'ensemble des transactions et statistiques - Synchronisé en temps réel
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onRefresh} 
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
        <CreateTransactionButton />
        <Button 
          onClick={onLogout}
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
