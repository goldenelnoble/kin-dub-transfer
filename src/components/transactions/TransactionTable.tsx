
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Check, X, CheckCircle, Trash2, Edit } from "lucide-react";
import { Transaction, TransactionDirection, TransactionStatus } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <Badge variant="outline" className="bg-[#FEF3CF] text-[#F7C33F] hover:bg-[#FEF3CF]">En attente</Badge>;
      case TransactionStatus.VALIDATED:
        return <Badge variant="outline" className="bg-[#F2C94C]/20 text-[#F7C33F] hover:bg-[#FEF7CD]">Validée</Badge>;
      case TransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-[#43A047]/20 text-[#43A047] hover:bg-[#C6EFD3]">Complétée</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-[#FEC6A1] text-[#F97316] hover:bg-[#FEC6A1]">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getDirectionLabel = (direction: TransactionDirection) => {
    return direction === TransactionDirection.KINSHASA_TO_DUBAI
      ? "Kinshasa → Dubaï"
      : "Dubaï → Kinshasa";
  };

  const goToTransactionDetails = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  const handleValidate = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.VALIDATED);
  };

  const handleComplete = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.COMPLETED);
  };

  const handleCancel = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.CANCELLED);
  };

  const handleEdit = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(transactionId);
    }
  };

  const handleDelete = (transactionId: string) => {
    if (onDelete) {
      onDelete(transactionId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Liste de toutes les transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Expéditeur</TableHead>
            <TableHead>Bénéficiaire</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Aucune transaction trouvée
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(transaction => (
              <TableRow 
                key={transaction.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => goToTransactionDetails(transaction.id)}
              >
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{getDirectionLabel(transaction.direction)}</TableCell>
                <TableCell>
                  <div>
                    {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Commission: {CURRENCY_SYMBOLS[transaction.currency]}{transaction.commissionAmount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{transaction.sender.name}</div>
                  <div className="text-sm text-muted-foreground">{transaction.sender.phone}</div>
                </TableCell>
                <TableCell>
                  <div>{transaction.recipient.name}</div>
                  <div className="text-sm text-muted-foreground">{transaction.recipient.phone}</div>
                </TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      title="Détails"
                      className="text-[#F97316] hover:bg-[#FEF7CD]"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToTransactionDetails(transaction.id);
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    
                    {/* Actions basées sur le statut */}
                    {transaction.status === TransactionStatus.PENDING && (
                      <>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-[#43A047] hover:bg-[#C6EFD3]" 
                          title="Valider"
                          onClick={(e) => handleValidate(e, transaction.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-[#F97316] hover:bg-[#FEF7CD]" 
                          title="Annuler"
                          onClick={(e) => handleCancel(e, transaction.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {transaction.status === TransactionStatus.VALIDATED && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-[#F2C94C] hover:bg-[#FEF7CD]"
                        title="Compléter"
                        onClick={(e) => handleComplete(e, transaction.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Actions administrateur */}
                    {canEdit && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Modifier"
                          className="text-[#43A047] hover:bg-[#C6EFD3]"
                          onClick={(e) => handleEdit(e, transaction.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Supprimer"
                              className="text-[#F97316] hover:bg-[#FFE5E0]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la transaction</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer définitivement cette transaction ? 
                                Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(transaction.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
