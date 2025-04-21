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
import { DEMO_TRANSACTIONS } from "@/lib/constants";
import { Transaction } from "@/types";

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

// Ajout de la fonction utilitaire pour filtrer les transactions selon la période
function filterTransactionsByDate(
  transactions: Transaction[],
  type: ReportType | "tous",
  date?: Date
): Transaction[] {
  if (!date) return transactions;
  return transactions.filter((tx) => {
    if (!tx.createdAt) return false;
    const txDate = typeof tx.createdAt === "string" ? parseISO(tx.createdAt) : new Date(tx.createdAt);
    if (type === "mensuel")
      return isSameMonth(txDate, date);
    if (type === "hebdomadaire")
      return isSameWeek(txDate, date, { locale: fr });
    if (type === "journalier")
      return isSameDay(txDate, date);
    // Si "tous", on accepte tous les types (par défaut mensuel)
    return true;
  });
}

export default function Reports() {
  // Filtres: type et période
  const [reportType, setReportType] = React.useState<ReportType | "tous">("tous");
  const [filterDate, setFilterDate] = React.useState<Date | undefined>(undefined);
  const [selected, setSelected] = React.useState<ReportData | null>(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  // Transactions filtrées
  const filteredTransactions = filterTransactionsByDate(
    DEMO_TRANSACTIONS,
    reportType,
    filterDate
  );

  // Résumé financier de la période demandée
  const summary = React.useMemo(() => {
    let totalAmount = 0;
    let totalCommissions = 0;
    let nbTransactions = filteredTransactions.length;
    let nbPending = filteredTransactions.filter(tx => tx.status === "pending").length;
    let nbCompleted = filteredTransactions.filter(tx => tx.status === "completed").length;
    let nbCancelled = filteredTransactions.filter(tx => tx.status === "cancelled").length;
    filteredTransactions.forEach(tx => {
      totalAmount += tx.amount;
      totalCommissions += tx.commissionAmount || 0;
    });
    return {
      nbTransactions,
      totalAmount,
      totalCommissions,
      nbPending,
      nbCompleted,
      nbCancelled
    };
  }, [filteredTransactions]);

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

  // Modification de l’export PDF pour inclure le tableau des transactions détaillées
  const handleExportPDF = async () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    let y = 14;
    try {
      const logoData = await fetchImageBase64(LOGO_URL);
      doc.addImage(logoData, "PNG", 14, 8, 50, 50);
      y = 62;
    } catch (e) { y = 24; }

    doc.setFontSize(18);
    doc.text("Rapport détaillé transactions", 80, y);
    y += 10;

    // ---- Résumé Financier ----
    doc.setFontSize(12);
    doc.setTextColor(67, 160, 71);
    doc.text("Résumé financier de la période", 14, y);
    y += 7;
    doc.setTextColor(33,33,33);

    // Ligne titres
    doc.setFillColor(242, 201, 76);
    doc.rect(14, y, 265, 10, "F");
    doc.setFont(undefined, "bold");
    doc.text("Transactions", 17, y+7);
    doc.text("Montant total", 67, y+7);
    doc.text("Total commissions", 117, y+7);
    doc.text("En attente", 167, y+7);
    doc.text("Validées", 197, y+7);
    doc.text("Annulées", 237, y+7);
    doc.setFont(undefined, "normal");
    y += 10;
    doc.rect(14, y, 265, 10, "S");
    doc.text(String(summary.nbTransactions), 27, y+7);
    doc.text(summary.totalAmount.toLocaleString() + " $", 77, y+7);
    doc.text(summary.totalCommissions.toLocaleString() + " $", 137, y+7);
    doc.text(String(summary.nbPending), 177, y+7);
    doc.text(String(summary.nbCompleted), 207, y+7);
    doc.text(String(summary.nbCancelled), 247, y+7);

    y += 16;

    // ---- Tableau transactions détaillées (jusqu’à 15 lignes / page) ----
    doc.setFontSize(13);
    doc.setTextColor(67, 160, 71);
    doc.text("Détails des transactions filtrées :", 14, y);
    y += 7;
    doc.setTextColor(33,33,33);

    doc.setFontSize(10);
    doc.setFillColor(67, 160, 71);
    doc.setTextColor(255,255,255);
    doc.rect(14, y, 265, 10, "F");
    doc.text("ID", 16, y+7);
    doc.text("Date", 36, y+7);
    doc.text("Emetteur", 60, y+7);
    doc.text("Récepteur", 95, y+7);
    doc.text("Montant", 140, y+7);
    doc.text("Statut", 170, y+7);
    doc.text("Commission", 210, y+7);
    doc.text("Sens", 240, y+7);
    y += 10;
    doc.setTextColor(33,33,33);

    filteredTransactions.forEach((t, idx) => {
      doc.setFillColor(255,255,255);
      doc.rect(14, y, 265, 8, "S");
      doc.text(t.id || "-", 16, y+5.6);
      doc.text(format(new Date(t.createdAt), "PPP", { locale: fr }), 36, y+5.6);
      doc.text(t.sender?.name || "-", 60, y+5.6);
      doc.text(t.recipient?.name || "-", 95, y+5.6);
      doc.text((t.amount || 0).toLocaleString() + " $", 140, y+5.6);
      doc.text(t.status || "-", 170, y+5.6);
      doc.text((t.commissionAmount || 0).toLocaleString() + " $", 210, y+5.6);
      doc.text(t.direction || "-", 240, y+5.6);
      y += 8;
      if ((idx+1)%15 === 0) { doc.addPage(); y = 25; }
    });

    doc.save("rapport_transactions.pdf");
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 my-4">
          {/* Tableau résumé financier */}
          <div className="border rounded-md p-4 bg-[#f3fff6]">
            <h3 className="font-semibold text-[#43A047] mb-2">Résumé financier de la période</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F2C94C] text-[#222]">
                  <th className="p-2">Transactions</th>
                  <th className="p-2">Montant total</th>
                  <th className="p-2">Total commissions</th>
                  <th className="p-2">En attente</th>
                  <th className="p-2">Validées</th>
                  <th className="p-2">Annulées</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="p-2">{summary.nbTransactions}</td>
                  <td className="p-2">{summary.totalAmount.toLocaleString()} $</td>
                  <td className="p-2">{summary.totalCommissions.toLocaleString()} $</td>
                  <td className="p-2">{summary.nbPending}</td>
                  <td className="p-2">{summary.nbCompleted}</td>
                  <td className="p-2">{summary.nbCancelled}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Tableau détails transactions */}
          <div className="border rounded-md p-4 bg-[#fffbe8]">
            <h3 className="font-semibold text-[#F97316] mb-2">Détail transactions</h3>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full min-w-[650px] text-xs">
                <thead>
                  <tr className="bg-[#43A047] text-white">
                    <th className="p-1">ID</th>
                    <th className="p-1">Date</th>
                    <th className="p-1">Emetteur</th>
                    <th className="p-1">Récepteur</th>
                    <th className="p-1">Montant</th>
                    <th className="p-1">Statut</th>
                    <th className="p-1">Commission</th>
                    <th className="p-1">Sens</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">Aucune transaction pour cette période.</td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="text-center">
                        <td className="p-1">{t.id}</td>
                        <td className="p-1">{format(new Date(t.createdAt), "PPP", { locale: fr })}</td>
                        <td className="p-1">{t.sender?.name || "-"}</td>
                        <td className="p-1">{t.recipient?.name || "-"}</td>
                        <td className="p-1">{t.amount.toLocaleString()} $</td>
                        <td className="p-1">{t.status}</td>
                        <td className="p-1">{t.commissionAmount?.toLocaleString() ?? 0} $</td>
                        <td className="p-1">{t.direction}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
    </AppLayout>
  );
}
