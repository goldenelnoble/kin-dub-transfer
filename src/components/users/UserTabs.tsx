
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "./UserList";
import { UserSecuritySettings } from "./UserSecuritySettings";
import { UserRoleManagement } from "./UserRoleManagement";
import { Users, Shield, UserCheck } from "lucide-react";

export function UserTabs() {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Utilisateurs</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Sécurité</span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center space-x-2">
          <UserCheck className="h-4 w-4" />
          <span>Rôles & Permissions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-6">
        <UserList />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <UserSecuritySettings />
      </TabsContent>

      <TabsContent value="roles" className="space-y-6">
        <UserRoleManagement />
      </TabsContent>
    </Tabs>
  );
}
