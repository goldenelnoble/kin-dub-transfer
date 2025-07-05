import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export enum UserRole {
  ADMIN = "admin",
  SUPERVISOR = "supervisor", 
  OPERATOR = "operator",
  AUDITOR = "auditor"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  identifier?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role permissions mapping
const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewUsers: true,
    canViewReports: true,
    canViewAuditLog: true,
    canConfigureSystem: true,
    canDeleteTransactions: true,
    canUpdateTransactions: true,
    canCreateTransactions: true
  },
  [UserRole.SUPERVISOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewUsers: true,
    canViewReports: true,
    canViewAuditLog: true,
    canConfigureSystem: false,
    canDeleteTransactions: false,
    canUpdateTransactions: true,
    canCreateTransactions: true
  },
  [UserRole.OPERATOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewUsers: false,
    canViewReports: false,
    canViewAuditLog: false,
    canConfigureSystem: false,
    canDeleteTransactions: false,
    canUpdateTransactions: false,
    canCreateTransactions: true
  },
  [UserRole.AUDITOR]: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewUsers: false,
    canViewReports: true,
    canViewAuditLog: true,
    canConfigureSystem: false,
    canDeleteTransactions: false,
    canUpdateTransactions: false,
    canCreateTransactions: false
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching user profile for user:', supabaseUser.id);
      
      let { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, the trigger should have created it
        // Wait a moment and try again
        if (error.code === 'PGRST116') {
          console.log('Profile not found, waiting and retrying...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryProfile, error: retryError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (retryError) {
            console.error('Error fetching user profile after retry:', retryError);
            // Create a default user if profile doesn't exist
            const defaultUser: User = {
              id: supabaseUser.id,
              name: supabaseUser.email || 'Utilisateur',
              email: supabaseUser.email || '',
              role: UserRole.OPERATOR,
              createdAt: new Date(),
              isActive: true
            };
            setUser(defaultUser);
            return;
          }

          profileData = retryProfile;
        } else {
          // Create a default user if profile doesn't exist
          const defaultUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.email || 'Utilisateur',
            email: supabaseUser.email || '',
            role: UserRole.OPERATOR,
            createdAt: new Date(),
            isActive: true
          };
          setUser(defaultUser);
          return;
        }
      }

      if (!profileData) {
        // Create a default user if profile data is missing
        const defaultUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.email || 'Utilisateur',
          email: supabaseUser.email || '',
          role: UserRole.OPERATOR,
          createdAt: new Date(),
          isActive: true
        };
        setUser(defaultUser);
        return;
      }

      const user: User = {
        id: profileData.id,
        name: profileData.name,
        email: supabaseUser.email || '',
        role: profileData.role as UserRole,
        createdAt: new Date(profileData.created_at),
        lastLogin: profileData.last_login ? new Date(profileData.last_login) : undefined,
        isActive: profileData.is_active,
        identifier: profileData.identifier
      };

      console.log('User profile loaded:', user);
      setUser(user);
      
      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', supabaseUser.id);

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Create a default user if all else fails
      const defaultUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.email || 'Utilisateur',
        email: supabaseUser.email || '',
        role: UserRole.OPERATOR,
        createdAt: new Date(),
        isActive: true
      };
      setUser(defaultUser);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message === 'Invalid login credentials' 
            ? "Email ou mot de passe incorrect" 
            : error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      console.log('Login successful for user:', data.user?.email);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la connexion",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };


  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la déconnexion",
          variant: "destructive"
        });
        return;
      }
      
      setUser(null);
      setSession(null);
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return true; // Pas de restrictions de sécurité
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return rolePermissions[permission as keyof typeof rolePermissions] === true;
  };

  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };
  
  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { 
          action: 'update',
          userId, 
          ...userData 
        },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la mise à jour de l'utilisateur",
          variant: "destructive"
        });
        return false;
      }

      if (data.error) {
        console.error('Error updating user:', data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'utilisateur",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const createUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { 
          action: 'create',
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive,
          password: userData.password
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la création de l'utilisateur",
          variant: "destructive"
        });
        return false;
      }

      if (data.error) {
        console.error('Error creating user:', data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'utilisateur",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { 
          action: 'delete',
          userId: userId
        },
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de l'utilisateur",
          variant: "destructive"
        });
        return false;
      }

      if (data.error) {
        console.error('Error deleting user:', data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'utilisateur",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login,
      logout, 
      isLoading, 
      hasPermission,
      isAdmin,
      updateUser,
      createUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
