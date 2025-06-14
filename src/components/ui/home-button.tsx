
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function HomeButton({ 
  className = "", 
  variant = "outline",
  size = "default"
}: HomeButtonProps) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Button
      onClick={handleGoHome}
      variant={variant}
      size={size}
      className={`flex items-center space-x-2 ${className}`}
    >
      <Home className="h-4 w-4" />
      <span>Accueil</span>
    </Button>
  );
}
