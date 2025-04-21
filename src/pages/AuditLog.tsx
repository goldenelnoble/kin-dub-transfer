
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

const auditEntries = [
  { id: 1, action: "Création de transaction", user: "Jean Mwamba", date: "2025-04-20 14:32", status: "Succès" },
  { id: 2, action: "Annulation de transaction", user: "Fatima K.", date: "2025-04-19 17:40", status: "Succès" },
  { id: 3, action: "Connexion utilisateur", user: "Salima B.", date: "2025-04-19 09:12", status: "Succès" },
  { id: 4, action: "Suppression de rapport", user: "Jean Mwamba", date: "2025-04-18 11:24", status: "Annulé" },
];

const statusColors: Record<string, string> = {
  "Succès": "text-[#43A047]",
  "Annulé": "text-red-500",
};

export default function AuditLog() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <History className="h-10 w-10 text-[#43A047]" />
          <div>
            <h1 className="text-3xl font-bold text-[#43A047]">Journal d'Audit</h1>
            <p className="text-[#F97316]">
              Suivi détaillé des actions et événements pour la sécurité et la conformité.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow space-y-6">
          <h2 className="text-xl font-semibold text-[#43A047]">Historique des événements</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="text-[#F2C94C]">{entry.date}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell className={statusColors[entry.status]}>{entry.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="border-[#43A047] text-[#43A047] hover:bg-[#F2C94C]">Détail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
