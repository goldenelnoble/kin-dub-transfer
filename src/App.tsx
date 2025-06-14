
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SecurityProvider } from "@/security/hooks/useSecurityContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Accounting from "./pages/Accounting";
import AdminSettings from "./pages/AdminSettings";
import SecurityDashboard from "./pages/SecurityDashboard";
import OperatorCompliance from "./pages/OperatorCompliance";
import AuditLog from "./pages/AuditLog";
import Parcels from "./pages/Parcels";
import NewParcel from "./pages/NewParcel";
import ParcelTracking from "./pages/ParcelTracking";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import Marchandises from "./pages/Marchandises";
import NewMarchandise from "./pages/NewMarchandise";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SecurityProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<NewTransaction />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/security" element={<SecurityDashboard />} />
              <Route path="/compliance" element={<OperatorCompliance />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="/parcels" element={<Parcels />} />
              <Route path="/parcels/new" element={<NewParcel />} />
              <Route path="/track" element={<ParcelTracking />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/new" element={<NewClient />} />
              <Route path="/marchandises" element={<Marchandises />} />
              <Route path="/marchandises/new" element={<NewMarchandise />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SecurityProvider>
  </QueryClientProvider>
);

export default App;
