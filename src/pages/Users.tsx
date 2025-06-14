
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { UserTabs } from "@/components/users/UserTabs";
import { HomeButton } from "@/components/ui/home-button";

const Users = () => {
  const { user, hasPermission, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authorization on mount
  useEffect(() => {
    console.log('[Users] Checking permissions...', {
      user: user?.name,
      role: user?.role,
      canCreateUsers: hasPermission("canCreateUsers"),
      canEditUsers: hasPermission("canEditUsers"),
      isAdmin: isAdmin()
    });

    const userHasAccess = isAdmin() || hasPermission("canCreateUsers") || hasPermission("canEditUsers") || hasPermission("canViewUsers");
    
    if (!userHasAccess) {
      console.log('[Users] Access denied, redirecting to dashboard');
      navigate("/dashboard");
      return;
    }

    setHasAccess(true);
    setIsLoading(false);
  }, [user, hasPermission, isAdmin, navigate]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
          <span className="ml-2 text-[#43A047]">Chargement...</span>
        </div>
      </AppLayout>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F97316]">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gérez les utilisateurs, leurs rôles et la sécurité du système
            </p>
          </div>
          <HomeButton variant="ghost" />
        </div>

        <UserTabs />
      </div>
    </AppLayout>
  );
};

export default Users;
