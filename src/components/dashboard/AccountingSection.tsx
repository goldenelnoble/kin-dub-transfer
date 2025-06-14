
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AccountingSection() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold leading-none tracking-tight text-[#F97316]">Comptabilité</h3>
        <Button variant="ghost" size="sm" className="text-[#43A047]" onClick={() => navigate("/accounting")}>
          Voir tout
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="p-6">
        <p className="text-gray-500 text-center">Section comptabilité disponible via le menu principal</p>
      </div>
    </div>
  );
}
