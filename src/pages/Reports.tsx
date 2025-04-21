import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Info, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as React from "react";
import { format, isSameMonth, isSameWeek, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import jsPDF from "jspdf";

type ReportType = "mensuel" | "hebdomadaire" | "journalier";

interface ReportData {
  id: string;
  title: string;
  date: string;
  status: string;
  type: ReportType;
  description: string;
}

const sampleReports: ReportData[] = [
  { id: "RPT-001", title: "Rapport mensuel Janvier 2025", date: "2025-01-31", status: "Complété", type: "mensuel", description: "Résumé financier du mois de Janvier 2025." },
  { id: "RPT-002", title: "Rapport hebdomadaire Semaine 16", date: "2025-04-19", status: "En cours", type: "hebdomadaire", description: "Transactions réalisées durant la semaine 16 (du 2025-04-13 au 2025-04-19)." },
  { id: "RPT-003", title: "Rapport journalier 19 Avril 2025", date: "2025-04-19", status: "Complété", type: "journalier", description: "Toutes les transactions du 19/04/2025." },
  { id: "RPT-004", title: "Rapport journalier 20 Avril 2025", date: "2025-04-20", status: "En cours", type: "journalier", description: "Toutes les transactions du 20/04/2025." },
  { id: "RPT-005", title: "Rapport hebdomadaire Semaine 15", date: "2025-04-12", status: "Complété", type: "hebdomadaire", description: "Transactions réalisées durant la semaine 15 (du 2025-04-06 au 2025-04-12)." },
  { id: "RPT-006", title: "Rapport mensuel Avril 2025", date: "2025-04-30", status: "En cours", type: "mensuel", description: "Résumé financier du mois d'Avril 2025." },
];

const statusColors: Record<string, string> = {
  "Complété": "text-[#43A047]",
  "En cours": "text-[#F97316]",
  "Annulé": "text-red-500",
};

export default function Reports() {
  // Filtres: type et période
  const [reportType, setReportType] = React.useState<ReportType | "tous">("tous");
  const [filterDate, setFilterDate] = React.useState<Date | undefined>(undefined);
  const [selected, setSelected] = React.useState<ReportData | null>(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Gère les filtres sur la liste de rapports
  const filteredReports = sampleReports.filter((report) => {
    let typeMatch = reportType === "tous" || report.type === reportType;
    let dateMatch = true;
    if (filterDate) {
      if (report.type === "mensuel") {
        dateMatch = isSameMonth(parseISO(report.date), filterDate);
      } else if (report.type === "hebdomadaire") {
        dateMatch = isSameWeek(parseISO(report.date), filterDate, { locale: fr });
      } else if (report.type === "journalier") {
        dateMatch = isSameDay(parseISO(report.date), filterDate);
      }
    }
    return typeMatch && dateMatch;
  });

  // Fonction pour exporter en PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Rapports exportés", 14, 16);
    doc.setFontSize(10);

    let y = 26;
    doc.text("ID", 14, y);
    doc.text("Titre", 34, y);
    doc.text("Date", 110, y);
    doc.text("Status", 142, y);
    y += 6;

    filteredReports.forEach((report) => {
      doc.text(String(report.id), 14, y);
      doc.text(report.title, 34, y, { maxWidth: 70 });
      doc.text(format(parseISO(report.date), "PPP", { locale: fr }), 110, y);
      doc.text(report.status, 142, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 16;
      }
    });

    doc.save("rapports.pdf");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <FileText className="h-10 w-10 text-[#F97316]" />
          <div>
            <h1 className="text-3xl font-bold text-[#F97316]">Rapports</h1>
            <p className="text-[#43A047]">Consultez et exportez vos rapports clés concernant les transactions et commissions.</p>
          </div>
        </div>
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#43A047]" />
            <span className="font-medium text-[#43A047]">Filtrer :</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={reportType === "tous" ? "default" : "outline"}
              onClick={() => setReportType("tous")}
              className="bg-[#43A047] text-white hover:bg-[#F2C94C] hover:text-[#222]"
            >
              Tous
            </Button>
            <Button
              variant={reportType === "mensuel" ? "default" : "outline"}
              onClick={() => setReportType("mensuel")}
              className={reportType === "mensuel" ? "bg-[#F2C94C] text-[#222]" : ""}
            >
              Mensuel
            </Button>
            <Button
              variant={reportType === "hebdomadaire" ? "default" : "outline"}
              onClick={() => setReportType("hebdomadaire")}
              className={reportType === "hebdomadaire" ? "bg-[#F2C94C] text-[#222]" : ""}
            >
              Hebdo
            </Button>
            <Button
              variant={reportType === "journalier" ? "default" : "outline"}
              onClick={() => setReportType("journalier")}
              className={reportType === "journalier" ? "bg-[#F2C94C] text-[#222]" : ""}
            >
              Journalier
            </Button>
          </div>
          {/* DatePicker */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border-[#F97316] text-[#F97316] hover:bg-[#F2C94C] ml-2 flex items-center gap-1"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {filterDate ? format(filterDate, "PPP", { locale: fr }) : "Choisissez une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={date => { setFilterDate(date ?? undefined); setPopoverOpen(false); }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {/* Reset filtre */}
          {filterDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDate(undefined)}
              className="text-[#F97316]"
            >
              Réinitialiser date
            </Button>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6 shadow space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-[#43A047] flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#F2C94C]" />
              Historique des rapports
            </h2>
            <Button
              className="bg-[#43A047] hover:bg-[#F2C94C] text-white"
              onClick={handleExportPDF}
            >
              Exporter
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
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
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#F97316] text-[#F97316] hover:bg-[#F2C94C] flex items-center gap-1"
                            onClick={() => setSelected(report)}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Information
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Détail du rapport
                            </DialogTitle>
                          </DialogHeader>
                          {selected && (
                            <div className="space-y-2">
                              <p>
                                <span className="font-semibold">Titre :</span> {selected.title}
                              </p>
                              <p>
                                <span className="font-semibold">Date :</span> {format(parseISO(selected.date), "PPP", { locale: fr })}
                              </p>
                              <p>
                                <span className="font-semibold">Type :</span>{" "}
                                {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
                              </p>
                              <p>
                                <span className="font-semibold">Status :</span>{" "}
                                <span className={statusColors[selected.status]}>{selected.status}</span>
                              </p>
                              <p>
                                <span className="font-semibold">Description :</span> {selected.description}
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
