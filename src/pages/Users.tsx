
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { UserTabs } from "@/components/users/UserTabs";
import { HomeButton } from "@/components/ui/home-button";

const Users = () => {
  const { user, hasPermission, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authorization on mount and when auth state changes
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('[Users] Auth is still loading...');
      return;
    }

    console.log('[Users] Checking permissions...', {
      user: user?.name,
      userId: user?.id,
      role: user?.role,
      canCreateUsers: hasPermission("canCreateUsers"),
      canEditUsers: hasPermission("canEditUsers"),
      canViewUsers: hasPermission("canViewUsers"),
      isAdmin: isAdmin()
    });

    // If no user is logged in, redirect to login
    if (!user) {
      console.log('[Users] No user found, redirecting to login');
      navigate("/login");
      return;
    }

    // Check if user has any user management permissions
    const userHasAccess = isAdmin() || 
                         hasPermission("canCreateUsers") || 
                         hasPermission("canEditUsers") || 
                         hasPermission("canViewUsers");
    
    if (!userHasAccess) {
      console.log('[Users] Access denied, redirecting to dashboard');
      navigate("/dashboard");
      return;
    }

    console.log('[Users] Access granted');
    setHasAccess(true);
    setIsLoading(false);
  }, [user, hasPermission, isAdmin, navigate, authLoading]);

  // Show loading while auth is loading or while checking permissions
  if (authLoading || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
          <span className="ml-2 text-[#43A047]">Chargement...</span>
        </div>
      </AppLayout>
    );
  }

  // If we don't have access, don't render anything (redirect is happening)
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
