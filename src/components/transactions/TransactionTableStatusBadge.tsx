
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types";

interface TransactionTableStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionTableStatusBadge({ status }: TransactionTableStatusBadgeProps) {
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <Badge variant="outline" className="bg-[#FEF3CF] text-[#F7C33F] hover:bg-[#FEF3CF] whitespace-nowrap">En attente</Badge>;
      case TransactionStatus.VALIDATED:
        return <Badge variant="outline" className="bg-[#F2C94C]/20 text-[#F7C33F] hover:bg-[#FEF7CD] whitespace-nowrap">Validée</Badge>;
      case TransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-[#43A047]/20 text-[#43A047] hover:bg-[#C6EFD3] whitespace-nowrap">Complétée</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-[#FEC6A1] text-[#F97316] hover:bg-[#FEC6A1] whitespace-nowrap">Annulée</Badge>;
      default:
        return <Badge variant="outline" className="whitespace-nowrap">Inconnu</Badge>;
    }
  };

  return getStatusBadge(status);
}
