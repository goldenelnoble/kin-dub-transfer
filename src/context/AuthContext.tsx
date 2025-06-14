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
  loginWithIdentifier: (identifier: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
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
            toast({
              title: "Erreur",
              description: "Erreur lors du chargement du profil utilisateur",
              variant: "destructive"
            });
            setUser(null);
            setIsLoading(false);
            return;
          }

          profileData = retryProfile;
        } else {
          toast({
            title: "Erreur",
            description: "Erreur lors du chargement du profil utilisateur",
            variant: "destructive"
          });
          setUser(null);
          setIsLoading(false);
          return;
        }
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
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = "Erreur lors de la connexion";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
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

  const loginWithIdentifier = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting identifier login for:', identifier);
      
      // First, get user data using the identifier authentication function
      const { data: userData, error: userError } = await supabase
        .rpc('authenticate_with_identifier', {
          p_identifier: identifier,
          p_password: password
        });

      if (userError || !userData || userData.length === 0) {
        console.error('Identifier authentication error:', userError);
        toast({
          title: "Erreur de connexion",
          description: "Identifiant ou mot de passe incorrect",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      const userInfo = userData[0];
      console.log('User found with identifier:', userInfo);

      // Now sign in with the email from the user data
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password,
      });

      if (error) {
        console.error('Final login error:', error);
        toast({
          title: "Erreur de connexion",
          description: "Erreur lors de la connexion",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      console.log('Identifier login successful for user:', data.user?.email);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      return true;
    } catch (error) {
      console.error('Identifier login error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la connexion",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        let errorMessage = "Erreur lors de l'inscription";
        
        if (error.message.includes('already registered')) {
          errorMessage = "Cet email est déjà utilisé";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Registration successful for user:', data.user.email);
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors de l'inscription",
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
        variant: "destructive"
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return rolePermissions[permission as keyof typeof rolePermissions] === true;
  };

  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
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
        toast({
          title: "Erreur",
          description: "Erreur lors de la mise à jour de l'utilisateur",
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
      // Create user in Supabase Auth using admin function
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: { name: userData.name }
      });

      if (authError || !authData.user) {
        console.error('Error creating auth user:', authError);
        toast({
          title: "Erreur",
          description: "Erreur lors de la création de l'utilisateur",
          variant: "destructive"
        });
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
        toast({
          title: "Erreur",
          description: "Erreur lors de la configuration du profil utilisateur",
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
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de l'utilisateur",
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
      loginWithIdentifier,
      register,
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
