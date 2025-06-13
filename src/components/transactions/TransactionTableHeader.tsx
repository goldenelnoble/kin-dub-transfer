
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead className="font-semibold">ID</TableHead>
        <TableHead className="font-semibold">Direction</TableHead>
        <TableHead className="font-semibold">Montant</TableHead>
        <TableHead className="font-semibold">Expéditeur</TableHead>
        <TableHead className="font-semibold">Bénéficiaire</TableHead>
        <TableHead className="font-semibold">Date</TableHead>
        <TableHead className="font-semibold">Statut</TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
