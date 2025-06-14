
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  description: string;
  created_at: string;
  coordinates?: { lat: number; lng: number };
}

interface ParcelInfo {
  id: string;
  tracking_number: string;
  sender_name: string;
  recipient_name: string;
  status: string;
  weight: number;
  created_at: string;
  estimated_delivery: string | null;
  sender_address: string;
  recipient_address: string;
}

interface TrackingResultProps {
  trackingNumber: string;
}

export function TrackingResult({ trackingNumber }: TrackingResultProps) {
  const [parcel, setParcel] = useState<ParcelInfo | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        // Fetch parcel info
        const { data: parcelData, error: parcelError } = await supabase
          .from('parcels')
          .select('*')
          .eq('tracking_number', trackingNumber)
          .single();

        if (parcelError || !parcelData) {
          setNotFound(true);
          return;
        }

        setParcel(parcelData);

        // Fetch tracking events
        const { data: eventsData, error: eventsError } = await supabase
          .from('parcel_tracking')
          .select('*')
          .eq('parcel_id', parcelData.id)
          .order('created_at', { ascending: false });

        if (!eventsError && eventsData) {
          setTrackingEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setNotFoun(true);
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      fetchTrackingData();
    }
  }, [trackingNumber]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'delayed': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316] mx-auto"></div>
          <p className="mt-4 text-gray-600">Recherche en cours...</p>
        </CardContent>
      </Card>
    );
  }

  if (notFound) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-red-200">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Colis introuvable</h3>
          <p className="text-gray-600">
            Le numéro de suivi <strong>{trackingNumber}</strong> n'existe pas dans notre système.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Vérifiez que vous avez saisi le bon numéro ou contactez notre service client.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!parcel) return null;

  return (
    <div className="space-y-6">
      {/* Parcel Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-[#F97316] flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>{parcel.tracking_number}</span>
            </CardTitle>
            <Badge className={getStatusColor(parcel.status)}>
              {parcel.status}
            </Badge>
          </div>
          <CardDescription>
            Colis créé le {new Date(parcel.created_at).toLocaleDateString('fr-FR')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Expéditeur</h4>
              <p className="text-gray-600">{parcel.sender_name}</p>
              <p className="text-sm text-gray-500">{parcel.sender_address}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Destinataire</h4>
              <p className="text-gray-600">{parcel.recipient_name}</p>
              <p className="text-sm text-gray-500">{parcel.recipient_address}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Poids: {parcel.weight} kg</span>
            </div>
            {parcel.estimated_delivery && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm">
                  Livraison prévue: {new Date(parcel.estimated_delivery).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#F97316]/20">
        <CardHeader>
          <CardTitle className="text-xl text-[#F97316]">Historique du suivi</CardTitle>
          <CardDescription>Toutes les étapes du transport de votre colis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{event.location}</span>
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(event.created_at).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  <Badge className={`${getStatusColor(event.status)} mt-2`}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
