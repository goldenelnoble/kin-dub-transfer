import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function SidebarAuthButtons() {
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
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <User className="h-4 w-4" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-golden-400 font-medium">{user.role}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20 border border-red-400/30"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleLogin}
        variant="ghost"
        size="sm"
        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Connexion
      </Button>
      <Button 
        onClick={handleInstantLogin}
        variant="ghost"
        size="sm"
        className="w-full justify-start text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 border border-amber-400/30"
      >
        Accès Instantané
      </Button>
      <Button 
        onClick={handleAdminLogin}
        size="sm"
        className="w-full bg-gradient-to-r from-golden-500/80 to-golden-600/80 hover:from-golden-500 hover:to-golden-600 text-white border border-golden-400/50"
      >
        Admin
      </Button>
    </div>
  );
}