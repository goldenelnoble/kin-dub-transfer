
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Transaction } from "@/types";
import { TransactionService } from "@/services/TransactionService";
import { toast } from "@/components/ui/sonner";
import { TransactionReceipt } from "@/components/receipts/TransactionReceipt";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");

  useEffect(() => {
    // Vérifier si on a des données de QR code dans l'URL
    const data = searchParams.get('data');
    const code = searchParams.get('code');
    
    if (data) {
      verifyFromQRData(data);
    } else if (code) {
      setTransactionCode(code);
      verifyTransaction(code);
    }
  }, [searchParams]);

  const verifyFromQRData = async (data: string) => {
    try {
      setLoading(true);
      // Décoder les données du QR code (Base64)
      const decodedData = JSON.parse(atob(data));
      
      if (decodedData.id) {
        await verifyTransaction(decodedData.id);
      } else {
        setIsVerified(false);
        setError("Données de QR code invalides");
      }
    } catch (error) {
      console.error("Erreur lors du décodage du QR:", error);
      setIsVerified(false);
      setError("QR code invalide ou corrompu");
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const foundTransaction = await TransactionService.getTransactionById(code);

      if (foundTransaction) {
        setIsVerified(true);
        setTransaction(foundTransaction);
      } else {
        setIsVerified(false);
        setError("Transaction non trouvée dans le système");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      setIsVerified(false);
      setError("Erreur lors de la recherche de la transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!transactionCode.trim()) {
      toast.error("Veuillez saisir un code de transaction");
      return;
    }
    verifyTransaction(transactionCode.trim());
  };

  const handleViewDetails = () => {
    if (transaction) {
      navigate(`/transactions/${transaction.id}`);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
            alt="Golden El Nobles Cargo" 
            className="h-16 mx-auto mb-4" 
          />
          <CardTitle className="text-2xl font-bold">Vérification de Transaction</CardTitle>
          <p className="text-muted-foreground">
            Entrez le code de transaction ou scannez le QR code
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zone de recherche manuelle */}
          <div className="flex space-x-2">
            <Input
              placeholder="Entrez le code de transaction (ex: ABC123)"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {/* Résultats de la vérification */}
          {loading && (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Vérification en cours...</p>
            </div>
          )}

          {isVerified === true && transaction && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-green-600">Transaction Trouvée</h2>
                <p className="text-muted-foreground">
                  Transaction vérifiée et enregistrée dans notre système.
                </p>
              </div>
              
              {/* Aperçu du reçu */}
              <div className="border rounded-lg p-4 bg-green-50">
                <TransactionReceipt 
                  transaction={transaction} 
                  verificationUrl={getVerificationUrl(transaction)} 
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleViewDetails} className="bg-[#F2C94C] text-black hover:bg-[#DBA32A]">
                  Voir les détails complets
                </Button>
              </div>
            </div>
          )}

          {isVerified === false && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-red-600">Transaction Non Trouvée</h2>
                <p className="text-muted-foreground">
                  {error || "Cette transaction n'existe pas dans notre système."}
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
