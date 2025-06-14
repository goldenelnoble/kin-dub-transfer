
import { Currency, DashboardStats } from "@/types";
import { DashboardSummary } from "./DashboardSummary";
import { ActivitySection } from "./ActivitySection";
import { RecentTransactionsSection } from "./RecentTransactionsSection";
import { AccountingSection } from "./AccountingSection";
import { AdminUserManagement } from "./AdminUserManagement";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

export function DashboardContent() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { stats, recentTransactions, allTransactions, isLoading } = useDashboardData();

  const handleSummaryClick = (type: keyof DashboardStats) => {
    console.log(`Dashboard: Summary card clicked: ${type}`);
    switch (type) {
      case "totalTransactions":
      case "pendingTransactions":
      case "cancelledTransactions":
        navigate("/transactions");
        break;
      case "completedTransactions":
        navigate("/reports");
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
        <span className="ml-2 text-[#43A047]">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardSummary 
        stats={stats} 
        currency={Currency.USD}
        onStatClick={handleSummaryClick}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <ActivitySection transactions={allTransactions} />
        </div>
        <div>
          <RecentTransactionsSection 
            transactions={recentTransactions}
            isLoading={isLoading}
          />
        </div>
      </div>

      <AccountingSection />

      {isAdmin() && (
        <AdminUserManagement />
      )}
    </div>
  );
}
