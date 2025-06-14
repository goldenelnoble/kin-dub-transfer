
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
    console.log('Admin creation button clicked');
    setIsCreatingAdmin(true);
    
    try {
      console.log('Starting admin creation process...');
      const credentials = await createAdminUser();
      
      if (credentials) {
        console.log('Admin creation successful:', credentials);
        const credentialsInfo = displayAdminCredentials(credentials);
        toast.success(credentialsInfo.title, {
          description: credentialsInfo.message,
          duration: 15000,
        });
        
        // Also show an alert for better visibility
        alert(`Admin créé avec succès!\n\nEmail: ${credentials.email}\nMot de passe: ${credentials.password}\n\nVous pouvez maintenant vous connecter.`);
        
      } else {
        console.error('Admin creation failed - no credentials returned');
        toast.error("Erreur lors de la création de l'admin", {
          description: "Vérifiez la console pour plus de détails et réessayez."
        });
      }
    } catch (error) {
      console.error('Error in handleCreateAdmin:', error);
      toast.error("Erreur inattendue", {
        description: "Une erreur est survenue. Vérifiez la console pour plus de détails."
      });
    } finally {
      setIsCreatingAdmin(false);
      console.log('Admin creation process completed');
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
          <div className="mt-2 text-sm text-gray-600 text-center">
            <div className="animate-pulse">
              Création de l'utilisateur admin en cours...
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-sm text-[#F97316]">
        © 2023 Golden El Nobles Cargo. Tous droits réservés.
      </p>
    </div>
  );
};

export default Login;
