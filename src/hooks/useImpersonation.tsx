
import { useState, useContext, createContext, ReactNode } from 'react';
import { User, UserRole, useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImpersonationContextType {
  isImpersonating: boolean;
  originalUser: User | null;
  impersonatedUser: User | null;
  startImpersonation: (targetUser: User) => Promise<boolean>;
  stopImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const { user: currentUser, hasPermission } = useAuth();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);

  const startImpersonation = async (targetUser: User): Promise<boolean> => {
    // Vérifier que l'utilisateur actuel est admin
    if (!currentUser || !hasPermission('canCreateUsers')) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent utiliser cette fonctionnalité",
        variant: "destructive"
      });
      return false;
    }

    // Ne pas permettre l'impersonation d'un autre admin
    if (targetUser.role === UserRole.ADMIN) {
      toast({
        title: "Action non autorisée",
        description: "Impossible de s'incarner dans un compte administrateur",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Sauvegarder l'utilisateur original
      setOriginalUser(currentUser);
      setImpersonatedUser(targetUser);
      setIsImpersonating(true);

      toast({
        title: "Impersonation activée",
        description: `Vous êtes maintenant connecté en tant que ${targetUser.name}`,
      });

      console.log(`[IMPERSONATION] Admin ${currentUser.name} s'est incarné en tant que ${targetUser.name}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'impersonation:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'impersonation",
        variant: "destructive"
      });
      return false;
    }
  };

  const stopImpersonation = () => {
    if (!isImpersonating || !originalUser) return;

    console.log(`[IMPERSONATION] Retour au compte administrateur ${originalUser.name}`);
    
    setIsImpersonating(false);
    setImpersonatedUser(null);
    setOriginalUser(null);

    toast({
      title: "Impersonation terminée",
      description: "Vous êtes de retour sur votre compte administrateur",
    });
  };

  return (
    <ImpersonationContext.Provider value={{
      isImpersonating,
      originalUser,
      impersonatedUser,
      startImpersonation,
      stopImpersonation
    }}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
}
