import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, CheckCircle, FileText } from "lucide-react";
import { Transaction, TransactionStatus, UserRole } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { toast } from "@/components/ui/sonner";
import { TransactionReceipt } from "@/components/receipts/TransactionReceipt";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { TransactionService } from "@/services/TransactionService";
import { useAuth } from "@/context/AuthContext";

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (id) {
      loadTransaction(id);
      
      // Subscribe to real-time updates for this specific transaction
      const subscription = TransactionService.subscribeToTransactionChanges((updatedTransaction) => {
        if (updatedTransaction.id === id) {
          setTransaction(updatedTransaction);
        }
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [id]);

  const loadTransaction = async (transactionId: string) => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactionById(transactionId);
      
      if (data) {
        setTransaction(data);
      } else {
        toast.error("Transaction non trouvée");
        navigate("/transactions");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la transaction:", error);
      toast.error("Erreur lors du chargement de la transaction");
      navigate("/transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: TransactionStatus) => {
    if (!transaction) return;
    
    let action: "validate" | "complete" | "cancel";
    switch (newStatus) {
      case TransactionStatus.VALIDATED:
        action = "validate";
        break;
      case TransactionStatus.COMPLETED:
        action = "complete";
        break;
      case TransactionStatus.CANCELLED:
        action = "cancel";
        break;
      default:
        toast.error("Action non prise en charge");
        return;
    }
    
    try {
      const updatedTransaction = await TransactionService.updateTransactionStatus(
        transaction.id,
        newStatus,
        user?.name || "Admin User"
      );
      
      setTransaction(updatedTransaction);
      
      const actionMessages = {
        "validate": "validée",
        "complete": "complétée", 
        "cancel": "annulée"
      };
      
      toast.success(`Transaction ${actionMessages[action]} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const getVerificationUrl = (transaction: Transaction) => {
    const verificationData = {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt instanceof Date 
        ? transaction.createdAt.toISOString() 
        : new Date(transaction.createdAt).toISOString(),
      sender: transaction.sender.name,
      recipient: transaction.recipient.name,
    };
    
    const encodedData = btoa(JSON.stringify(verificationData));
    return `${window.location.origin}/verify?data=${encodedData}`;
  };

  const viewReceipt = () => {
    if (transaction) {
      setShowReceipt(true);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F97316]"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </AppLayout>
    );
  }

  if (!transaction) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg mb-4">Transaction non trouvée</p>
          <Button onClick={() => navigate("/transactions")}>Retour aux transactions</Button>
        </div>
      </AppLayout>
    );
  }

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/transactions")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Détails de la Transaction</h1>
              <p className="text-muted-foreground">
                ID: {transaction.id}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={viewReceipt}
            >
              <FileText className="mr-2 h-4 w-4" />
              Voir le reçu
            </Button>
            {transaction.status === TransactionStatus.PENDING && (
              <>
                <Button 
                  variant="outline" 
                  className="text-[#43A047] border-[#43A047] hover:bg-[#C6EFD3] hover:text-[#43A047]"
                  onClick={() => handleStatusChange(TransactionStatus.VALIDATED)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Valider
                </Button>
                <Button 
                  variant="outline" 
                  className="text-[#F97316] border-[#F97316] hover:bg-[#FEC6A1] hover:text-[#F97316]"
                  onClick={() => handleStatusChange(TransactionStatus.CANCELLED)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </>
            )}
            {transaction.status === TransactionStatus.VALIDATED && (
              <Button 
                variant="outline" 
                className="text-[#F2C94C] border-[#F2C94C] hover:bg-[#FEF7CD] hover:text-[#F2C94C]"
                onClick={() => handleStatusChange(TransactionStatus.COMPLETED)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Compléter
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la Transaction</CardTitle>
              <CardDescription>Détails et statut de la transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Statut:</span>
                {getStatusBadge(transaction.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Direction</p>
                  <p className="font-medium">
                    {transaction.direction === "kinshasa_to_dubai" 
                      ? "Kinshasa → Dubaï" 
                      : "Dubaï → Kinshasa"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    {' '}
                    {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="font-medium">
                    {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Commission ({transaction.commissionPercentage}%)</p>
                  <p className="font-medium">
                    {CURRENCY_SYMBOLS[transaction.currency]}{transaction.commissionAmount.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Montant total</p>
                  <p className="font-medium">
                    {CURRENCY_SYMBOLS[transaction.currency]}
                    {(transaction.amount + transaction.commissionAmount).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Mode de paiement</p>
                  <p className="font-medium">
                    {transaction.paymentMethod === "agency" ? "Agence" : "Mobile Money"}
                    {transaction.mobileMoneyNetwork && 
                      ` (${transaction.mobileMoneyNetwork})`}
                  </p>
                </div>
                
                {transaction.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{transaction.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'expéditeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{transaction.sender.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{transaction.sender.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {transaction.sender.idType === "passport" ? "Passeport" :
                     transaction.sender.idType === "id_card" ? "Carte d'identité" :
                     transaction.sender.idType === "driving_license" ? "Permis de conduire" :
                     "Pièce d'identité"}
                  </p>
                  <p className="font-medium">{transaction.sender.idNumber}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations du bénéficiaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{transaction.recipient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{transaction.recipient.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Reçu de la transaction</DialogTitle>
            </DialogHeader>
            {transaction && (
              <TransactionReceipt 
                transaction={transaction} 
                verificationUrl={getVerificationUrl(transaction)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default TransactionDetail;
