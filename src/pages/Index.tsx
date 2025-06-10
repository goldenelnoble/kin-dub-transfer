
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers le dashboard
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7CD]">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <img src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" className="h-32 w-32 md:h-40 md:w-40 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#F97316]">Golden El Nobles Cargo</h1>
        </div>
        <p className="text-[#F97316]">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
};

export default Index;
