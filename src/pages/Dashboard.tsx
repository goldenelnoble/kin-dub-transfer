
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { loadDashboardData } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success("Données actualisées");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tableau de Bord
            </h1>
            <p className="text-gray-600 mt-2">
              Gestion des transferts d'argent et transactions financières
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
        
        <DashboardHeader 
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          isRefreshing={isRefreshing}
        />
        <DashboardContent />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
