
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TransactionTableStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionTableStatusBadge({ status }: TransactionTableStatusBadgeProps) {
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case TransactionStatus.VALIDATED:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 whitespace-nowrap">
            <AlertCircle className="h-3 w-3 mr-1" />
            Validée
          </Badge>
        );
      case TransactionStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 whitespace-nowrap">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complétée
          </Badge>
        );
      case TransactionStatus.CANCELLED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 whitespace-nowrap">
            <XCircle className="h-3 w-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 whitespace-nowrap">
            Inconnu
          </Badge>
        );
    }
  };

  return getStatusBadge(status);
}
