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

// Ajouter la dépendance pour gérer les images base64
// (jspdf permet d'utiliser des URLs ou des données base64 pour addImage)

const LOGO_URL = "/public/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png";

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

  // Pour le résumé
  const total = filteredReports.length;
  const byType = {
    mensuel: filteredReports.filter(r => r.type === "mensuel").length,
    hebdomadaire: filteredReports.filter(r => r.type === "hebdomadaire").length,
    journalier: filteredReports.filter(r => r.type === "journalier").length,
  };
  const byStatus = {
    Complété: filteredReports.filter(r => r.status === "Complété").length,
    "En cours": filteredReports.filter(r => r.status === "En cours").length,
    Annulé: filteredReports.filter(r => r.status === "Annulé").length,
  };

  // Fonction utilitaire pour charger une image et retourner les données base64 pour jsPDF
  const fetchImageBase64 = (url: string): Promise<string> => {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  };

  // Fonction d'export PDF au format paysage, uniquement les rapports filtrés
  const handleExportPDF = async () => {
    // PDF en format paysage
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    let y = 14;

    try {
      const logoData = await fetchImageBase64(LOGO_URL);
      // Logo 50*50 centré en haut à gauche
      doc.addImage(logoData, "PNG", 14, 8, 50, 50);
      y = 62;
    } catch (e) {
      // Si échec logo, on laisse plus de place
      y = 24;
    }

    // TITRE
    doc.setFontSize(18);
    doc.text("Rapports exportés", 80, y);
    y += 10;

    // ---- Tableau résumé ----
    doc.setFontSize(12);
    doc.setTextColor(67, 160, 71); // Vert
    doc.text("Résumé des rapports sélectionnés", 14, y);
    y += 7;
    doc.setTextColor(33,33,33);

    // Présentation : ligne de titres jaunes
    doc.setFillColor(242, 201, 76); // Jaune pale
    doc.rect(14, y, 265, 10, "F"); // Largeur augmentée pour paysage
    doc.setFont(undefined, "bold");
    doc.text("Total", 17, y+7);
    doc.text("Mensuel", 47, y+7);
    doc.text("Hebdo", 87, y+7);
    doc.text("Journalier", 127, y+7);
    doc.text("Complété", 167, y+7);
    doc.text("En cours", 207, y+7);
    doc.text("Annulé", 247, y+7);
    doc.setFont(undefined, "normal");
    y += 10;
    // Bordure
    doc.rect(14, y, 265, 10, "S");
    doc.text(String(total), 22, y+7);
    doc.text(String(byType.mensuel), 58, y+7);
    doc.text(String(byType.hebdomadaire), 98, y+7);
    doc.text(String(byType.journalier), 138, y+7);
    doc.text(String(byStatus["Complété"]), 176, y+7);
    doc.text(String(byStatus["En cours"]), 216, y+7);
    doc.text(String(byStatus["Annulé"]), 256, y+7);

    y += 16;

    // ---- Tableau détaillé ----
    doc.setFontSize(13);
    doc.setTextColor(67, 160, 71);
    doc.text("Détail des rapports filtrés :", 14, y);
    y += 7;
    doc.setTextColor(33,33,33);

    // En-tête tableau (paysage)
    doc.setFontSize(10);
    doc.setFillColor(67, 160, 71); // Vert
    doc.setTextColor(255,255,255);
    doc.rect(14, y, 265, 10, "F");
    doc.text("ID", 16, y+7);
    doc.text("Titre", 36, y+7);
    doc.text("Date", 90, y+7);
    doc.text("Status", 120, y+7);
    doc.text("Type", 150, y+7);
    doc.text("Description", 176, y+7);
    y += 10;
    doc.setTextColor(33,33,33);

    // Tableau lignes
    filteredReports.forEach((r) => {
      doc.setFillColor(255,255,255);
      doc.rect(14, y, 265, 9, "S"); // Largeur paysage, ligne fine

      doc.text(r.id, 16, y+6.4);
      doc.text(r.title.length > 40 ? r.title.slice(0,37)+"..." : r.title, 36, y+6.4);
      doc.text(format(parseISO(r.date), "PPP", { locale: fr }), 90, y+6.4);
      doc.text(r.status, 120, y+6.4);
      doc.text(r.type.charAt(0).toUpperCase() + r.type.slice(1), 150, y+6.4);
      doc.text(r.description.length > 55 ? r.description.slice(0,52)+"..." : r.description, 176, y+6.4);

      y += 9;
      if (y > 190) {
        doc.addPage();
        y = 25;
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
                              <span className="font-semibold">Date⯯:</span> {format(parseISO(selected.date), "PPP", { locale: fr })}
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
