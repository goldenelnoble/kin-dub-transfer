
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { UserTabs } from "@/components/users/UserTabs";
import { HomeButton } from "@/components/ui/home-button";

const Users = () => {
  const { user, hasPermission, isAdmin } = useAuth();

  console.log('[Users] Current user and permissions:', {
    user: user?.name,
    userId: user?.id,
    role: user?.role,
    canCreateUsers: hasPermission("canCreateUsers"),
    canEditUsers: hasPermission("canEditUsers"),
    canViewUsers: hasPermission("canViewUsers"),
    isAdmin: isAdmin()
  });

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
