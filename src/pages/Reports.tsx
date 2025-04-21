
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sampleReports = [
  { id: "RPT-001", title: "Rapport mensuel Janvier 2025", date: "2025-01-31", status: "Complété" },
  { id: "RPT-002", title: "Rapport hebdomadaire Semaine 16", date: "2025-04-19", status: "En cours" },
];

const statusColors: Record<string, string> = {
  "Complété": "text-[#43A047]",
  "En cours": "text-[#F97316]",
  "Annulé": "text-red-500",
};

export default function Reports() {
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

        <div className="rounded-xl border bg-card p-6 shadow space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-[#43A047] flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#F2C94C]" />
              Historique des rapports
            </h2>
            <Button className="bg-[#43A047] hover:bg-[#F2C94C] text-white">
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
              {sampleReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell className="text-[#F2C94C]">{report.date}</TableCell>
                  <TableCell className={statusColors[report.status]}>{report.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="border-[#F97316] text-[#F97316] hover:bg-[#F2C94C]">Voir</Button>
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
