import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function AuthButtons() {
  const { user, logout, instantLogin, adminAutoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleInstantLogin = async () => {
    const success = await instantLogin();
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleAdminLogin = async () => {
    const success = await adminAutoLogin();
    if (success) {
      navigate("/dashboard");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-noble-600">
          <User className="h-4 w-4" />
          <span>{user.name}</span>
          <span className="text-xs bg-noble-100 px-2 py-1 rounded-full">
            {user.role}
          </span>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleLogin}
        variant="outline"
        size="sm"
        className="border-noble-300 text-noble-700 hover:bg-noble-50"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Connexion
      </Button>
      <Button 
        onClick={handleInstantLogin}
        variant="outline"
        size="sm"
        className="border-amber-300 text-amber-700 hover:bg-amber-50"
      >
        Accès Instantané
      </Button>
      <Button 
        onClick={handleAdminLogin}
        size="sm"
        className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
      >
        Admin
      </Button>
    </div>
  );
}