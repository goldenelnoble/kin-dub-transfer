
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Archive, TrendingUp, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LogisticsStats {
  totalParcels: number;
  totalClients: number;
  totalMarchandises: number;
  pendingParcels: number;
  deliveredParcels: number;
  inTransitParcels: number;
}

const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<LogisticsStats>({
    totalParcels: 0,
    totalClients: 0,
    totalMarchandises: 0,
    pendingParcels: 0,
    deliveredParcels: 0,
    inTransitParcels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogisticsStats();
  }, []);

  const fetchLogisticsStats = async () => {
    try {
      const [
        parcelsResult, 
        clientsResult, 
        marchandisesResult, 
        pendingResult,
        deliveredResult,
        inTransitResult
      ] = await Promise.all([
        supabase.from('parcels').select('id', { count: 'exact', head: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('marchandises').select('id', { count: 'exact', head: true }),
        supabase.from('parcels').select('id', { count: 'exact', head: true }).eq('status', 'received'),
        supabase.from('parcels').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
        supabase.from('parcels').select('id', { count: 'exact', head: true }).eq('status', 'in_transit')
      ]);

      setStats({
        totalParcels: parcelsResult.count || 0,
        totalClients: clientsResult.count || 0,
        totalMarchandises: marchandisesResult.count || 0,
        pendingParcels: pendingResult.count || 0,
        deliveredParcels: deliveredResult.count || 0,
        inTransitParcels: inTransitResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching logistics stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Nouveau Colis",
      description: "Enregistrer un nouveau colis",
      href: "/parcels/new",
      icon: Plus,
      color: "bg-[#F97316] hover:bg-[#F97316]/90"
    },
    {
      title: "Voir tous les Colis",
      description: "Gérer tous les colis",
      href: "/parcels",
      icon: Package,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Suivi des Colis",
      description: "Suivre les expéditions",
      href: "/track",
      icon: TrendingUp,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Gérer les Clients",
      description: "Base de données clients",
      href: "/clients",
      icon: Users,
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
              Tableau de Bord Logistique
            </h1>
            <p className="text-gray-600 mt-2">
              Gestion des colis et expéditions Dubai → Kinshasa
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                Base de données clients
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
                Types référencés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : stats.pendingParcels}
              </div>
              <p className="text-xs text-muted-foreground">
                Colis reçus
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
                {loading ? "..." : stats.inTransitParcels}
              </div>
              <p className="text-xs text-muted-foreground">
                Colis expédiés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrés</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {loading ? "..." : stats.deliveredParcels}
              </div>
              <p className="text-xs text-muted-foreground">
                Colis livrés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card key={action.href} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(action.href)}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-3">
                    <Button className={`h-12 w-12 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LogisticsDashboard;
