
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function MarchandiseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    reference: "",
    poids: "",
    dimensions: { length: "", width: "", height: "" }
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
      const marchandiseData = {
        nom: formData.nom,
        reference: formData.reference || null,
        poids: formData.poids ? parseFloat(formData.poids) : null,
        dimensions: formData.dimensions
      };

      const { data, error } = await supabase
        .from('marchandises')
        .insert(marchandiseData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Marchandise créée avec succès!",
        description: `${data.nom} ajoutée au catalogue`,
      });

      navigate('/marchandises');
    } catch (error) {
      console.error('Error creating marchandise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la marchandise",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-[#F97316]" />
            <span>Nouvelle marchandise</span>
          </CardTitle>
          <CardDescription>Ajouter une nouvelle marchandise au catalogue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de la marchandise *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poids">Poids (kg)</Label>
            <Input
              id="poids"
              type="number"
              step="0.1"
              value={formData.poids}
              onChange={(e) => handleInputChange('poids', e.target.value)}
            />
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
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/marchandises')}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
        >
          {loading ? "Création..." : "Créer la marchandise"}
        </Button>
      </div>
    </form>
  );
}
