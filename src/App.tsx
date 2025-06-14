
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SecurityProvider } from "@/security/hooks/useSecurityContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions/new" 
                element={
                  <ProtectedRoute>
                    <NewTransaction />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions/:id" 
                element={
                  <ProtectedRoute>
                    <TransactionDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/receipts" 
                element={
                  <ProtectedRoute>
                    <Receipts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/accounting" 
                element={
                  <ProtectedRoute>
                    <Accounting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredPermission="canConfigureSystem">
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/security" 
                element={
                  <ProtectedRoute>
                    <SecurityDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/compliance" 
                element={
                  <ProtectedRoute>
                    <OperatorCompliance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/audit" 
                element={
                  <ProtectedRoute>
                    <AuditLog />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SecurityProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
