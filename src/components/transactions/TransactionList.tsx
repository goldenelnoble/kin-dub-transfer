
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
import { Check, Filter, Info, Search, X, CheckCircle } from "lucide-react";
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
  const [directionFilter, setDirectionFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      try {
        const parsedTransactions = JSON.parse(storedTransactions).map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt),
          updatedAt: new Date(tx.updatedAt),
          validatedAt: tx.validatedAt ? new Date(tx.validatedAt) : undefined
        }));
        
        const validTransactions = parsedTransactions.map((tx: any): Transaction => {
          return {
            ...tx,
            receivingAmount: tx.receivingAmount || tx.amount,
            commissionPercentage: tx.commissionPercentage || 3.5,
            paymentMethod: tx.paymentMethod || PaymentMethod.AGENCY,
            updatedAt: tx.updatedAt || new Date(),
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
        
        setTransactions([...validTransactions, ...getInitialTransactions()]);
      } catch (error) {
        console.error("Erreur lors du parsing des transactions:", error);
        setTransactions(getInitialTransactions());
        toast.error("Erreur lors du chargement des transactions");
      }
    } else {
      setTransactions(getInitialTransactions());
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    const now = new Date();
    
    const updatedTransactions = transactions.map(tx => {
      if (tx.id === id) {
        const updated = { 
          ...tx, 
          status: newStatus,
          updatedAt: now
        };
        
        if (newStatus === TransactionStatus.VALIDATED || newStatus === TransactionStatus.COMPLETED) {
          updated.validatedBy = "Admin User";
          updated.validatedAt = now;
        }
        
        return updated;
      }
      return tx;
    });
    
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    const statusMessages = {
      [TransactionStatus.VALIDATED]: "Transaction validée !",
      [TransactionStatus.COMPLETED]: "Transaction complétée !",
      [TransactionStatus.CANCELLED]: "Transaction annulée !"
    };
    
    if (statusMessages[newStatus]) {
      toast[newStatus === TransactionStatus.CANCELLED ? "error" : "success"](statusMessages[newStatus], {
        description: `La transaction ${id} a été ${newStatus === TransactionStatus.CANCELLED ? 'annulée' : 'mise à jour'}`
      });
    }
  };

  const filterTransactions = (transactions: Transaction[]) => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      const matchesDirection = directionFilter === "all" || transaction.direction === directionFilter;
      const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter;
      const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
      
      let matchesDate = true;
      const today = new Date();
      const txDate = new Date(transaction.createdAt);
      
      switch (dateFilter) {
        case "today":
          matchesDate = txDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = txDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          matchesDate = txDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesDirection && matchesCurrency && 
             matchesPaymentMethod && matchesDate;
    });
  };

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

  const filteredTransactions = filterTransactions(transactions);
  
  // Calculate statistics for all transactions
  const stats = {
    total: filteredTransactions.length,
    pending: filteredTransactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
    validated: filteredTransactions.filter(tx => tx.status === TransactionStatus.VALIDATED).length,
    completed: filteredTransactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length,
    cancelled: filteredTransactions.filter(tx => tx.status === TransactionStatus.CANCELLED).length,
    totalAmount: filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0),
    totalCommission: filteredTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toutes les Transactions</CardTitle>
        <CardDescription>Liste complète des transactions avec filtres</CardDescription>
        
        <div className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="bg-[#f3f4f6] p-2 rounded-md text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">
              {currencyFilter === "all" ? "Montant total" : `Total en ${currencyFilter}`}:
              {stats.totalAmount.toLocaleString()} 
            </div>
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
            <div className="text-sm text-muted-foreground">
              Commission: {stats.totalCommission.toLocaleString()}
            </div>
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
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
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
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les directions</SelectItem>
                  <SelectItem value={TransactionDirection.KINSHASA_TO_DUBAI}>Kinshasa → Dubaï</SelectItem>
                  <SelectItem value={TransactionDirection.DUBAI_TO_KINSHASA}>Dubaï → Kinshasa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les devises</SelectItem>
                  <SelectItem value={Currency.USD}>USD</SelectItem>
                  <SelectItem value={Currency.EUR}>EUR</SelectItem>
                  <SelectItem value={Currency.AED}>AED</SelectItem>
                  <SelectItem value={Currency.CDF}>CDF</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les moyens</SelectItem>
                  <SelectItem value={PaymentMethod.AGENCY}>Agence</SelectItem>
                  <SelectItem value={PaymentMethod.MOBILE_MONEY}>Mobile Money</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute période</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Détails"
                            className="text-[#F97316] hover:bg-[#FEF7CD]"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          {transaction.status === TransactionStatus.PENDING && (
                            <>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-[#43A047] hover:bg-[#C6EFD3]" 
                                title="Valider"
                                onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.VALIDATED)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
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
