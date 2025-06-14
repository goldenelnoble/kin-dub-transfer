
import { useNavigate } from "react-router-dom";
import { ArrowRight, Send, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF7CD] via-[#FEF3CF] to-[#F2C94C]/20 p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo et titre principal */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F97316]/20 blur-xl rounded-full"></div>
            <img 
              src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
              alt="Golden El Nobles Cargo" 
              className="relative h-24 w-24 md:h-32 md:w-32 drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
            />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
              Golden El Nobles
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#DBA32A]">
              Cargo
            </h2>
            <p className="text-[#B6801D] text-sm max-w-md mx-auto">
              Système de gestion des transactions et transferts d'argent
            </p>
          </div>
        </div>

        {/* Système d'onglets */}
        <div className="w-full">
          <Tabs defaultValue="transfers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="transfers" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Transferts d'argent</span>
              </TabsTrigger>
              <TabsTrigger value="parcels" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Système de colis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transfers" className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-[#F97316] flex items-center justify-center space-x-2">
                    <Send className="h-6 w-6" />
                    <span>Transferts d'argent</span>
                  </CardTitle>
                  <CardDescription className="text-[#B6801D]">
                    Gérez vos transferts d'argent en toute sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#F97316] mb-2">Envoi rapide</h3>
                      <p className="text-sm text-[#B6801D]">Transférez de l'argent instantanément vers vos proches</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#F97316] mb-2">Suivi en temps réel</h3>
                      <p className="text-sm text-[#B6801D]">Suivez vos transactions en direct</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/transactions/new")}
                    className="w-full bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
                  >
                    Créer un transfert
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parcels" className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-[#F97316] flex items-center justify-center space-x-2">
                    <Package className="h-6 w-6" />
                    <span>Système de colis</span>
                  </CardTitle>
                  <CardDescription className="text-[#B6801D]">
                    Expédiez et suivez vos colis en toute simplicité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#F97316] mb-2">Expédition sécurisée</h3>
                      <p className="text-sm text-[#B6801D]">Vos colis sont protégés pendant tout le transport</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#F97316] mb-2">Tracking GPS</h3>
                      <p className="text-sm text-[#B6801D]">Localisez vos colis en temps réel</p>
                    </div>
                  </div>
                  <div className="bg-[#FEF7CD]/50 p-4 rounded-lg text-center">
                    <Package className="h-12 w-12 text-[#F97316] mx-auto mb-2" />
                    <p className="text-[#B6801D] text-sm">
                      Fonctionnalité bientôt disponible
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bouton de redirection manuelle */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="group inline-flex items-center space-x-2 bg-gradient-to-r from-[#F97316] to-[#F2C94C] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Accéder au tableau de bord</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
