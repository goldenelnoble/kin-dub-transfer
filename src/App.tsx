
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import NewTransaction from "./pages/NewTransaction";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import AuditLog from "./pages/AuditLog";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
        <Route path="/transactions/new" element={<NewTransaction />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
