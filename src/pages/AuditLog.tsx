
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataManagementService, AuditLogEntry } from "@/services/DataManagementService";

export default function AuditLog() {
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Récupérer les entrées du journal d'audit
    const entries = DataManagementService.getAuditLog();
    
    // Si aucune entrée n'existe, ajouter les entrées de démonstration
    if (entries.length === 0) {
      const demoEntries = [
        { id: "1", action: "Création de transaction", user: "Jean Mwamba", date: new Date("2025-04-20T14:32:00").toISOString(), status: "Succès", details: "Transaction #TRX-001 a été créée avec succès pour 80 000 XAF." },
        { id: "2", action: "Annulation de transaction", user: "Fatima K.", date: new Date("2025-04-19T17:40:00").toISOString(), status: "Succès", details: "Transaction #TRX-002 a bien été annulée." },
        { id: "3", action: "Connexion utilisateur", user: "Salima B.", date: new Date("2025-04-19T09:12:00").toISOString(), status: "Succès", details: "Connexion depuis IP 193.182.22.41." },
        { id: "4", action: "Suppression de rapport", user: "Jean Mwamba", date: new Date("2025-04-18T11:24:00").toISOString(), status: "Annulé", details: "Tentative de suppression du rapport #RPT-003 refusée." },
      ];
      
      // Ajouter ces entrées au localStorage
      demoEntries.forEach(entry => {
        DataManagementService.logAction(entry.action, entry.user, entry.status, entry.details);
      });
      
      setAuditEntries(DataManagementService.getAuditLog());
    } else {
      setAuditEntries(entries);
    }
  }, []);

  // Filtrer les entrées selon le terme de recherche
  const filteredEntries = auditEntries.filter(entry => 
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    "Succès": "text-[#43A047]",
    "Annulé": "text-red-500",
    "Échec": "text-red-500",
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#43A047]">Historique des événements</h2>
            <div className="w-64">
              <Input 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
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
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune entrée de journal trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-[#F2C94C]">{formatDate(entry.date)}</TableCell>
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
                                <span className="font-semibold">Date :</span> {formatDate(selected.date)}
                              </p>
                              <p>
                                <span className="font-semibold">Action :</span> {selected.action}
                              </p>
                              <p>
                                <span className="font-semibold">Utilisateur :</span> {selected.user}
                              </p>
                              <p>
                                <span className="font-semibold">Status :</span>{" "}
                                <span className={statusColors[selected.status]}>{selected.status}</span>
                              </p>
                              <p>
                                <span className="font-semibold">Détails :</span> {selected.details}
                              </p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
