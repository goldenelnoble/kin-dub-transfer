
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, ArrowLeftRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const dashboardOptions = [
    {
      title: "Tableau de Bord Logistique",
      description: "Gérez vos colis, clients et marchandises de Dubai vers Kinshasa",
      href: "/logistics-dashboard",
      icon: Package,
      color: "bg-gradient-to-r from-[#F97316] to-[#F2C94C]",
      features: ["Gestion des colis", "Suivi des expéditions", "Clients et marchandises"]
    },
    {
      title: "Tableau de Bord Financier",
      description: "Gérez vos transferts d'argent et transactions financières",
      href: "/dashboard",
      icon: ArrowLeftRight,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      features: ["Transferts d'argent", "Transactions", "Rapports financiers"]
    }
  ];

  const quickActions = [
    {
      title: "Nouveau Colis",
      description: "Créer un nouveau colis",
      href: "/parcels/new",
      icon: Package,
      color: "bg-gradient-to-r from-[#F97316] to-[#F2C94C]"
    },
    {
      title: "Suivi Colis",
      description: "Suivre un colis existant",
      href: "/track",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      title: "Nouvelle Transaction",
      description: "Créer un transfert d'argent",
      href: "/transactions/new",
      icon: ArrowLeftRight,
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Rapports",
      description: "Consulter les rapports",
      href: "/reports",
      icon: BarChart3,
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
            Bienvenue sur LogiFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre solution complète pour la gestion logistique et financière de Dubai vers Kinshasa
          </p>
        </div>

        {/* Dashboard Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Choisissez votre espace de travail</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {dashboardOptions.map((option) => (
              <Card key={option.href} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-orange-200">
                <CardHeader className="text-center space-y-4">
                  <div className={`w-20 h-20 rounded-full ${option.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <option.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => navigate(option.href)}
                  >
                    Accéder au tableau de bord
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Card key={action.href} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(action.href)}
                  >
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
