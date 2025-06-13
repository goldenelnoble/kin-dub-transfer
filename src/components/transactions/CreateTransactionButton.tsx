
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
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
      className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90 text-white font-semibold px-6 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
    >
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
          <Plus className="h-3 w-3" />
        </div>
        <span>Nouvelle Transaction</span>
        <Sparkles className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </Button>
  );
}
