import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function HomeAuthButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
          <User className="h-5 w-5 text-golden-400" />
          <div>
            <p className="text-sm font-medium text-noble-800">{user.name}</p>
            <p className="text-xs text-golden-600 font-medium">{user.role}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleLogin}
      className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Connexion
    </Button>
  );
}