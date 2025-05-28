
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateTransactionButton() {
  const navigate = useNavigate();

  const handleCreateTransaction = () => {
    console.log('CreateTransactionButton: Navigating to new transaction page');
    navigate('/transactions/new');
  };

  return (
    <Button 
      onClick={handleCreateTransaction}
      className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nouvelle Transaction
    </Button>
  );
}
