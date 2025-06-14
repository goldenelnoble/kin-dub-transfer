
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateUserRedirect = () => {
    navigate("/users");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10% left-10% w-72 h-72 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20% right-15% w-96 h-96 bg-gradient-to-tl from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-50% left-80% w-64 h-64 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        {/* Left side - Logo and branding */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="flex flex-col items-center lg:items-start space-y-6">
            {/* Logo plus grand et plus visible */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-400 rounded-3xl blur-xl opacity-20 scale-110"></div>
              <img 
                src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
                alt="Golden El Nobles Cargo" 
                className="relative h-40 w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-2xl shadow-2xl ring-4 ring-white/50" 
              />
            </div>
            
            {/* Titre principal modernisé sans redondance */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
                Golden El Nobles
                <span className="block text-3xl md:text-4xl lg:text-5xl mt-2">Services</span>
              </h1>
              
              {/* Nom complet de l'entreprise */}
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-700 mb-4">
                GOLDEN EL NOBLES CARGO SERVICES L.L.C
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-emerald-700">
                  Gestion de Transferts d'Argent
                </h2>
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-lg md:text-xl text-orange-600 font-medium">
                  <span>Kinshasa</span>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                  <span>Dubaï</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features highlights */}
          <div className="hidden lg:block space-y-4 text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Transferts sécurisés et rapides</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Suivi en temps réel</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              <span>Service client 24/7</span>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 max-w-md w-full space-y-6">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-2xl border border-white/50 p-1">
            <LoginForm />
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleCreateUserRedirect}
              variant="outline"
              className="w-full bg-white/50 border-orange-200 hover:bg-orange-50 text-orange-700 font-medium py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
            >
              Aller à la gestion des utilisateurs
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-500 text-center">
          © 2023 Golden El Nobles Cargo Services L.L.C. Tous droits réservés. @merveille_ngoma
        </p>
      </div>
    </div>
  );
};

export default Login;
