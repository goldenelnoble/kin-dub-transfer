
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
  if (!transaction) {
    console.error('TransactionTableRow: transaction is null or undefined');
    return null;
  }

  const getDirectionLabel = (direction: TransactionDirection) => {
    return direction === TransactionDirection.KINSHASA_TO_DUBAI
      ? "Kinshasa → Dubaï"
      : "Dubaï → Kinshasa";
  };

  const handleRowClick = () => {
    if (transaction?.id) {
      onGoToDetails(transaction.id);
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="font-mono text-sm font-medium">
        {transaction.id || 'N/A'}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {getDirectionLabel(transaction.direction)}
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {CURRENCY_SYMBOLS[transaction.currency] || '$'}{transaction.amount?.toLocaleString() || '0'}
        </div>
        <div className="text-xs text-muted-foreground">
          Commission: {CURRENCY_SYMBOLS[transaction.currency] || '$'}{transaction.commissionAmount?.toLocaleString() || '0'}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{transaction.sender?.name || 'N/A'}</div>
        <div className="text-sm text-muted-foreground">{transaction.sender?.phone || 'N/A'}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{transaction.recipient?.name || 'N/A'}</div>
        <div className="text-sm text-muted-foreground">{transaction.recipient?.phone || 'N/A'}</div>
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
        </div>
        <div className="text-sm text-muted-foreground">
          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
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
