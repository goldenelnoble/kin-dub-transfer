
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
import { UserPlus, Edit, Trash2, User as UserIcon, Key, Copy } from "lucide-react";
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
  password: z.string().min(8, { message: "Le mot de passe doit comporter au moins 8 caractères" }).optional(),
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
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

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
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading user profiles:', profilesError);
        toast.error("Erreur lors du chargement des utilisateurs");
        return;
      }

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Error loading auth users:', authError);
        toast.error("Erreur lors du chargement des emails des utilisateurs");
        return;
      }

      console.log('[Users] Loaded profiles:', profiles);
      console.log('[Users] Loaded auth users:', authUsers);

      const usersData: User[] = (profiles || []).map(profile => {
        const authUser: any = authUsers?.users?.find((au: any) => au.id === profile.id) || null;
        
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

  // Generate secure password
  const generateSecurePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setGeneratedPassword(newPassword);
    form.setValue("password", newPassword);
    toast.success("Mot de passe généré avec succès!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers!");
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
          await loadUsers();
        }
      } else {
        // Add new user
        if (!data.password) {
          toast.error("Le mot de passe est requis pour créer un nouvel utilisateur");
          return;
        }

        const success = await createUser({
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          isActive: data.isActive,
          password: data.password
        });
        
        if (success) {
          // Show the credentials to the admin
          toast.success("Utilisateur créé avec succès!", {
            description: `Email: ${data.email}\nMot de passe: ${data.password}`,
            duration: 10000
          });
          
          // Also show an alert for better visibility
          alert(`Utilisateur créé avec succès!\n\nEmail: ${data.email}\nMot de passe: ${data.password}\n\nVeuillez noter ces informations car elles ne seront plus affichées.`);
          
          await loadUsers();
        }
      }
      
      // Reset form and close sheet
      form.reset();
      setIsAddUserOpen(false);
      setEditingUser(null);
      setGeneratedPassword("");
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
        await loadUsers();
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
    form.setValue("password", "");
    setGeneratedPassword("");
    setIsAddUserOpen(true);
  };

  // Role display mapping
  const roleDisplay = {
    [UserRole.ADMIN]: "Administrateur",
    [UserRole.SUPERVISOR]: "Superviseur", 
    [UserRole.OPERATOR]: "Opérateur",
    [UserRole.AUDITOR]: "Auditeur",
  };

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Créez et gérez les comptes utilisateurs avec leurs identifiants</p>
        </div>
        
        {hasPermission("canCreateUsers") && (
          <Sheet open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <SheetTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#E8601A] hover:to-[#E6C043] text-white shadow-lg"
                onClick={() => {
                  setEditingUser(null);
                  form.reset({
                    name: "",
                    email: "",
                    password: "",
                    role: "operator",
                    isActive: true,
                  });
                  setGeneratedPassword("");
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[500px] sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>{editingUser ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}</span>
                </SheetTitle>
                <SheetDescription>
                  {editingUser 
                    ? "Modifiez les détails de l'utilisateur ci-dessous" 
                    : "Créez un nouveau compte utilisateur avec un identifiant et mot de passe sécurisés"}
                </SheetDescription>
              </SheetHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom complet de l'utilisateur" {...field} />
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
                        <FormLabel>Email (Identifiant de connexion)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@exemple.com" 
                            {...field} 
                            disabled={!!editingUser}
                          />
                        </FormControl>
                        <FormMessage />
                        {editingUser && (
                          <p className="text-xs text-gray-500">L'email ne peut pas être modifié après la création</p>
                        )}
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
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Mot de passe sécurisé (min. 8 caractères)" 
                                  {...field} 
                                />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={handleGeneratePassword}
                                title="Générer un mot de passe sécurisé"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                            </div>
                            {generatedPassword && (
                              <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                                <span className="text-sm text-green-700 font-mono">{generatedPassword}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(generatedPassword)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                          <p className="text-xs text-gray-500">
                            Un mot de passe fort est automatiquement généré. Vous pouvez le personnaliser si nécessaire.
                          </p>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle et permissions</FormLabel>
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
                            <SelectItem value="admin">
                              <div className="flex flex-col">
                                <span className="font-medium">Administrateur</span>
                                <span className="text-xs text-gray-500">Accès complet au système</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="supervisor">
                              <div className="flex flex-col">
                                <span className="font-medium">Superviseur</span>
                                <span className="text-xs text-gray-500">Gestion des transactions et rapports</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="operator">
                              <div className="flex flex-col">
                                <span className="font-medium">Opérateur</span>
                                <span className="text-xs text-gray-500">Création de transactions uniquement</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="auditor">
                              <div className="flex flex-col">
                                <span className="font-medium">Auditeur</span>
                                <span className="text-xs text-gray-500">Consultation des rapports et audits</span>
                              </div>
                            </SelectItem>
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Compte actif</FormLabel>
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
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        setIsAddUserOpen(false);
                        setEditingUser(null);
                        form.reset();
                        setGeneratedPassword("");
                      }}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#E8601A] hover:to-[#E6C043] text-white"
                    >
                      {editingUser ? "Mettre à jour" : "Créer l'utilisateur"}
                    </Button>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Liste des Utilisateurs</CardTitle>
              <CardDescription className="text-gray-600">
                {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserIcon className="h-4 w-4" />
              <span>Gestion des identifiants</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur</h3>
              <p className="mt-2 text-gray-500">Commencez par créer un nouvel utilisateur avec ses identifiants.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-semibold">Utilisateur</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Identifiant (Email)</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Rôle</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Statut</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Créé le</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Dernière connexion</TableHead>
                  {hasPermission("canEditUsers") && (
                    <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(userItem => (
                  <TableRow key={userItem.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                          {userItem.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900">{userItem.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{userItem.email}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(userItem.email)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        userItem.role === 'admin' ? 'bg-red-100 text-red-800' :
                        userItem.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                        userItem.role === 'operator' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {roleDisplay[userItem.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(userItem.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {userItem.lastLogin 
                        ? new Date(userItem.lastLogin).toLocaleDateString('fr-FR') 
                        : "Jamais connecté"}
                    </TableCell>
                    {hasPermission("canEditUsers") && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {userItem.role !== UserRole.ADMIN && (
                            <ImpersonationButton user={userItem} />
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditUser(userItem)}
                            className="hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {hasPermission("canDeleteUsers") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userItem.name}</strong>?
                                    Cette action supprimera définitivement son compte et ses identifiants.
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer définitivement
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
