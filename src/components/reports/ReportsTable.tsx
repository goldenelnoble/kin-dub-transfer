
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, FileSpreadsheet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/components/ui/sonner";

interface ReportData {
  id: string;
  title: string;
  date: string;
  status: string;
  type: "mensuel" | "hebdomadaire" | "journalier";
  description: string;
}

interface ReportsTableProps {
  filteredReports: ReportData[];
  onShowDetails: (report: ReportData) => void;
  onExportPDF: () => void;
  selected: ReportData | null;
}

const statusColors: Record<string, string> = {
  "Complété": "text-[#43A047]",
  "En cours": "text-[#F97316]",
  "Annulé": "text-red-500",
};

export function ReportsTable({ filteredReports, onShowDetails, onExportPDF, selected }: ReportsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredReports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-400">Aucun rapport pour cette période/type.</TableCell>
          </TableRow>
        ) : (
          filteredReports.map(report => (
            <TableRow key={report.id}>
              <TableCell>{report.id}</TableCell>
              <TableCell>{report.title}</TableCell>
              <TableCell className="text-[#F2C94C]">{format(parseISO(report.date), "PPP", { locale: fr })}</TableCell>
              <TableCell className={statusColors[report.status]}>{report.status}</TableCell>
              <TableCell className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#F97316] text-[#F97316] hover:bg-[#F2C94C]"
                      onClick={() => onShowDetails(report)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Détails du rapport
                      </DialogTitle>
                    </DialogHeader>
                    {selected && (
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Titre :</span> {selected.title}
                        </p>
                        <p>
                          <span className="font-semibold">Date :</span>{" "}
                          {format(parseISO(selected.date), "PPP", { locale: fr })}
                        </p>
                        <p>
                          <span className="font-semibold">Type :</span>{" "}
                          {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
                        </p>
                        <p>
                          <span className="font-semibold">Statut :</span>{" "}
                          <span className={statusColors[selected.status]}>{selected.status}</span>
                        </p>
                        <p>
                          <span className="font-semibold">Description :</span> {selected.description}
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#43A047] text-white hover:bg-[#F2C94C]"
                  onClick={onExportPDF}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Exporter
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
