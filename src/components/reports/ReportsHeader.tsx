
import { FileText } from "lucide-react";
import { CreateTransactionButton } from "@/components/transactions/CreateTransactionButton";

export function ReportsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <FileText className="h-10 w-10 text-[#F97316]" />
        <div>
          <h1 className="text-3xl font-bold text-[#F97316]">Rapports</h1>
          <p className="text-[#43A047]">Consultez et exportez vos rapports clés concernant les transactions et commissions.</p>
        </div>
      </div>
      <CreateTransactionButton />
    </div>
  );
}
