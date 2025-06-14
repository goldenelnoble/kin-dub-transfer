
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, TrendingUp, Package, Globe } from "lucide-react";
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
      title: "Transactions Aujourd'hui",
      value: "247",
      change: "+12%",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Colis en Transit",
      value: "89",
      change: "+5%",
      icon: Package,
      gradient: "from-golden-500 to-golden-600"
    },
    {
      title: "Destinations Actives",
      value: "12",
      change: "+2",
      icon: Globe,
      gradient: "from-noble-500 to-noble-600"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-golden-50/20">
        {/* Hero Header */}
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-golden-500/5 via-transparent to-emerald-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-golden-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-golden-500 to-golden-600 rounded-2xl flex items-center justify-center shadow-xl animate-glow">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-playfair font-bold bg-gradient-to-r from-golden-600 to-golden-500 bg-clip-text text-transparent">
                      Centre de Contrôle
                    </h1>
                    <p className="text-lg text-noble-600 font-inter mt-2">
                      Gestion intelligente des opérations cargo et transferts financiers
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => navigate("/")} 
                className="bg-gradient-to-r from-noble-600 to-noble-700 hover:from-noble-700 hover:to-noble-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl h-12 px-6 font-semibold"
              >
                <Eye className="h-4 w-4 mr-2" />
                Retour Accueil
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-inter font-medium text-noble-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-noble-800 font-inter">
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
        </div>

        {/* Dashboard Components */}
        <DashboardHeader 
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          isRefreshing={isRefreshing}
        />
        
        <div className="px-8">
          <DashboardContent />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
