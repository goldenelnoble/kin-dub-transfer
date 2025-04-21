
import { useState } from "react";
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
  Currency 
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { Check, Info, Search, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Sample transaction data (move to local state)
const getInitialTransactions = () => [
  {
    id: "TXN123456",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 5000,
    currency: Currency.USD,
    commissionAmount: 175,
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Jean Lumumba",
      phone: "+243 123456789"
    },
    recipient: {
      name: "Mohammed Ali",
      phone: "+971 501234567"
    },
    createdAt: new Date(2023, 3, 15, 10, 30),
    createdBy: "Operator User"
  },
  {
    id: "TXN123457",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 3000,
    currency: Currency.USD,
    commissionAmount: 90,
    status: TransactionStatus.PENDING,
    sender: {
      name: "Abdullah Mohammed",
      phone: "+971 501234567"
    },
    recipient: {
      name: "Marie Kabila",
      phone: "+243 987654321"
    },
    createdAt: new Date(2023, 3, 16, 11, 45),
    createdBy: "Supervisor User"
  },
  {
    id: "TXN123458",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 2500,
    currency: Currency.EUR,
    commissionAmount: 87.5,
    status: TransactionStatus.CANCELLED,
    sender: {
      name: "Paul Mutombo",
      phone: "+243 234567890"
    },
    recipient: {
      name: "Rashed Ahmed",
      phone: "+971 502345678"
    },
    createdAt: new Date(2023, 3, 17, 9, 15),
    createdBy: "Operator User"
  },
  {
    id: "TXN123459",
    direction: TransactionDirection.KINSHASA_TO_DUBAI,
    amount: 7500,
    currency: Currency.USD,
    commissionAmount: 262.5,
    status: TransactionStatus.VALIDATED,
    sender: {
      name: "Claude Makiese",
      phone: "+243 345678901"
    },
    recipient: {
      name: "Saeed Al Mansouri",
      phone: "+971 503456789"
    },
    createdAt: new Date(2023, 3, 18, 14, 20),
    createdBy: "Operator User"
  },
  {
    id: "TXN123460",
    direction: TransactionDirection.DUBAI_TO_KINSHASA,
    amount: 4000,
    currency: Currency.AED,
    commissionAmount: 120,
    status: TransactionStatus.COMPLETED,
    sender: {
      name: "Fatima Ali",
      phone: "+971 504567890"
    },
    recipient: {
      name: "Jean-Marc Kabongo",
      phone: "+243 456789012"
    },
    createdAt: new Date(2023, 3, 19, 16, 30),
    createdBy: "Supervisor User"
  }
];

export function TransactionList() {
  const [transactions, setTransactions] = useState(getInitialTransactions());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");

  // Handler for updating transaction status
  const handleUpdateStatus = (id: string, newStatus: TransactionStatus) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id ? { ...tx, status: newStatus } : tx
      )
    );
    if (newStatus === TransactionStatus.VALIDATED || newStatus === TransactionStatus.COMPLETED) {
      toast.success("Transaction validée !");
    }
    if (newStatus === TransactionStatus.CANCELLED) {
      toast.error("Transaction annulée !");
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
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case TransactionStatus.VALIDATED:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Validée</Badge>;
      case TransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Complétée</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getDirectionLabel = (direction: TransactionDirection) => {
    return direction === TransactionDirection.KINSHASA_TO_DUBAI
      ? "Kinshasa → Dubaï"
      : "Dubaï → Kinshasa";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions récentes</CardTitle>
        <CardDescription>
          Liste des transactions récentes dans le système
        </CardDescription>
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
                          <Button size="icon" variant="ghost" title="Détails">
                            <Info className="h-4 w-4" />
                          </Button>
                          {transaction.status === TransactionStatus.PENDING && (
                            <>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-green-600" 
                                title="Valider"
                                onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.VALIDATED)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-red-600" 
                                title="Annuler"
                                onClick={() => handleUpdateStatus(transaction.id, TransactionStatus.CANCELLED)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
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
        </div>
      </CardContent>
    </Card>
  );
}

