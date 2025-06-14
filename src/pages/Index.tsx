
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeftRight, BarChart3, Globe, Shield, Clock } from "lucide-react";
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

  const quickActions = [
    {
      title: "Nouvelle Transaction",
      description: "Initier un transfert d'argent rapide et sécurisé",
      href: "/transactions/new",
      icon: ArrowLeftRight,
      gradient: "from-emerald-500 via-emerald-600 to-green-600",
      iconBg: "from-emerald-400 to-emerald-600"
    },
    {
      title: "Gestion Transactions",
      description: "Suivre et gérer toutes vos transactions",
      href: "/transactions",
      icon: TrendingUp,
      gradient: "from-golden-500 via-golden-600 to-amber-600",
      iconBg: "from-golden-400 to-golden-600"
    },
    {
      title: "Rapports Analytics",
      description: "Analyses détaillées et rapports financiers",
      href: "/reports",
      icon: BarChart3,
      gradient: "from-noble-500 via-noble-600 to-slate-600",
      iconBg: "from-noble-400 to-noble-600"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-golden-50/30">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-golden-500/5 via-transparent to-emerald-500/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-golden-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          
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
              <span className="text-noble-700 text-4xl md:text-5xl">
                Cargo Services L.L.C
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-noble-600 max-w-4xl mx-auto font-inter font-light leading-relaxed mb-12">
              Votre partenaire de confiance pour les services de cargo premium et transferts d'argent internationaux
              <br />
              <span className="text-golden-600 font-medium">Kinshasa ↔ Dubaï</span>
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-golden-500 to-golden-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-inter font-semibold text-noble-800 mb-2">{feature.title}</h3>
                  <p className="text-noble-600 text-sm text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Access */}
        <div className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-white to-golden-50/30 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-golden-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center py-12 relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-golden-200/50">
                  <img 
                    src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                    alt="Golden El Nobles Cargo Logo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                <CardTitle className="text-3xl md:text-4xl font-playfair font-bold text-noble-800 mb-4">
                  Centre de Contrôle
                </CardTitle>
                <CardDescription className="text-lg text-noble-600 max-w-2xl mx-auto font-inter">
                  Accédez à votre tableau de bord professionnel pour gérer vos opérations de cargo et transferts financiers
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-12 relative z-10">
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {["Cargo Management", "Money Transfer", "Analytics", "Global Network"].map((tag, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-golden-100 text-golden-700 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Button 
                  className="w-full max-w-md mx-auto h-14 text-lg font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group/btn"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="group-hover/btn:scale-105 transition-transform duration-200">
                    Accéder au Tableau de Bord
                  </span>
                  <ArrowLeftRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="py-16 px-6 bg-gradient-to-br from-noble-50/50 to-golden-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-noble-800 mb-4">
                Actions Rapides
              </h2>
              <p className="text-xl text-noble-600 font-inter">
                Démarrez vos opérations en quelques clics
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => (
                <Card key={action.href} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="text-center pt-10 relative z-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${action.iconBg} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <action.icon className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl font-inter font-bold text-noble-800 mb-3">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-noble-600 font-inter leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-8 relative z-10">
                    <Button 
                      className="w-full h-12 font-semibold bg-gradient-to-r from-noble-600 to-noble-700 hover:from-noble-700 hover:to-noble-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      onClick={() => navigate(action.href)}
                    >
                      Commencer
                      <ArrowLeftRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-12 text-center bg-gradient-to-r from-noble-800 to-noble-900">
          <p className="text-white/80 font-inter">
            © 2024 Golden El Nobles Cargo Services L.L.C - Excellence in International Trade
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
