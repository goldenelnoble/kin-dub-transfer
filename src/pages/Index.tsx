
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers le dashboard après 2 secondes
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FEF7CD] via-[#FEF3CF] to-[#F2C94C]/20">
      <div className="text-center space-y-8 p-8">
        {/* Logo et titre principal */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F97316]/20 blur-xl rounded-full"></div>
            <img 
              src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
              alt="Golden El Nobles Cargo" 
              className="relative h-24 w-24 md:h-32 md:w-32 drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
              Golden El Nobles
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#DBA32A]">
              Cargo
            </h2>
          </div>
        </div>

        {/* Message de chargement */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-[#F97316]">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <p className="text-lg font-medium">Chargement du tableau de bord...</p>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          
          {/* Barre de progression */}
          <div className="w-64 mx-auto bg-white/30 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F97316] to-[#F2C94C] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Bouton de redirection manuelle */}
        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="group inline-flex items-center space-x-2 bg-gradient-to-r from-[#F97316] to-[#F2C94C] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span>Accéder maintenant</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Description */}
        <p className="text-[#B6801D] text-sm max-w-md mx-auto">
          Système de gestion des transactions et transferts d'argent
        </p>
      </div>
    </div>
  );
};

export default Index;
