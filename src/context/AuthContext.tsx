
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { User, UserRole } from "@/types";
import { DEMO_USERS, ROLE_PERMISSIONS } from "@/lib/constants";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS[UserRole]) => boolean;
  updateUser: (userId: string, userData: Partial<User>) => boolean;
  createUser: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => boolean;
  deleteUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in demo data
    const foundUser = DEMO_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      const authUser = {
        ...userWithoutPassword,
        lastLogin: new Date()
      };
      
      setUser(authUser as User);
      localStorage.setItem("user", JSON.stringify(authUser));
      toast.success("Connexion réussie!");
      setIsLoading(false);
      return true;
    } else {
      toast.error("Email ou mot de passe incorrect");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Vous avez été déconnecté");
  };

  const hasPermission = (permission: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role][permission] === true;
  };
  
  // New functions for user management (demo implementation)
  const updateUser = (userId: string, userData: Partial<User>): boolean => {
    // In a real application, this would make an API call
    // For demo purposes, we just return true
    console.log(`Update user ${userId} with data:`, userData);
    return true;
  };
  
  const createUser = (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): boolean => {
    // In a real application, this would make an API call
    // For demo purposes, we just return true
    console.log(`Create user with data:`, userData);
    return true;
  };
  
  const deleteUser = (userId: string): boolean => {
    // In a real application, this would make an API call
    // For demo purposes, we just return true
    console.log(`Delete user ${userId}`);
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
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
