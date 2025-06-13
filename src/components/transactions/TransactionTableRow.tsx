
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction, TransactionDirection } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { TransactionTableStatusBadge } from "./TransactionTableStatusBadge";
import { TransactionTableActions } from "./TransactionTableActions";

interface TransactionTableRowProps {
  transaction: Transaction;
  canEdit: boolean;
  onUpdateStatus: (id: string, status: any) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onGoToDetails: (id: string) => void;
}

export function TransactionTableRow({
  transaction,
  canEdit,
  onUpdateStatus,
  onEdit,
  onDelete,
  onGoToDetails
}: TransactionTableRowProps) {
  const getDirectionLabel = (direction: TransactionDirection) => {
    return direction === TransactionDirection.KINSHASA_TO_DUBAI
      ? "Kinshasa → Dubaï"
      : "Dubaï → Kinshasa";
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => onGoToDetails(transaction.id)}
    >
      <TableCell className="font-mono text-sm font-medium">{transaction.id}</TableCell>
      <TableCell className="whitespace-nowrap">{getDirectionLabel(transaction.direction)}</TableCell>
      <TableCell>
        <div className="font-medium">
          {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">
          Commission: {CURRENCY_SYMBOLS[transaction.currency]}{transaction.commissionAmount.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{transaction.sender.name}</div>
        <div className="text-sm text-muted-foreground">{transaction.sender.phone}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{transaction.recipient.name}</div>
        <div className="text-sm text-muted-foreground">{transaction.recipient.phone}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </TableCell>
      <TableCell>
        <TransactionTableStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <TransactionTableActions
          transactionId={transaction.id}
          status={transaction.status}
          canEdit={canEdit}
          onUpdateStatus={onUpdateStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          onGoToDetails={onGoToDetails}
        />
      </TableCell>
    </TableRow>
  );
}
