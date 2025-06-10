
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createAdminUser, displayAdminCredentials } from "@/utils/adminSetup";
import { toast } from "sonner";

const Login = () => {
  const { user, isLoading } = useAuth();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    
    try {
      console.log('Starting admin creation process...');
      const credentials = await createAdminUser();
      
      if (credentials) {
        const credentialsInfo = displayAdminCredentials(credentials);
        toast.success(credentialsInfo.title, {
          description: credentialsInfo.message,
          duration: 10000,
        });
        console.log('Admin user creation completed successfully');
      } else {
        console.error('Admin creation failed - no credentials returned');
        toast.error("Erreur", {
          description: "Échec de la création de l'utilisateur admin. Vérifiez la console pour plus de détails."
        });
      }
    } catch (error) {
      console.error('Error in handleCreateAdmin:', error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la création de l'admin. Vérifiez la console pour plus de détails."
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEF7CD] p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <img src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" className="h-32 w-32 md:h-40 md:w-40 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#F97316]">Golden El Nobles Cargo</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[#43A047]">Gestion de Transferts d'Argent</h2>
        <p className="text-[#F97316]">Kinshasa ↔ Dubaï</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-6 w-full max-w-md">
        <Button 
          onClick={handleCreateAdmin}
          disabled={isCreatingAdmin}
          variant="outline"
          className="w-full"
        >
          {isCreatingAdmin ? "Création en cours..." : "Créer un utilisateur Admin"}
        </Button>
        
        {isCreatingAdmin && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            Cela peut prendre quelques secondes...
          </p>
        )}
      </div>
      
      <p className="mt-8 text-sm text-[#F97316]">
        © 2023 Golden El Nobles Cargo. Tous droits réservés.
      </p>
    </div>
  );
};

export default Login;
