
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Filter, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type ReportType = "mensuel" | "hebdomadaire" | "journalier";

interface ReportsFiltersProps {
  reportType: ReportType | "tous";
  onReportTypeChange: (type: ReportType | "tous") => void;
  filterDate: Date | undefined;
  onFilterDateChange: (date: Date | undefined) => void;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
}

export function ReportsFilters({
  reportType,
  onReportTypeChange,
  filterDate,
  onFilterDateChange,
  popoverOpen,
  onPopoverOpenChange
}: ReportsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-[#43A047]" />
        <span className="font-medium text-[#43A047]">Filtrer :</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={reportType === "tous" ? "default" : "outline"}
          onClick={() => onReportTypeChange("tous")}
          className="bg-[#43A047] text-white hover:bg-[#F2C94C] hover:text-[#222]"
        >
          Tous
        </Button>
        <Button
          variant={reportType === "mensuel" ? "default" : "outline"}
          onClick={() => onReportTypeChange("mensuel")}
          className={reportType === "mensuel" ? "bg-[#F2C94C] text-[#222]" : ""}
        >
          Mensuel
        </Button>
        <Button
          variant={reportType === "hebdomadaire" ? "default" : "outline"}
          onClick={() => onReportTypeChange("hebdomadaire")}
          className={reportType === "hebdomadaire" ? "bg-[#F2C94C] text-[#222]" : ""}
        >
          Hebdo
        </Button>
        <Button
          variant={reportType === "journalier" ? "default" : "outline"}
          onClick={() => onReportTypeChange("journalier")}
          className={reportType === "journalier" ? "bg-[#F2C94C] text-[#222]" : ""}
        >
          Journalier
        </Button>
      </div>
      <Popover open={popoverOpen} onOpenChange={onPopoverOpenChange}>
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
            onSelect={date => { 
              onFilterDateChange(date ?? undefined); 
              onPopoverOpenChange(false); 
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {filterDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterDateChange(undefined)}
          className="text-[#F97316]"
        >
          Réinitialiser date
        </Button>
      )}
    </div>
  );
}
