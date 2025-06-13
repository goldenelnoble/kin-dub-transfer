
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-100 transition-colors">
        <TableHead className="font-semibold text-gray-700 py-4">ID Transaction</TableHead>
        <TableHead className="font-semibold text-gray-700">Type</TableHead>
        <TableHead className="font-semibold text-gray-700">Montant</TableHead>
        <TableHead className="font-semibold text-gray-700">Expéditeur</TableHead>
        <TableHead className="font-semibold text-gray-700">Bénéficiaire</TableHead>
        <TableHead className="font-semibold text-gray-700">Date</TableHead>
        <TableHead className="font-semibold text-gray-700">Statut</TableHead>
        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
