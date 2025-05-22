
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { Transaction } from "@/types";
import { formatDate } from "@/lib/utils";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        // Récupérer les données de la transaction depuis le paramètre d'URL
        const data = searchParams.get('data');
        
        if (!data) {
          setIsVerified(false);
          setError("Données de vérification manquantes");
          return;
        }

        // Décoder les données de la transaction (Base64)
        const decodedData = JSON.parse(atob(data));
        
        // Récupérer les transactions depuis le localStorage
        const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        // Rechercher la transaction correspondante
        const foundTransaction = storedTransactions.find(
          (t: any) => t.id === decodedData.id
        );

        if (!foundTransaction) {
          setIsVerified(false);
          setError("Transaction non trouvée dans le système");
          return;
        }

        // Vérifier si les données correspondent
        const isValid = 
          foundTransaction.id === decodedData.id &&
          foundTransaction.amount === decodedData.amount &&
          foundTransaction.currency === decodedData.currency;

        if (isValid) {
          setIsVerified(true);
          setTransaction({
            ...foundTransaction,
            createdAt: new Date(foundTransaction.createdAt),
            updatedAt: new Date(foundTransaction.updatedAt),
            validatedAt: foundTransaction.validatedAt ? new Date(foundTransaction.validatedAt) : undefined
          });
        } else {
          setIsVerified(false);
          setError("Les données de la transaction ne correspondent pas");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        setIsVerified(false);
        setError("Erreur lors de la vérification du reçu");
      }
    };

    verifyTransaction();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
            alt="Golden El Nobles Cargo" 
            className="h-16 mx-auto mb-4" 
          />
          <CardTitle className="text-2xl font-bold">Vérification de l'Authenticité du Reçu</CardTitle>
        </CardHeader>
        <CardContent>
          {isVerified === null ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Vérification en cours...</p>
            </div>
          ) : isVerified ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-green-600">Reçu Authentique</h2>
                <p className="text-muted-foreground">
                  Ce reçu est vérifié et enregistré dans notre système.
                </p>
              </div>
              {transaction && (
                <div className="border rounded-lg p-4 mt-4 bg-green-50">
                  <h3 className="font-semibold text-lg mb-2">Détails de la Transaction</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-muted-foreground">ID:</p>
                    <p className="text-sm font-medium">{transaction.id}</p>
                    
                    <p className="text-sm text-muted-foreground">Date:</p>
                    <p className="text-sm font-medium">{formatDate(transaction.createdAt)}</p>
                    
                    <p className="text-sm text-muted-foreground">Montant:</p>
                    <p className="text-sm font-medium">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">Expéditeur:</p>
                    <p className="text-sm font-medium">{transaction.sender.name}</p>
                    
                    <p className="text-sm text-muted-foreground">Destinataire:</p>
                    <p className="text-sm font-medium">{transaction.recipient.name}</p>
                    
                    <p className="text-sm text-muted-foreground">Statut:</p>
                    <p className="text-sm font-medium">{transaction.status}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-red-600">Reçu Non Authentique</h2>
                <p className="text-muted-foreground">
                  {error || "Ce reçu n'a pas pu être vérifié dans notre système."}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link to="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
