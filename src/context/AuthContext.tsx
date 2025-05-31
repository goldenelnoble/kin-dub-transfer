
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        toast.error("Erreur lors du chargement du profil utilisateur");
        setUser(null);
        return;
      }

      const user: User = {
        id: profile.id,
        name: profile.name,
        email: supabaseUser.email || '',
        role: profile.role as UserRole,
        createdAt: new Date(profile.created_at),
        lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
        isActive: profile.is_active
      };

      setUser(user);
      
      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', supabaseUser.id);

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || "Erreur lors de la connexion");
        setIsLoading(false);
        return false;
      }

      toast.success("Connexion réussie!");
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erreur lors de la connexion");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || "Erreur lors de l'inscription");
        setIsLoading(false);
        return false;
      }

      toast.success("Inscription réussie! Vérifiez votre email pour confirmer votre compte.");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Erreur lors de l'inscription");
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error("Erreur lors de la déconnexion");
        return;
      }
      
      setUser(null);
      setSession(null);
      toast.info("Vous avez été déconnecté");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return rolePermissions[permission as keyof typeof rolePermissions] === true;
  };
  
  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: userData.name,
          role: userData.role,
          is_active: userData.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
        return false;
      }

      toast.success("Utilisateur mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      return false;
    }
  };
  
  const createUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: { name: userData.name }
      });

      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        toast.error("Erreur lors de la création de l'utilisateur");
        return false;
      }

      // Update the profile with the specified role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: userData.name,
          role: userData.role,
          is_active: userData.isActive
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        toast.error("Erreur lors de la configuration du profil utilisateur");
        return false;
      }

      toast.success("Utilisateur créé avec succès");
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error("Erreur lors de la création de l'utilisateur");
      return false;
    }
  };
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error("Erreur lors de la suppression de l'utilisateur");
        return false;
      }

      toast.success("Utilisateur supprimé avec succès");
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      register,
      logout, 
      isLoading, 
      hasPermission,
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
