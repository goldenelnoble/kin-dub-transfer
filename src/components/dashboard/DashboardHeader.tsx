
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from "lucide-react";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";
import { HomeButton } from "@/components/ui/home-button";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({ onRefresh, onLogout, isRefreshing }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 px-8 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-golden-200/50">
          <img 
            src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
            alt="Golden El Nobles Cargo Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-golden-600 to-golden-500 bg-clip-text text-transparent font-playfair">
            Tableau de bord
          </h1>
          <p className="text-emerald-600 font-inter">
            Vue d'ensemble des transactions et statistiques - Synchronisé en temps réel
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <HomeButton variant="ghost" />
        <Button 
          onClick={onRefresh} 
          variant="outline"
          disabled={isRefreshing}
          className="border-golden-200 hover:bg-golden-50"
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
