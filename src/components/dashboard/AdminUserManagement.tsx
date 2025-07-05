
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import { useAuth, UserRole } from "@/context/AuthContext";
import type { User } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export function AdminUserManagement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('admin-users?action=list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

        if (error) {
          console.error('Error loading users:', error);
          toast.error("Erreur lors du chargement des utilisateurs");
          return;
        }

        if (data.error) {
          console.error('Error loading users:', data.error);
          toast.error(data.error);
          return;
        }

      const usersData: User[] = (data.users || []).slice(0, 5).map((userData: any) => ({
        id: userData.id,
        name: userData.name || 'Utilisateur sans nom',
        email: userData.email || '',
        role: userData.role as UserRole,
        createdAt: new Date(userData.createdAt),
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
        isActive: userData.isActive ?? true
      }));

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const roleDisplay = {
    [UserRole.ADMIN]: "Administrateur",
    [UserRole.SUPERVISOR]: "Superviseur", 
    [UserRole.OPERATOR]: "Opérateur",
    [UserRole.AUDITOR]: "Auditeur",
  };

  if (!isAdmin()) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#F97316]" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F97316]"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#F97316]" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? 's' : ''} récent{users.length > 1 ? 's' : ''}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate("/users")}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir tout
          </Button>
          <Button
            onClick={() => navigate("/users")}
            className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#E8601A] hover:to-[#E6C043] text-white"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur</h3>
            <p className="mt-2 text-gray-500">Commencez par créer votre premier utilisateur.</p>
            <Button
              onClick={() => navigate("/users")}
              className="mt-4 bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#E8601A] hover:to-[#E6C043] text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Créer un utilisateur
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'operator' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {roleDisplay[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
