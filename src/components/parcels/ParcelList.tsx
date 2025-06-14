
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, MapPin, Calendar, Weight, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Parcel {
  id: string;
  tracking_number: string;
  sender_name: string;
  recipient_name: string;
  status: string;
  weight: number;
  shipping_cost: number;
  created_at: string;
  estimated_delivery: string | null;
  priority: string;
  sender_address: string;
  recipient_address: string;
}

export function ParcelList() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchParcels = async () => {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParcels(data || []);
    } catch (error) {
      console.error('Error fetching parcels:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les colis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  const filteredParcels = parcels.filter(parcel =>
    parcel.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'express': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro de suivi, expéditeur ou destinataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={fetchParcels}
          variant="outline"
          className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
        >
          Actualiser
        </Button>
      </div>

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParcels.map((parcel) => (
          <Card key={parcel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Package className="h-5 w-5 text-[#F97316]" />
                  <span>{parcel.tracking_number}</span>
                </CardTitle>
                <div className="flex space-x-1">
                  <Badge className={getStatusColor(parcel.status)}>
                    {parcel.status}
                  </Badge>
                  <Badge className={getPriorityColor(parcel.priority)}>
                    {parcel.priority}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Créé le {new Date(parcel.created_at).toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">De:</span>
                  <span className="truncate">{parcel.sender_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Vers:</span>
                  <span className="truncate">{parcel.recipient_name}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>{parcel.weight} kg</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{parcel.shipping_cost} USD</span>
                </div>
              </div>

              {parcel.estimated_delivery && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Livraison prévue: {new Date(parcel.estimated_delivery).toLocaleDateString('fr-FR')}</span>
                </div>
              )}

              <Button 
                className="w-full mt-3 bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
                onClick={() => window.open(`/track?number=${parcel.tracking_number}`, '_blank')}
              >
                Suivre le colis
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParcels.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun colis trouvé</h3>
          <p className="text-gray-500">
            {searchTerm ? "Aucun colis ne correspond à votre recherche." : "Commencez par créer un nouveau colis."}
          </p>
        </div>
      )}
    </div>
  );
}
