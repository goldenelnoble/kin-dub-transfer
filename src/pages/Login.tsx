
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEF7CD] p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <img src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" className="h-16 mr-2" />
          <h1 className="text-3xl font-bold text-[#F97316]">Golden El Nobles Cargo</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[#43A047]">Gestion de Transferts d'Argent</h2>
        <p className="text-[#F97316]">Kinshasa ↔ Dubaï</p>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-[#F97316]">
        © 2023 Golden El Nobles Cargo. Tous droits réservés.
      </p>
    </div>
  );
};

export default Login;
