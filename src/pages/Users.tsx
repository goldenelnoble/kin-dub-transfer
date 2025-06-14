import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import type { User } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Edit, Trash2, User as UserIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { ImpersonationButton } from "@/components/auth/ImpersonationButton";

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" }).optional(),
  role: z.enum(["admin", "supervisor", "operator", "auditor"], { 
    required_error: "Veuillez sélectionner un rôle" 
  }),
  isActive: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Users = () => {
  const { user, hasPermission, updateUser, createUser, deleteUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Initialize the form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "operator",
      isActive: true,
    },
  });

  // Check authorization on mount - mais ne pas rediriger automatiquement
  useEffect(() => {
    console.log('[Users] Checking permissions...', {
      user: user?.name,
      role: user?.role,
      canCreateUsers: hasPermission("canCreateUsers"),
      canEditUsers: hasPermission("canEditUsers"),
      isAdmin: isAdmin()
    });

    // Vérifier si l'utilisateur est admin ou a des permissions spécifiques
    const userHasAccess = isAdmin() || hasPermission("canCreateUsers") || hasPermission("canEditUsers") || hasPermission("canViewUsers");
    
    if (!userHasAccess) {
      console.log('[Users] Access denied, redirecting to dashboard');
      toast.error("Vous n'avez pas accès à cette page");
      navigate("/dashboard");
      return;
    }

    setHasAccess(true);
    loadUsers();
  }, [user, hasPermission, isAdmin, navigate]);

  const loadUsers = async () => {
    if (!hasAccess && !isAdmin() && !hasPermission("canCreateUsers") && !hasPermission("canEditUsers")) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('[Users] Loading users from database...');
      
      // First get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading user profiles:', profilesError);
        toast.error("Erreur lors du chargement des utilisateurs");
        return;
      }

      // Then get auth users to get email addresses
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Error loading auth users:', authError);
        toast.error("Erreur lors du chargement des emails des utilisateurs");
        return;
      }

      console.log('[Users] Loaded profiles:', profiles);
      console.log('[Users] Loaded auth users:', authUsers);

      const usersData: User[] = (profiles || []).map(profile => {
        // Find the corresponding auth user to get the email
        const authUser = authUsers?.users ? 
          authUsers.users.find(au => au.id === profile.id) : 
          null;
        
        return {
          id: profile.id,
          name: profile.name || 'Utilisateur sans nom',
          email: authUser?.email || '',
          role: profile.role as UserRole,
          createdAt: new Date(profile.created_at),
          lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
          isActive: profile.is_active ?? true
        };
      });

      console.log('[Users] Processed users data:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (editingUser) {
        // Update existing user
        const success = await updateUser(editingUser.id, {
          name: data.name,
          role: data.role as UserRole,
          isActive: data.isActive
        });
        
        if (success) {
          await loadUsers(); // Refresh the list
        }
      } else {
        // Add new user
        const success = await createUser({
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          isActive: data.isActive,
          password: data.password || ''
        });
        
        if (success) {
          await loadUsers(); // Refresh the list
        }
      }
      
      // Reset form and close sheet
      form.reset();
      setIsAddUserOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error("Erreur lors de la sauvegarde de l'utilisateur");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    try {
      const success = await deleteUser(userId);
      if (success) {
        await loadUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("role", user.role);
    form.setValue("isActive", user.isActive);
    // Don't set password for existing users
    form.setValue("password", "");
    setIsAddUserOpen(true);
  };

  // Role display mapping
  const roleDisplay = {
    [UserRole.ADMIN]: "Administrateur",
    [UserRole.SUPERVISOR]: "Superviseur", 
    [UserRole.OPERATOR]: "Opérateur",
    [UserRole.AUDITOR]: "Auditeur",
  };

  // Si pas d'accès, ne rien afficher (la redirection est en cours)
  if (!hasAccess) {
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
          <span className="ml-2 text-[#43A047]">Chargement des utilisateurs...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        
        {hasPermission("canCreateUsers") && (
          <Sheet open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => {
                setEditingUser(null);
                form.reset({
                  name: "",
                  email: "",
                  password: "",
                  role: "operator",
                  isActive: true,
                });
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{editingUser ? "Modifier l'utilisateur" : "Ajouter un nouvel utilisateur"}</SheetTitle>
                <SheetDescription>
                  {editingUser 
                    ? "Modifiez les détails de l'utilisateur ci-dessous" 
                    : "Complétez le formulaire pour ajouter un nouvel utilisateur"}
                </SheetDescription>
              </SheetHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom complet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field} 
                            disabled={!!editingUser}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {!editingUser && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Administrateur</SelectItem>
                            <SelectItem value="supervisor">Superviseur</SelectItem>
                            <SelectItem value="operator">Opérateur</SelectItem>
                            <SelectItem value="auditor">Auditeur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Compte actif</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            L'utilisateur peut se connecter et utiliser l'application
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setIsAddUserOpen(false);
                      setEditingUser(null);
                      form.reset();
                    }}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingUser ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un nouvel utilisateur.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  {hasPermission("canEditUsers") && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(userItem => (
                  <TableRow key={userItem.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <span>{userItem.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{roleDisplay[userItem.role]}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(userItem.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {userItem.lastLogin 
                        ? new Date(userItem.lastLogin).toLocaleDateString() 
                        : "Jamais connecté"}
                    </TableCell>
                    {hasPermission("canEditUsers") && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {/* Bouton d'impersonation - seulement pour les non-admins */}
                          {userItem.role !== UserRole.ADMIN && (
                            <ImpersonationButton user={userItem} />
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditUser(userItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {hasPermission("canDeleteUsers") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'utilisateur {userItem.name}?
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(userItem.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Users;
