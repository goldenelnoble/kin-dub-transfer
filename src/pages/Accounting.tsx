
import { AppLayout } from "@/components/layout/AppLayout";
import { AccountingDashboard } from "@/components/accounting/AccountingDashboard";
import { AccountingTabs } from "@/components/accounting/AccountingTabs";
import { HomeButton } from "@/components/ui/home-button";
import { Calculator, TrendingUp, FileText, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const Accounting = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* En-tête du système comptable */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#43A047]/5 via-transparent to-[#F2C94C]/5 rounded-3xl -m-2"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-[#43A047] to-[#F2C94C] rounded-2xl flex items-center justify-center shadow-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#43A047] to-[#F2C94C] bg-clip-text text-transparent">
                  Système Comptable
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Gestion comptable complète avec tableau de bord, grand livre, états financiers et analyses avancées.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <TrendingUp className="h-3 w-3" />
                  <span>Analyse en temps réel</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FileText className="h-3 w-3" />
                  <span>États financiers</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  <BarChart3 className="h-3 w-3" />
                  <span>Rapports détaillés</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <HomeButton />
            </div>
          </div>
        </div>

        {/* Tableau de bord comptable */}
        <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
          <AccountingDashboard />
        </Card>

        {/* Onglets du système comptable */}
        <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
          <AccountingTabs />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Accounting;
