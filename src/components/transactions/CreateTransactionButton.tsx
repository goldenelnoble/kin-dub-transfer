
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CreateTransactionButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/transactions/new")} 
      className="bg-[#F97316] hover:bg-[#F2C94C] text-white"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nouvelle Transaction
    </Button>
  );
};
