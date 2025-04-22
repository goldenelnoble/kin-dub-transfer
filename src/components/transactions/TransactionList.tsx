import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  TransactionDirection, 
  TransactionStatus, 
  Currency,
  Transaction,
  PaymentMethod
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { Check, Info, Search, X, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Sample transaction data (move to local state)
const getInitialTransactions = (): Transaction[] => [
  {
    id: "TXN123456",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 5000,
    receivingAmount: 5000,
    currency: Currency.USD,
    commissionPercentage: 3.5,
    commissionAmount: 175,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Jean Lumumba",
      phone: "+243 123456789",
      idNumber: "KIN12345",
      idType: "Passport"
    },
    recipient: {
      name: "Mohammed Ali",
      phone: "+971 501234567",
      idNumber: "UAE45678",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 15, 10, 30),
    updatedAt: new Date(2023, 3, 15, 12, 30),
    createdBy: "Operator User"
  },
  {
    id: "TXN123457",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 3000,
    receivingAmount: 3000,
    currency: Currency.USD,
    commissionPercentage: 3.0,
    commissionAmount: 90,
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    mobileMoneyNetwork: "M-Pesa",
    status: TransactionStatus.PENDING,
    sender: {
      name: "Abdullah Mohammed",
      phone: "+971 501234567",
      idNumber: "UAE78901",
      idType: "Passport"
    },
    recipient: {
      name: "Marie Kabila",
      phone: "+243 987654321",
      idNumber: "KIN67890",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 16, 11, 45),
    updatedAt: new Date(2023, 3, 16, 11, 45),
    createdBy: "Supervisor User"
  },
  {
    id: "TXN123458",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 2500,
    receivingAmount: 2500,
    currency: Currency.EUR,
    commissionPercentage: 3.5,
    commissionAmount: 87.5,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.CANCELLED,
    sender: {
      name: "Paul Mutombo",
      phone: "+243 234567890",
      idNumber: "KIN23456",
      idType: "Passport"
    },
    recipient: {
      name: "Rashed Ahmed",
      phone: "+971 502345678",
      idNumber: "UAE56789",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 17, 9, 15),
    updatedAt: new Date(2023, 3, 17, 10, 30),
    createdBy: "Operator User"
  },
  {
    id: "TXN123459",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 7500,
    receivingAmount: 7500,
    currency: Currency.USD,
    commissionPercentage: 3.5,
    commissionAmount: 262.5,
    paymentMethod: PaymentMethod.AGENCY,
    status: TransactionStatus.VALIDATED,
    sender: {
      name: "Claude Makiese",
      phone: "+243 345678901",
      idNumber: "KIN34567",
      idType: "Passport"
    },
    recipient: {
      name: "Saeed Al Mansouri",
      phone: "+971 503456789",
      idNumber: "UAE67890",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 18, 14, 20),
    updatedAt: new Date(2023, 3, 18, 16, 45),
    createdBy: "Operator User"
  },
  {
    id: "TXN123460",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 4000,
    receivingAmount: 4000,
    currency: Currency.AED,
    commissionPercentage: 3.0,
    commissionAmount: 120,
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    mobileMoneyNetwork: "Orange Money",
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Fatima Ali",
      phone: "+971 504567890",
      idNumber: "UAE78901",
      idType: "Passport"
    },
    recipient: {
      name: "Jean-Marc Kabongo",
      phone: "+243 456789012",
      idNumber: "KIN45678",
      idType: "ID Card"
    },
    createdAt: new Date(2023, 3, 19, 16, 30),
    updatedAt: new Date(2023, 3, 19, 18, 45),
    createdBy: "Supervisor User"
  }
];

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState(() => {
    const url = new URL(window.location.href);
    const dir = url.searchParams.get("direction");
    if (dir === "kinshasa_to_dubai" || dir === "dubai_to_kinshasa") return dir;
    return "all";
  });

  // Charger les transactions au chargement du composant
  useEffect(() => {
    // Récupérer les transactions du localStorage
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      try {
        // Convertir les dates string en objets Date
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        // S'assurer que toutes les propriétés requises sont présentes
        const validTransactions = parsedTransactions.map((tx: any): Transaction => {
          // Ajouter les propriétés manquantes si nécessaire
          return {
            ...tx,
            receivingAmount: tx.receivingAmount || tx.amount,
            commissionPercentage: tx.commissionPercentage || 3.5,
            paymentMethod: tx.paymentMethod || PaymentMethod.AGENCY,
            updatedAt: tx.updatedAt || new Date(),
            // S'assurer que sender et recipient ont tous les champs requis
            sender: {
              name: tx.sender?.name || "",
              phone: tx.sender?.phone || "",
              idNumber: tx.sender?.idNumber || "",
              idType: tx.sender?.idType || ""
            },
            recipient: {
              name: tx.recipient?.name || "",
              phone: tx.recipient?.phone || "",
              idNumber: tx.recipient?.idNumber || "",
              idType: tx.recipient?.idType || ""
            }
          };
        });
        
        // Combiner avec les transactions initiales
        setTransactions([...validTransactions, ...getInitialTransactions()]);
      } catch (error) {
        console.error("Erreur lors du parsing des transactions:", error);
        // En cas d'erreur, utiliser les transactions initiales
        setTransactions(getInitialTransactions());
        toast.error("Erreur lors du chargement des transactions");
      }
    } else {
      // Si aucune transaction n'est dans le localStorage, utiliser les transactions initiales
      setTransactions(getInitialTransactions());
    }
  }, []);

  // Handler pour mettre à jour le statut d'une transaction
  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    const now = new Date();
    
    // Mettre à jour la transaction dans le state
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === id) {
        const updated = { 
          ...tx, 
          status: newStatus,
          updatedAt: now
        };
        
        // Ajouter les informations de validation si la transaction est validée ou complétée
        if (newStatus === TransactionStatus.VALIDATED || newStatus === TransactionStatus.COMPLETED) {
          updated.validatedBy = "Admin User";
          updated.validatedAt = now;
        }
        
        return updated;
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    
    // Mettre à jour le localStorage
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Afficher une notification appropriée
    if (newStatus === TransactionStatus.VALIDATED) {
      toast.success("Transaction validée !", {
        description: `La transaction ${id} a été validée`
      });
    } else if (newStatus === TransactionStatus.COMPLETED) {
      toast.success("Transaction complétée !", {
        description: `La transaction ${id} a été marquée comme complétée`
      });
    } else if (newStatus === TransactionStatus.CANCELLED) {
      toast.error("Transaction annulée !", {
        description: `La transaction ${id} a été annulée`
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    const matchesDirection = directionFilter === "all" || transaction.direction === directionFilter;
    
    return matchesSearch && matchesStatus && matchesDirection;
  });

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

  // Calculer les statistiques pour les différents statuts
  const stats = {
    total: filteredTransactions.length,
    pending: filteredTransactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
    validated: filteredTransactions.filter(tx => tx.status === TransactionStatus.VALIDATED).length,
    completed: filteredTransactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length,
    cancelled: filteredTransactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Transactions récentes
        </CardTitle>
        <CardDescription>
          Liste des transactions récentes dans le système
        </CardDescription>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="bg-[#f3f4f6] p-2 rounded-md text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-bold">{stats.total}</div>
          </div>
          <div className="bg-[#FEF3CF] p-2 rounded-md text-center">
            <div className="text-sm text-[#F7C33F]">En attente</div>
            <div className="text-lg font-bold text-[#F7C33F]">{stats.pending}</div>
          </div>
          <div className="bg-[#F2C94C]/20 p-2 rounded-md text-center">
            <div className="text-sm text-[#F7C33F]">Validées</div>
            <div className="text-lg font-bold text-[#F7C33F]">{stats.validated}</div>
          </div>
          <div className="bg-[#43A047]/20 p-2 rounded-md text-center">
            <div className="text-sm text-[#43A047]">Complétées</div>
            <div className="text-lg font-bold text-[#43A047]">{stats.completed}</div>
          </div>
          <div className="bg-[#FEC6A1] p-2 rounded-md text-center">
            <div className="text-sm text-[#F97316]">Annulées</div>
            <div className="text-lg font-bold text-[#F97316]">{stats.cancelled}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, expéditeur ou bénéficiaire..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={TransactionStatus.PENDING}>En attente</SelectItem>
                <SelectItem value={TransactionStatus.VALIDATED}>Validée</SelectItem>
                <SelectItem value={TransactionStatus.COMPLETED}>Complétée</SelectItem>
                <SelectItem value={TransactionStatus.CANCELLED}>Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les directions</SelectItem>
                <SelectItem value={TransactionDirection.KINSHASA_TO_DUBAI}>Kinshasa → Dubaï</SelectItem>
                <SelectItem value={TransactionDirection.DUBAI_TO_KINSHASA}>Dubaï → Kinshasa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableCaption>Liste des transactions récentes</TableCaption>
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
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Aucune transaction trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{getDirectionLabel(transaction.direction)}</TableCell>
                      <TableCell>
                        {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
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
                        {transaction.createdAt.toLocaleDateString('fr-FR')}
                        <div className="text-sm text-muted-foreground">
                          {transaction.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="icon" variant="ghost" title="Détails"
                            className="text-[#F97316] hover:bg-[#FEF7CD]"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          {transaction.status === TransactionStatus.PENDING && (
                            <>
                              {/* Valider */}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-[#43A047] hover:bg-[#C6EFD3]" 
                                title="Valider"
                                onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.VALIDATED)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              {/* Annuler */}
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-[#F97316] hover:bg-[#FEF7CD]" 
                                title="Annuler"
                                onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.CANCELLED)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {transaction.status === TransactionStatus.VALIDATED && (
                            // Compléter
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-[#F2C94C] hover:bg-[#FEF7CD]"
                              title="Compléter"
                              onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.COMPLETED)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
