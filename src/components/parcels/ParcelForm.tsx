
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, User, MapPin, Weight, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function ParcelForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Sender info
    sender_name: "",
    sender_phone: "",
    sender_address: "",
    // Recipient info
    recipient_name: "",
    recipient_phone: "",
    recipient_address: "",
    // Parcel info
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    description: "",
    declared_value: "",
    shipping_cost: "",
    priority: "standard",
    estimated_delivery: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (dimension: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parcelData = {
        sender_name: formData.sender_name,
        sender_phone: formData.sender_phone,
        sender_address: formData.sender_address,
        recipient_name: formData.recipient_name,
        recipient_phone: formData.recipient_phone,
        recipient_address: formData.recipient_address,
        weight: parseFloat(formData.weight),
        dimensions: formData.dimensions,
        description: formData.description,
        declared_value: formData.declared_value ? parseFloat(formData.declared_value) : null,
        shipping_cost: parseFloat(formData.shipping_cost),
        priority: formData.priority,
        estimated_delivery: formData.estimated_delivery || null,
        notes: formData.notes,
        created_by: "admin" // TODO: Get from auth context
      };

      const { data, error } = await supabase
        .from('parcels')
        .insert([parcelData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Colis créé avec succès!",
        description: `Numéro de suivi: ${data.tracking_number}`,
      });

      navigate('/parcels');
    } catch (error) {
      console.error('Error creating parcel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le colis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sender Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-[#F97316]" />
            <span>Informations de l'expéditeur</span>
          </CardTitle>
          <CardDescription>Détails de la personne qui envoie le colis</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sender_name">Nom complet *</Label>
            <Input
              id="sender_name"
              value={formData.sender_name}
              onChange={(e) => handleInputChange('sender_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender_phone">Téléphone *</Label>
            <Input
              id="sender_phone"
              value={formData.sender_phone}
              onChange={(e) => handleInputChange('sender_phone', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sender_address">Adresse complète *</Label>
            <Textarea
              id="sender_address"
              value={formData.sender_address}
              onChange={(e) => handleInputChange('sender_address', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-[#F97316]" />
            <span>Informations du destinataire</span>
          </CardTitle>
          <CardDescription>Détails de la personne qui recevra le colis</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient_name">Nom complet *</Label>
            <Input
              id="recipient_name"
              value={formData.recipient_name}
              onChange={(e) => handleInputChange('recipient_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient_phone">Téléphone *</Label>
            <Input
              id="recipient_phone"
              value={formData.recipient_phone}
              onChange={(e) => handleInputChange('recipient_phone', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="recipient_address">Adresse complète à Kinshasa *</Label>
            <Textarea
              id="recipient_address"
              value={formData.recipient_address}
              onChange={(e) => handleInputChange('recipient_address', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Parcel Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-[#F97316]" />
            <span>Détails du colis</span>
          </CardTitle>
          <CardDescription>Informations sur le contenu et les caractéristiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_cost">Coût d'expédition (USD) *</Label>
              <Input
                id="shipping_cost"
                type="number"
                step="0.01"
                value={formData.shipping_cost}
                onChange={(e) => handleInputChange('shipping_cost', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Longueur"
                value={formData.dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
              />
              <Input
                placeholder="Largeur"
                value={formData.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
              />
              <Input
                placeholder="Hauteur"
                value={formData.dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="declared_value">Valeur déclarée (USD)</Label>
              <Input
                id="declared_value"
                type="number"
                step="0.01"
                value={formData.declared_value}
                onChange={(e) => handleInputChange('declared_value', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_delivery">Date de livraison estimée</Label>
            <Input
              id="estimated_delivery"
              type="date"
              value={formData.estimated_delivery}
              onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du contenu *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/parcels')}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
        >
          {loading ? "Création..." : "Créer le colis"}
        </Button>
      </div>
    </form>
  );
}
