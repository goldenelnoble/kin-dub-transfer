
import { AppLayout } from "@/components/layout/AppLayout";
import { MarchandiseForm } from "@/components/marchandises/MarchandiseForm";
import { HomeButton } from "@/components/ui/home-button";

const NewMarchandise = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouvelle Marchandise</h1>
            <p className="text-muted-foreground">
              Ajouter une nouvelle marchandise au catalogue
            </p>
          </div>
          <HomeButton />
        </div>

        <MarchandiseForm />
      </div>
    </AppLayout>
  );
};

export default NewMarchandise;
