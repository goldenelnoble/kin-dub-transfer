
import { AppLayout } from "@/components/layout/AppLayout";
import { ParcelList } from "@/components/parcels/ParcelList";
import { CreateParcelButton } from "@/components/parcels/CreateParcelButton";
import { HomeButton } from "@/components/ui/home-button";

const Parcels = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Gestion des Colis</h1>
            <p className="text-muted-foreground">
              Gérez l'expédition et le suivi des colis de Dubai vers Kinshasa
            </p>
          </div>
          <div className="flex gap-2">
            <HomeButton variant="ghost" />
            <CreateParcelButton />
          </div>
        </div>

        <ParcelList />
      </div>
    </AppLayout>
  );
};

export default Parcels;
