
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Globe, Sparkles, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Cryptage bancaire et protection complète de vos transactions",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Clock,
      title: "Service Continu",
      description: "Équipe disponible 24h/24 et 7j/7 pour vos besoins",
      color: "from-golden-500 to-golden-600"
    },
    {
      icon: Globe,
      title: "Réseau International",
      description: "Connexions directes entre Kinshasa et Dubaï",
      color: "from-noble-500 to-noble-600"
    }
  ];

  const stats = [
    { label: "Transactions Mensuelles", value: "15K+", icon: TrendingUp },
    { label: "Clients Satisfaits", value: "2.5K+", icon: Users },
    { label: "Années d'Expérience", value: "8+", icon: Sparkles }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-golden-50/20">
        {/* Hero Section Premium */}
        <section className="relative overflow-hidden py-24 px-6">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-golden-500/3 via-transparent to-emerald-500/3"></div>
            <div className="absolute top-20 right-20 w-80 h-80 bg-golden-400/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Logo Section */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-golden-200/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-500">
                    <img 
                      src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                      alt="Golden El Nobles Cargo Logo" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-golden-600 via-golden-500 to-amber-500 bg-clip-text text-transparent">
                  Golden El Nobles
                </span>
                <br />
                <span className="text-4xl md:text-5xl text-noble-700 font-light">
                  Cargo Services L.L.C
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-noble-600 max-w-4xl mx-auto font-light leading-relaxed mb-4">
                Excellence en services de cargo et transferts financiers internationaux
              </p>
              
              <div className="flex items-center justify-center gap-2 text-lg text-golden-600 font-medium">
                <Globe className="w-5 h-5" />
                <span>Kinshasa ↔ Dubaï</span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-golden-50 shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-golden-200/30">
                    <stat.icon className="w-8 h-8 text-golden-600" />
                  </div>
                  <div className="text-3xl font-playfair font-bold text-noble-800 mb-2">{stat.value}</div>
                  <div className="text-noble-600 font-inter">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="h-16 px-12 text-xl font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl group border-0"
                onClick={() => navigate("/dashboard")}
              >
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Accéder à la Plateforme
                </span>
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-white via-golden-50/20 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-noble-800 mb-6">
                Nos Services Premium
              </h2>
              <p className="text-xl text-noble-600 max-w-3xl mx-auto font-light">
                Des solutions adaptées à vos besoins avec un service d'exception
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-2xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="pb-4 relative z-10 text-center pt-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-playfair font-bold text-noble-800 mb-4">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 text-center pb-8">
                    <CardDescription className="text-lg text-noble-600 leading-relaxed font-light">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-noble-900 via-noble-800 to-noble-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-golden-500/10 via-transparent to-emerald-500/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-golden-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
              Rejoignez des milliers de clients qui nous font confiance pour leurs opérations internationales
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                onClick={() => navigate("/transactions/new")}
              >
                Nouvelle Transaction
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-xl"
                onClick={() => navigate("/dashboard")}
              >
                Tableau de Bord
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-noble-900 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-white/60 font-inter">
              © 2024 Golden El Nobles Cargo Services L.L.C - Excellence & Confiance
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
};

export default Index;
