
import { AppLayout } from "@/components/layout/AppLayout";
import { SecurityDashboard as SecurityDashboardComponent } from "@/security/components/SecurityDashboard";
import { SecuritySettings } from "@/security/components/SecuritySettings";
import { HomeButton } from "@/components/ui/home-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings } from "lucide-react";

const SecurityDashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
              <Shield className="h-8 w-8 text-[#F97316]" />
              <span>Tableau de bord sécurité</span>
            </h1>
            <p className="text-muted-foreground">
              Surveillance et configuration de la sécurité de l'application
            </p>
          </div>
          <HomeButton />
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <SecurityDashboardComponent />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SecurityDashboard;
