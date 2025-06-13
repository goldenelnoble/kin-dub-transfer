
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { SecurityProvider } from "@/security/hooks/useSecurityContext";
import { SecurityMiddleware } from "@/security/SecurityMiddleware";
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
import Login from "./pages/Login";
import SecurityDashboard from "./pages/SecurityDashboard";
import Verify from "./pages/Verify";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialisation du système de sécurité
    console.log('[SECURITY] Application starting with security enabled');
    
    // Démarrage du job de nettoyage du rate limiter
    SecurityMiddleware.startCleanupJob();
    
    // Configuration des en-têtes de sécurité globaux
    if (typeof document !== 'undefined') {
      // Configuration CSP via meta tag si nécessaire
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://ffbhsuiwzugxsualzdyz.supabase.co";
      document.head.appendChild(cspMeta);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityProvider>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/users" element={<Users />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </SecurityProvider>
    </QueryClientProvider>
  );
}

export default App;
