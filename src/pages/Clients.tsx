
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientList } from "@/components/clients/ClientList";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/ui/home-button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Gestion des Clients</h1>
            <p className="text-muted-foreground">
              Gérez votre base de données clients
            </p>
          </div>
          <div className="flex gap-2">
            <HomeButton variant="ghost" />
            <Button 
              onClick={() => navigate("/clients/new")}
              className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </div>
        </div>

        <ClientList />
      </div>
    </AppLayout>
  );
};

export default Clients;
