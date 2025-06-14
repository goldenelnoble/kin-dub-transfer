
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Weight, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Marchandise {
  id: string;
  nom: string;
  reference: string | null;
  poids: number | null;
  dimensions: { length: string; width: string; height: string } | null;
  created_at: string;
}

export function MarchandiseList() {
  const [marchandises, setMarchandises] = useState<Marchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMarchandises = async () => {
    try {
      const { data, error } = await supabase
        .from('marchandises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMarchandises(data || []);
    } catch (error) {
      console.error('Error fetching marchandises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les marchandises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarchandises();
  }, []);

  const filteredMarchandises = marchandises.filter(marchandise =>
    marchandise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (marchandise.reference && marchandise.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={fetchMarchandises}
          variant="outline"
          className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
        >
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarchandises.map((marchandise) => (
          <Card key={marchandise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Package className="h-5 w-5 text-[#F97316]" />
                <span>{marchandise.nom}</span>
              </CardTitle>
              <CardDescription>
                {marchandise.reference && `Réf: ${marchandise.reference} - `}
                Ajoutée le {new Date(marchandise.created_at).toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {marchandise.poids && (
                <div className="flex items-center space-x-2 text-sm">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>{marchandise.poids} kg</span>
                </div>
              )}
              
              {marchandise.dimensions && (
                <div className="flex items-center space-x-2 text-sm">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span>
                    {marchandise.dimensions.length} × {marchandise.dimensions.width} × {marchandise.dimensions.height} cm
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMarchandises.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune marchandise trouvée</h3>
          <p className="text-gray-500">
            {searchTerm ? "Aucune marchandise ne correspond à votre recherche." : "Commencez par créer une nouvelle marchandise."}
          </p>
        </div>
      )}
    </div>
  );
}
