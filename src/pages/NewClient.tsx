
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientForm } from "@/components/clients/ClientForm";
import { HomeButton } from "@/components/ui/home-button";

const NewClient = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouveau Client</h1>
            <p className="text-muted-foreground">
              Ajouter un nouveau client au système
            </p>
          </div>
          <HomeButton />
        </div>

        <ClientForm />
      </div>
    </AppLayout>
  );
};

export default NewClient;
