
import { Button } from "@/components/ui/button";
import { Info, Check, X, CheckCircle, Trash2, Edit } from "lucide-react";
import { TransactionStatus } from "@/types";
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

interface TransactionTableActionsProps {
  transactionId: string;
  status: TransactionStatus;
  canEdit: boolean;
  onUpdateStatus: (id: string, status: TransactionStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onGoToDetails: (id: string) => void;
}

export function TransactionTableActions({
  transactionId,
  status,
  canEdit,
  onUpdateStatus,
  onEdit,
  onDelete,
  onGoToDetails
}: TransactionTableActionsProps) {
  const handleValidate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.VALIDATED);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.COMPLETED);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(transactionId, TransactionStatus.CANCELLED);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(transactionId);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transactionId);
    }
  };

  return (
    <div className="flex justify-end space-x-1">
      <Button 
        size="icon" 
        variant="ghost" 
        title="Détails"
        className="h-8 w-8 text-[#F97316] hover:bg-[#FEF7CD]"
        onClick={(e) => {
          e.stopPropagation();
          onGoToDetails(transactionId);
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
      
      {/* Actions basées sur le statut */}
      {status === TransactionStatus.PENDING && (
        <>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-[#43A047] hover:bg-[#C6EFD3]" 
            title="Valider"
            onClick={handleValidate}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-[#F97316] hover:bg-[#FEF7CD]" 
            title="Annuler"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {status === TransactionStatus.VALIDATED && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-[#F2C94C] hover:bg-[#FEF7CD]"
          title="Compléter"
          onClick={handleComplete}
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
            className="h-8 w-8 text-[#43A047] hover:bg-[#C6EFD3]"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                title="Supprimer"
                className="h-8 w-8 text-[#F97316] hover:bg-[#FFE5E0]"
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
                  onClick={handleDelete}
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
  );
}
