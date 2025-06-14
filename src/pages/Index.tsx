
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Shield, Clock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Sécurité Premium",
      description: "Transactions sécurisées avec cryptage de niveau bancaire"
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Support client disponible en permanence"
    },
    {
      icon: Globe,
      title: "International",
      description: "Réseau mondial Kinshasa ↔ Dubaï"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-golden-50/30">
        {/* Hero Section Simplifié */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-golden-500/5 via-transparent to-emerald-500/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-golden-400/10 rounded-full blur-3xl animate-float"></div>
          
          <div className="relative z-10 text-center py-20 px-6">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-white/90 backdrop-blur-sm shadow-2xl mb-6 border border-golden-200/50 hover:scale-105 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                  alt="Golden El Nobles Cargo Logo" 
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
              <span className="bg-gradient-to-r from-golden-600 via-golden-500 to-amber-500 bg-clip-text text-transparent">
                Golden El Nobles
              </span>
              <br />
              <span className="text-noble-700 text-3xl md:text-4xl">
                Cargo Services L.L.C
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-noble-600 max-w-3xl mx-auto font-inter font-light leading-relaxed mb-12">
              Votre partenaire de confiance pour les services de cargo premium et transferts d'argent internationaux
              <br />
              <span className="text-golden-600 font-medium">Kinshasa ↔ Dubaï</span>
            </p>

            {/* Features simplifiées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-golden-500 to-golden-600 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-inter font-semibold text-noble-800 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-noble-600 text-xs text-center">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Bouton principal unique */}
            <Button 
              className="h-16 px-12 text-xl font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group"
              onClick={() => navigate("/dashboard")}
            >
              <span className="group-hover:scale-105 transition-transform duration-200">
                Accéder au Tableau de Bord
              </span>
              <ArrowLeftRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </div>

        {/* Section d'accès simplifié */}
        <div className="py-16 px-6 bg-gradient-to-br from-noble-50/50 to-golden-50/30">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-white to-golden-50/30 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-golden-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center py-12 relative z-10">
                <CardTitle className="text-3xl font-playfair font-bold text-noble-800 mb-4">
                  Gestion Professionnelle
                </CardTitle>
                <CardDescription className="text-lg text-noble-600 max-w-2xl mx-auto font-inter">
                  Système intégré de gestion pour vos opérations de cargo et transferts financiers
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-12 relative z-10 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {["Transactions", "Analytics", "Sécurité", "Support 24/7"].map((tag, index) => (
                    <span key={index} className="px-3 py-2 rounded-full bg-golden-100 text-golden-700 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="h-12 px-8 font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    onClick={() => navigate("/transactions/new")}
                  >
                    Nouvelle Transaction
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 px-8 font-semibold border-golden-300 text-golden-700 hover:bg-golden-50 transition-all duration-300 rounded-xl"
                    onClick={() => navigate("/transactions")}
                  >
                    Voir Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer simplifié */}
        <div className="py-8 text-center bg-gradient-to-r from-noble-800 to-noble-900">
          <p className="text-white/80 font-inter text-sm">
            © 2024 Golden El Nobles Cargo Services L.L.C
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
