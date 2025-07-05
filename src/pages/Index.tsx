
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HomeAuthButton } from "@/components/auth/HomeAuthButton";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Protection complète de vos transactions avec cryptage bancaire"
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Équipe disponible en permanence pour vos besoins"
    },
    {
      icon: Globe,
      title: "Réseau International",
      description: "Connexions directes Kinshasa ↔ Dubaï"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-golden-50/30 to-white">
        {/* Header with Auth Buttons */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-noble-200/50">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                alt="Golden El Nobles Cargo Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-playfair font-bold text-golden-600">Golden El Nobles</span>
            </div>
            <HomeAuthButton />
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-golden-200/50 hover:scale-105 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                  alt="Golden El Nobles Cargo Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-golden-600 to-golden-500 bg-clip-text text-transparent">
                Golden El Nobles
              </span>
              <br />
              <span className="text-2xl md:text-3xl text-noble-600 font-light">
                Cargo Services L.L.C
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-noble-600 max-w-2xl mx-auto font-light mb-12 leading-relaxed">
              Excellence en services de cargo et transferts financiers internationaux
            </p>
            
            {/* CTA Button */}
            <Button 
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
              onClick={() => navigate("/dashboard")}
            >
              Accéder à la Plateforme
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 rounded-xl">
                  <CardHeader className="text-center pt-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-golden-500 to-golden-600 shadow-md mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-playfair font-semibold text-noble-800">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-8">
                    <CardDescription className="text-noble-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-8 bg-gradient-to-r from-noble-800 to-noble-900">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="text-white">
                <div className="text-3xl font-bold font-playfair text-golden-400 mb-2">15K+</div>
                <div className="text-white/80 font-inter">Transactions</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold font-playfair text-golden-400 mb-2">2.5K+</div>
                <div className="text-white/80 font-inter">Clients Satisfaits</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold font-playfair text-golden-400 mb-2">8+</div>
                <div className="text-white/80 font-inter">Années d'Expérience</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-noble-800 mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-noble-600 mb-8 font-light">
              Rejoignez des milliers de clients qui nous font confiance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                onClick={() => navigate("/transactions/new")}
              >
                Nouvelle Transaction
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base font-semibold border-noble-300 text-noble-700 hover:bg-noble-50 transition-all duration-300 rounded-xl"
                onClick={() => navigate("/dashboard")}
              >
                Tableau de Bord
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 border-t border-noble-200">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <p className="text-noble-500 font-inter text-sm">
              © 2024 Golden El Nobles Cargo Services L.L.C - Excellence & Confiance
            </p>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
};

export default Index;
