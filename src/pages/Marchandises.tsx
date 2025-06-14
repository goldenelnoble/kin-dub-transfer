
import { AppLayout } from "@/components/layout/AppLayout";
import { MarchandiseList } from "@/components/marchandises/MarchandiseList";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/ui/home-button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Marchandises = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Catalogue des Marchandises</h1>
            <p className="text-muted-foreground">
              Gérez votre catalogue de marchandises
            </p>
          </div>
          <div className="flex gap-2">
            <HomeButton variant="ghost" />
            <Button 
              onClick={() => navigate("/marchandises/new")}
              className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Marchandise
            </Button>
          </div>
        </div>

        <MarchandiseList />
      </div>
    </AppLayout>
  );
};

export default Marchandises;
