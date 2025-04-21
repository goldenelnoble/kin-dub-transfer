
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-app-blue-600 to-app-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 space-y-4 md:space-y-6 pb-8 md:pb-0">
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-6 w-6 text-app-gold-500" />
                <h1 className="text-2xl font-bold">TransferApp</h1>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Gestion sécurisée de transferts d'argent
              </h2>
              <p className="text-xl opacity-90">
                Système intégré pour gérer, suivre et sécuriser vos transferts d'argent
                entre Kinshasa et Dubaï.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button size="lg" className="bg-app-gold-500 hover:bg-app-gold-600 text-black">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm opacity-70">De</div>
                        <div className="font-semibold">Kinshasa, DRC</div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-app-gold-500" />
                      <div>
                        <div className="text-sm opacity-70">À</div>
                        <div className="font-semibold">Dubai, UAE</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Montant à envoyer</div>
                      <div className="text-2xl font-bold">$5,000.00</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-70">Commission</div>
                        <div className="font-semibold">$175.00</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-70">Total</div>
                        <div className="font-semibold">$5,175.00</div>
                      </div>
                    </div>
                    <div className="bg-app-gold-500 text-black font-semibold py-2 px-4 rounded-md text-center">
                      TXN-123456789
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-app-blue-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-app-gold-400 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Fonctionnalités clés</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Notre système offre une solution complète pour la gestion des transferts d'argent
              entre Kinshasa et Dubaï avec des fonctionnalités avancées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Gestion des transactions",
                description: "Suivi complet des transferts d'argent dans les deux sens avec calcul automatique des commissions."
              },
              {
                title: "Multi-paiements",
                description: "Prise en charge de plusieurs modes de paiement (agence et mobile money) avec paramétrage dynamique."
              },
              {
                title: "Gestion des accès",
                description: "Contrôle d'accès par niveau (administrateur, opérateur, superviseur) avec journalisation complète."
              },
              {
                title: "Rapports détaillés",
                description: "Génération de rapports statistiques avec visualisation graphique des données de transaction."
              },
              {
                title: "Traçabilité complète",
                description: "Suivi de toutes les actions et modifications dans le système avec journal d'audit."
              },
              {
                title: "Interface multilingue",
                description: "Application disponible en français et en anglais pour une utilisation internationale."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="bg-app-blue-50 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-app-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/login">
              <Button className="bg-app-blue-500 hover:bg-app-blue-600">
                Accéder à l'application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ArrowRight className="h-6 w-6 text-app-gold-500" />
              <span className="text-xl font-bold">TransferApp</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2023 TransferApp. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
