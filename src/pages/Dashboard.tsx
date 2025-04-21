
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { Currency } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample stats for the dashboard
  const sampleStats = {
    totalTransactions: 93,
    pendingTransactions: 12,
    completedTransactions: 76,
    cancelledTransactions: 5,
    totalAmount: 345000,
    totalCommissions: 10350
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble des transactions et statistiques
            </p>
          </div>
          <Button 
            onClick={() => navigate("/transactions/new")} 
            className="bg-app-blue-500 hover:bg-app-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Transaction
          </Button>
        </div>

        <DashboardSummary stats={sampleStats} currency={Currency.USD} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Activité récente</h3>
              </div>
              <div className="p-6">
                {/* Here would be a chart component in a real app */}
                <div className="h-[200px] bg-muted/50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Graphique d'activité des transactions</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="font-semibold leading-none tracking-tight">Transactions récentes</h3>
                <Button variant="ghost" size="sm" className="text-app-blue-500">
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">TXN12345{i}</p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 ? "Dubaï → Kinshasa" : "Kinshasa → Dubaï"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$2,{i}00.00</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
