
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
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
import Verify from "./pages/Verify";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
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
            path="/transactions/:id" 
            element={
              <ProtectedRoute>
                <TransactionDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/new" 
            element={
              <ProtectedRoute requiredPermission="canCreateTransactions">
                <NewTransaction />
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
              <ProtectedRoute requiredPermission="canViewReports">
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-log" 
            element={
              <ProtectedRoute requiredPermission="canViewAuditLog">
                <AuditLog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredPermission="canCreateUsers">
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-settings" 
            element={
              <ProtectedRoute requiredPermission="canConfigureSystem">
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
