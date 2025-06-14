
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeftRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nouvelle Transaction",
      description: "Créer un transfert d'argent",
      href: "/transactions/new",
      icon: ArrowLeftRight,
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Voir Transactions",
      description: "Consulter toutes les transactions",
      href: "/transactions",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bienvenue sur LogiFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre solution complète pour la gestion des transferts d'argent
          </p>
        </div>

        {/* Dashboard Access */}
        <div className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-200">
              <CardHeader className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Tableau de Bord</CardTitle>
                <CardDescription className="text-base">
                  Gérez vos transferts d'argent et transactions financières
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Transferts d'argent</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Transactions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Rapports financiers</span>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 text-base font-semibold"
                  onClick={() => navigate("/dashboard")}
                >
                  Accéder au tableau de bord
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
