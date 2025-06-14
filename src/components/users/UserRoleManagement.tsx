
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Settings, Eye, Edit } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

interface RolePermission {
  name: string;
  description: string;
  roles: UserRole[];
}

const permissions: RolePermission[] = [
  {
    name: "Créer des transactions",
    description: "Autoriser la création de nouvelles transactions",
    roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR]
  },
  {
    name: "Modifier les transactions",
    description: "Autoriser la modification des transactions existantes",
    roles: [UserRole.ADMIN, UserRole.SUPERVISOR]
  },
  {
    name: "Supprimer les transactions",
    description: "Autoriser la suppression des transactions",
    roles: [UserRole.ADMIN]
  },
  {
    name: "Gérer les utilisateurs",
    description: "Créer, modifier et supprimer des comptes utilisateurs",
    roles: [UserRole.ADMIN]
  },
  {
    name: "Accéder aux rapports",
    description: "Consulter les rapports et analyses",
    roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.AUDITOR]
  },
  {
    name: "Gérer les clients",
    description: "Créer et modifier les informations clients",
    roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR]
  },
  {
    name: "Gérer les colis",
    description: "Créer, modifier et suivre les colis",
    roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.OPERATOR]
  },
  {
    name: "Paramètres système",
    description: "Accéder aux paramètres de configuration",
    roles: [UserRole.ADMIN]
  }
];

export function UserRoleManagement() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.OPERATOR);

  const roleDisplay = {
    [UserRole.ADMIN]: { name: "Administrateur", color: "bg-red-100 text-red-800" },
    [UserRole.SUPERVISOR]: { name: "Superviseur", color: "bg-blue-100 text-blue-800" },
    [UserRole.OPERATOR]: { name: "Opérateur", color: "bg-green-100 text-green-800" },
    [UserRole.AUDITOR]: { name: "Auditeur", color: "bg-purple-100 text-purple-800" },
  };

  const filteredPermissions = permissions.filter(permission => 
    permission.roles.includes(selectedRole)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-[#F97316]" />
            <span>Gestion des Rôles et Permissions</span>
          </CardTitle>
          <CardDescription>
            Définir les permissions par rôle utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélecteur de rôle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Afficher les permissions pour le rôle :</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDisplay).map(([role, display]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${display.color}`}>
                        {display.name}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions du rôle sélectionné */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Permissions pour {roleDisplay[selectedRole].name}
            </h3>
            
            <div className="grid gap-3">
              {filteredPermissions.map((permission, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{permission.name}</h4>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      Autorisé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredPermissions.length === 0 && (
              <div className="text-center py-8">
                <Settings className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune permission spécifique</h3>
                <p className="mt-2 text-gray-500">Ce rôle n'a pas de permissions particulières définies.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résumé des rôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-[#F97316]" />
            <span>Résumé des Rôles</span>
          </CardTitle>
          <CardDescription>
            Vue d'ensemble des différents rôles utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(roleDisplay).map(([role, display]) => {
              const rolePermissions = permissions.filter(p => p.roles.includes(role as UserRole));
              return (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={display.color}>
                      {display.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {rolePermissions.length} permissions
                    </span>
                  </div>
                  <div className="space-y-1">
                    {rolePermissions.slice(0, 3).map((permission, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        • {permission.name}
                      </p>
                    ))}
                    {rolePermissions.length > 3 && (
                      <p className="text-xs text-gray-500">
                        ... et {rolePermissions.length - 3} autres
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
