
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { HomeButton } from "@/components/ui/home-button";
import { FileSpreadsheet } from "lucide-react";
import * as React from "react";
import { parseISO, isSameMonth, isSameWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { DEMO_TRANSACTIONS } from "@/lib/constants";
import { toast } from "@/components/ui/sonner";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsFilters } from "@/components/reports/ReportsFilters";
import { FinancialSummary } from "@/components/reports/FinancialSummary";
import { TransactionDetails } from "@/components/reports/TransactionDetails";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { filterTransactionsByDate, calculateSummary } from "@/utils/reportUtils";
import { exportTransactionsPDF } from "@/utils/pdfExportUtils";

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

export default function Reports() {
  const [reportType, setReportType] = React.useState<ReportType | "tous">("tous");
  const [filterDate, setFilterDate] = React.useState<Date | undefined>(undefined);
  const [selected, setSelected] = React.useState<ReportData | null>(null);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const filteredTransactions = filterTransactionsByDate(
    DEMO_TRANSACTIONS,
    reportType,
    filterDate
  );

  const summary = React.useMemo(() => calculateSummary(filteredTransactions), [filteredTransactions]);

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

  const handleExportPDF = async () => {
    await exportTransactionsPDF(filteredTransactions, summary);
  };

  const handleShowDetails = (report: ReportData) => {
    setSelected(report);
    toast.info(`Consultation des détails du rapport ${report.id}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <ReportsHeader />
          <HomeButton />
        </div>

        <ReportsFilters
          reportType={reportType}
          onReportTypeChange={setReportType}
          filterDate={filterDate}
          onFilterDateChange={setFilterDate}
          popoverOpen={popoverOpen}
          onPopoverOpenChange={setPopoverOpen}
        />

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
            <FinancialSummary summary={summary} />
            <TransactionDetails filteredTransactions={filteredTransactions} />
          </div>

          <ReportsTable
            filteredReports={filteredReports}
            onShowDetails={handleShowDetails}
            onExportPDF={handleExportPDF}
            selected={selected}
          />
        </div>
      </div>
    </AppLayout>
  );
}
