
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction, TransactionStatus } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

interface RecentTransactionsAccountingProps {
  transactions: Transaction[];
}

export function RecentTransactionsAccounting({ transactions }: RecentTransactionsAccountingProps) {
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return <Badge variant="outline" className="bg-[#FEF3CF] text-[#F7C33F]">En attente</Badge>;
      case TransactionStatus.VALIDATED:
        return <Badge variant="outline" className="bg-[#F2C94C]/20 text-[#F7C33F]">Validée</Badge>;
      case TransactionStatus.COMPLETED:
        return <Badge variant="outline" className="bg-[#43A047]/20 text-[#43A047]">Complétée</Badge>;
      case TransactionStatus.CANCELLED:
        return <Badge variant="outline" className="bg-[#FEC6A1] text-[#F97316]">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-[#43A047]">Transactions Récentes</CardTitle>
        <CardDescription>Dernières transactions pour analyse comptable</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Impact Comptable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-[#43A047] font-medium">
                  +{CURRENCY_SYMBOLS[transaction.currency]}{transaction.commissionAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell>
                  {transaction.status === TransactionStatus.COMPLETED ? (
                    <span className="text-green-600 text-sm">✓ Revenus comptabilisés</span>
                  ) : transaction.status === TransactionStatus.PENDING ? (
                    <span className="text-amber-600 text-sm">⏳ En attente</span>
                  ) : transaction.status === TransactionStatus.CANCELLED ? (
                    <span className="text-red-600 text-sm">✗ Aucun impact</span>
                  ) : (
                    <span className="text-blue-600 text-sm">📋 Validée</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
