
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const { user, isLoading } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <ArrowRight className="h-8 w-8 text-app-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-app-blue-600">TransferApp</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Gestion de Transferts d'Argent</h2>
        <p className="text-gray-600">Kinshasa ↔ Dubaï</p>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-gray-500">
        © 2023 TransferApp. Tous droits réservés.
      </p>
    </div>
  );
};

export default Login;
