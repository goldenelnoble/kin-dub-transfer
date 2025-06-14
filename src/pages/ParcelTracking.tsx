
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, MapPin, Clock } from "lucide-react";
import { HomeButton } from "@/components/ui/home-button";
import { TrackingResult } from "@/components/parcels/TrackingResult";

const ParcelTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      setSearchTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF7CD] via-[#FEF3CF] to-[#F2C94C]/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
              alt="Golden El Nobles Cargo" 
              className="h-12 w-12" 
            />
            <div>
              <h1 className="text-3xl font-bold text-[#F97316]">Suivi de Colis</h1>
              <p className="text-[#B6801D]">Dubai → Kinshasa</p>
            </div>
          </div>
          <HomeButton />
        </div>

        {/* Search Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#F97316] flex items-center justify-center space-x-2">
              <Package className="h-6 w-6" />
              <span>Rechercher votre colis</span>
            </CardTitle>
            <CardDescription className="text-[#B6801D]">
              Entrez votre numéro de suivi pour connaître l'état de votre colis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ex: GEN2501123456"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Localisation GPS</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Suivez votre colis en temps réel
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-green-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Mises à jour</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Notifications automatiques
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-600">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">Sécurisé</span>
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Transport protégé et assuré
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingNumber && searchTrigger > 0 && (
          <TrackingResult 
            trackingNumber={trackingNumber} 
            key={searchTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default ParcelTracking;
