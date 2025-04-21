
import { Currency, DashboardStats } from "@/types";
import { FileSpreadsheet, FileWarning, FileCheck, FileX, FileType, FileKey } from "lucide-react";

interface DashboardSummaryProps {
  stats: DashboardStats;
  currency: Currency;
  // Ajout : callback clic
  onStatClick?: (statKey: keyof DashboardStats) => void;
}

// # Palette
const palette = {
  orange: "#F97316",
  green: "#43A047",
  yellow: "#F2C94C",
  bg: "#FEF7CD"
};

export function DashboardSummary({ stats, currency, onStatClick }: DashboardSummaryProps) {
  // Items de résumé interactifs : Cliquable, props couleurs/icône
  const items = [
    {
      key: "totalTransactions",
      label: "Transactions totales",
      value: stats.totalTransactions,
      color: palette.orange,
      icon: FileSpreadsheet
    },
    {
      key: "pendingTransactions",
      label: "En attente",
      value: stats.pendingTransactions,
      color: palette.yellow,
      icon: FileWarning
    },
    {
      key: "completedTransactions",
      label: "Complétées",
      value: stats.completedTransactions,
      color: palette.green,
      icon: FileCheck
    },
    {
      key: "cancelledTransactions",
      label: "Annulées",
      value: stats.cancelledTransactions,
      color: "#ea384c",
      icon: FileX
    },
    {
      key: "totalAmount",
      label: "Montant total",
      value: `${stats.totalAmount.toLocaleString()} ${currency}`,
      color: palette.green,
      icon: FileType
    },
    {
      key: "totalCommissions",
      label: "Commissions",
      value: `${stats.totalCommissions.toLocaleString()} ${currency}`,
      color: palette.orange,
      icon: FileKey
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(item => {
        const LucideIcon = item.icon;
        // clickable si onStatClick existe
        const clickable = !!onStatClick && ["totalTransactions", "pendingTransactions", "completedTransactions", "cancelledTransactions"].includes(item.key);

        return (
          <div
            key={item.key}
            className={`rounded-xl border shadow transition group flex flex-col items-center justify-center gap-2 p-6 bg-white cursor-${clickable ? "pointer" : "default"} hover:shadow-lg`}
            style={{ borderColor: item.color }}
            onClick={clickable ? () => onStatClick && onStatClick(item.key as keyof DashboardStats) : undefined}
          >
            <div className="flex items-center gap-2">
              {LucideIcon && <LucideIcon className="h-7 w-7" style={{ color: item.color }} />}
              <span className="text-lg font-semibold" style={{ color: item.color }}>{item.label}</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
