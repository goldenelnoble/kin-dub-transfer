
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDown, ArrowUp, FileText, Trash2 } from "lucide-react";
import { TransactionReceipt } from "@/components/receipts/TransactionReceipt";
import { Transaction, UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/services/TransactionService";
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

const Receipts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Charger les transactions depuis la base de données
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const fetchedTransactions = await TransactionService.getAllTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Erreur lors du chargement des transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filtrer les transactions en fonction de la recherche
  const filteredTransactions = transactions.filter((tx: Transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tx.id.toLowerCase().includes(searchLower) ||
      tx.sender.name.toLowerCase().includes(searchLower) ||
      tx.recipient.name.toLowerCase().includes(searchLower) ||
      tx.amount.toString().includes(searchQuery)
    );
  });

  // Trier les transactions par date
  const sortedTransactions = [...filteredTransactions].sort((a: Transaction, b: Transaction) => {
    if (sortDirection === "asc") {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setActiveTab("receipt");
    toast.success("Reçu généré avec succès");
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user || user.role !== UserRole.ADMIN) {
      toast.error("Seul un administrateur peut supprimer des reçus.");
      return;
    }

    try {
      await TransactionService.deleteTransaction(transactionId);
      
      // Mettre à jour l'état local
      setTransactions(prevTransactions => 
        prevTransactions.filter(tx => tx.id !== transactionId)
      );
      
      // Si la transaction supprimée était sélectionnée, revenir à la liste
      if (selectedTransaction && selectedTransaction.id === transactionId) {
        setSelectedTransaction(null);
        setActiveTab("list");
      }
      
      toast.success("Reçu supprimé avec succès");
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error("Erreur lors de la suppression du reçu");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Génère l'URL de vérification pour l'application actuelle
  const getVerificationUrl = (transaction: Transaction) => {
    const verificationData = {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt.toISOString(),
      sender: transaction.sender.name,
      recipient: transaction.recipient.name,
    };
    
    // Create a base64 encoded verification string
    const encodedData = btoa(JSON.stringify(verificationData));
    
    // Use the current origin for verification instead of hardcoded domain
    return `${window.location.origin}/verify?data=${encodedData}`;
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reçus</h1>
            <p className="text-muted-foreground">
              Générez et imprimez des reçus pour toutes vos transactions
            </p>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p>Chargement des transactions...</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reçus</h1>
          <p className="text-muted-foreground">
            Générez et imprimez des reçus pour toutes vos transactions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list">Liste des Transactions</TabsTrigger>
            <TabsTrigger value="receipt" disabled={!selectedTransaction}>Reçu</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Rechercher par ID, nom, montant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                className="flex-shrink-0"
              >
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 pl-4">ID</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Expéditeur</th>
                    <th className="text-left p-2">Destinataire</th>
                    <th className="text-left p-2">Montant</th>
                    <th className="text-center p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((tx: Transaction) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 pl-4">{tx.id.substring(0, 8)}...</td>
                        <td className="p-2">{formatDate(tx.createdAt)}</td>
                        <td className="p-2">{tx.sender.name}</td>
                        <td className="p-2">{tx.recipient.name}</td>
                        <td className="p-2">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSelectTransaction(tx)}
                              title="Voir le reçu"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Supprimer le reçu"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer le reçu</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer définitivement ce reçu ? 
                                      Cette action ne peut pas être annulée.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteTransaction(tx.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        Aucune transaction trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="receipt">
            {selectedTransaction ? (
              <TransactionReceipt 
                transaction={selectedTransaction} 
                verificationUrl={getVerificationUrl(selectedTransaction)} 
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Sélectionnez une transaction pour afficher son reçu.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Receipts;
