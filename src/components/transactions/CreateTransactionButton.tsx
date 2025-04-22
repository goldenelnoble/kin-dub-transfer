
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export const CreateTransactionButton = () => {
  const navigate = useNavigate();

  const handleCreateTransaction = () => {
    // On peut ajouter ici une logique avant de naviguer vers la page de création
    // Par exemple, vérifier des permissions, pré-remplir des données, etc.
    
    // Notification pour indiquer qu'une nouvelle transaction va être créée
    toast.info("Création d'une nouvelle transaction", {
      description: "Vous allez être redirigé vers le formulaire de création",
      action: {
        label: "Annuler",
        onClick: () => {
          toast.dismiss();
        }
      }
    });
    
    // Navigation vers la page de création
    navigate("/transactions/new");
  };

  return (
    <Button 
      onClick={handleCreateTransaction} 
      className="bg-[#F97316] hover:bg-[#F2C94C] text-white"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nouvelle Transaction
    </Button>
  );
};
