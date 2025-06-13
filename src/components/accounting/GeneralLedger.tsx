
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TransactionService } from "@/services/TransactionService";
import { Transaction, TransactionStatus } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { Search, Filter } from "lucide-react";

interface LedgerEntry {
  id: string;
  date: Date;
  description: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
  status: TransactionStatus;
}

export function GeneralLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    generateLedgerEntries();
  }, [transactions]);

  useEffect(() => {
    filterEntries();
  }, [ledgerEntries, searchTerm, accountFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateLedgerEntries = () => {
    const entries: LedgerEntry[] = [];
    let runningBalance = 0;

    transactions
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach((transaction) => {
        // Entrée pour le montant principal (Caisse/Banque)
        if (transaction.status === TransactionStatus.COMPLETED) {
          runningBalance += transaction.amount;
          entries.push({
            id: `${transaction.id}-main`,
            date: new Date(transaction.createdAt),
            description: `Transfert ${transaction.direction === 'kinshasa_to_dubai' ? 'KIN→DXB' : 'DXB→KIN'} - ${transaction.sender.name}`,
            account: "41100 - Revenus de Transfert",
            debit: transaction.amount,
            credit: 0,
            balance: runningBalance,
            reference: transaction.id,
            status: transaction.status
          });

          // Entrée pour la commission (Revenus)
          runningBalance += transaction.commissionAmount;
          entries.push({
            id: `${transaction.id}-commission`,
            date: new Date(transaction.createdAt),
            description: `Commission ${transaction.commissionPercentage}% - ${transaction.sender.name}`,
            account: "41200 - Revenus de Commission",
            debit: transaction.commissionAmount,
            credit: 0,
            balance: runningBalance,
            reference: transaction.id,
            status: transaction.status
          });
        } else if (transaction.status === TransactionStatus.CANCELLED) {
          // Entrée pour les transactions annulées
          entries.push({
            id: `${transaction.id}-cancelled`,
            date: new Date(transaction.createdAt),
            description: `Transaction annulée - ${transaction.sender.name}`,
            account: "41900 - Transactions Annulées",
            debit: 0,
            credit: 0,
            balance: runningBalance,
            reference: transaction.id,
            status: transaction.status
          });
        }
      });

    setLedgerEntries(entries);
  };

  const filterEntries = () => {
    let filtered = ledgerEntries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (accountFilter !== "all") {
      filtered = filtered.filter(entry => entry.account.includes(accountFilter));
    }

    setFilteredEntries(filtered);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-[#43A047]/20 text-[#43A047]">Comptabilisé</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-[#FEC6A1] text-[#F97316]">Annulé</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#43A047]"></div>
        <span className="ml-2">Chargement du grand livre...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047] flex items-center space-x-2">
            <span>Grand Livre Général</span>
          </CardTitle>
          <CardDescription>
            Enregistrement chronologique de toutes les écritures comptables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans le grand livre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par compte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les comptes</SelectItem>
                <SelectItem value="41100">41100 - Revenus de Transfert</SelectItem>
                <SelectItem value="41200">41200 - Revenus de Commission</SelectItem>
                <SelectItem value="41900">41900 - Transactions Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table du grand livre */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#43A047]/10">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                  <TableHead className="text-right">Solde</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-gray-50">
                    <TableCell>
                      {entry.date.toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={entry.description}>
                        {entry.description}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.account}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {entry.debit > 0 ? `${entry.debit.toLocaleString()} USD` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {entry.credit > 0 ? `${entry.credit.toLocaleString()} USD` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-[#43A047]">
                      {entry.balance.toLocaleString()} USD
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {entry.reference.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(entry.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune écriture trouvée pour les critères sélectionnés
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
