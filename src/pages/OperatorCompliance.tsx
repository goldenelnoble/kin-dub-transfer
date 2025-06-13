
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings } from "lucide-react";
import OperatorComplianceDashboard from "@/security/components/OperatorComplianceDashboard";
import OperatorSecuritySettings from "@/security/components/OperatorSecuritySettings";

const OperatorCompliance = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <Shield className="h-8 w-8 text-[#43A047]" />
            <span>Conformité Opérateurs</span>
          </h1>
          <p className="text-muted-foreground">
            Gestion des contraintes de sécurité pour les opérateurs de Dubaï et Kinshasa
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <OperatorComplianceDashboard />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <OperatorSecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default OperatorCompliance;
