
import { AppLayout } from "@/components/layout/AppLayout";
import { ParcelForm } from "@/components/parcels/ParcelForm";
import { HomeButton } from "@/components/ui/home-button";

const NewParcel = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouveau Colis</h1>
            <p className="text-muted-foreground">
              Enregistrer un nouveau colis pour expédition
            </p>
          </div>
          <HomeButton />
        </div>

        <ParcelForm />
      </div>
    </AppLayout>
  );
};

export default NewParcel;
