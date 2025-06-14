
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Archive, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Stats {
  totalParcels: number;
  totalClients: number;
  totalMarchandises: number;
  pendingParcels: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalParcels: 0,
    totalClients: 0,
    totalMarchandises: 0,
    pendingParcels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [parcelsResult, clientsResult, marchandisesResult, pendingResult] = await Promise.all([
        supabase.from('parcels').select('id', { count: 'exact', head: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('marchandises').select('id', { count: 'exact', head: true }),
        supabase.from('parcels').select('id', { count: 'exact', head: true }).neq('status', 'delivered')
      ]);

      setStats({
        totalParcels: parcelsResult.count || 0,
        totalClients: clientsResult.count || 0,
        totalMarchandises: marchandisesResult.count || 0,
        pendingParcels: pendingResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
      title: "Nouveau Client",
      description: "Ajouter un client",
      href: "/clients/new",
      icon: Users,
      color: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      title: "Nouvelle Marchandise",
      description: "Ajouter une marchandise",
      href: "/marchandises/new",
      icon: Archive,
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
            Votre solution complète pour la gestion logistique de Dubai vers Kinshasa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colis</CardTitle>
              <Package className="h-4 w-4 text-[#F97316]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#F97316]">
                {loading ? "..." : stats.totalParcels}
              </div>
              <p className="text-xs text-muted-foreground">
                Colis enregistrés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                Clients actifs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marchandises</CardTitle>
              <Archive className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? "..." : stats.totalMarchandises}
              </div>
              <p className="text-xs text-muted-foreground">
                Types de marchandises
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Transit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : stats.pendingParcels}
              </div>
              <p className="text-xs text-muted-foreground">
                Colis en cours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Actions Rapides</h2>
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
