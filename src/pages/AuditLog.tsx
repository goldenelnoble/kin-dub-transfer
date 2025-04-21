
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const auditEntries = [
  { id: 1, action: "Création de transaction", user: "Jean Mwamba", date: "2025-04-20 14:32", status: "Succès", details: "Transaction #TRX-001 a été créée avec succès pour 80 000 XAF." },
  { id: 2, action: "Annulation de transaction", user: "Fatima K.", date: "2025-04-19 17:40", status: "Succès", details: "Transaction #TRX-002 a bien été annulée." },
  { id: 3, action: "Connexion utilisateur", user: "Salima B.", date: "2025-04-19 09:12", status: "Succès", details: "Connexion depuis IP 193.182.22.41." },
  { id: 4, action: "Suppression de rapport", user: "Jean Mwamba", date: "2025-04-18 11:24", status: "Annulé", details: "Tentative de suppression du rapport #RPT-003 refusée." },
];

const statusColors: Record<string, string> = {
  "Succès": "text-[#43A047]",
  "Annulé": "text-red-500",
};

export default function AuditLog() {
  const [selected, setSelected] = React.useState<null | typeof auditEntries[0]>(null);

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#43A047] text-[#43A047] hover:bg-[#F2C94C] flex items-center gap-1"
                          onClick={() => setSelected(entry)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Information
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Détail de l'action
                          </DialogTitle>
                        </DialogHeader>
                        {selected && (
                          <div className="space-y-2">
                            <p>
                              <span className="font-semibold">Date :</span> {selected.date}
                            </p>
                            <p>
                              <span className="font-semibold">Action :</span> {selected.action}
                            </p>
                            <p>
                              <span className="font-semibold">Utilisateur :</span> {selected.user}
                            </p>
                            <p>
                              <span className="font-semibold">Status :</span>{" "}
                              <span className={statusColors[selected.status]}>{selected.status}</span>
                            </p>
                            <p>
                              <span className="font-semibold">Détails :</span> {selected.details}
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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

