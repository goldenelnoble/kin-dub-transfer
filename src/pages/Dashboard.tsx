
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Package, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { loadDashboardData } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success("Données actualisées avec succès");
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

  const quickStats = [
    {
      title: "Transactions",
      value: "247",
      change: "+12%",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Colis en Transit",
      value: "89",
      change: "+5%",
      icon: Package,
      color: "from-golden-500 to-golden-600"
    },
    {
      title: "Destinations",
      value: "12",
      change: "+2",
      icon: Globe,
      color: "from-noble-500 to-noble-600"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-golden-50/20 to-white">
        {/* Header */}
        <div className="p-8 border-b border-noble-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-golden-200/50">
                <img 
                  src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                  alt="Golden El Nobles Cargo Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-golden-600 to-golden-500 bg-clip-text text-transparent">
                  Centre de Contrôle
                </h1>
                <p className="text-noble-600 font-inter">
                  Gestion des opérations cargo et transferts financiers
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="border-noble-300 text-noble-700 hover:bg-noble-50 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour Accueil
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-noble-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-noble-800 font-playfair">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard Components */}
          <div className="space-y-6">
            <DashboardHeader 
              onRefresh={handleRefresh}
              onLogout={handleLogout}
              isRefreshing={isRefreshing}
            />
            
            <DashboardContent />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
