
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  canEdit?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TransactionTable = ({
  transactions,
  onUpdateStatus,
  canEdit = false,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  const navigate = useNavigate();

  const goToTransactionDetails = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="text-left p-4">
            {transactions.length === 0 
              ? "Aucune transaction trouvée avec les filtres actuels" 
              : `${transactions.length} transaction(s) affichée(s)`
            }
          </TableCaption>
          <TransactionTableHeader />
          <TableBody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-muted-foreground">Aucune transaction trouvée</div>
                    <div className="text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</div>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map(transaction => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  canEdit={canEdit}
                  onUpdateStatus={onUpdateStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onGoToDetails={goToTransactionDetails}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
