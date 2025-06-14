
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateParcelButton() {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/parcels/new")}
      className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
    >
      <Plus className="h-4 w-4 mr-2" />
      Nouveau Colis
    </Button>
  );
}
