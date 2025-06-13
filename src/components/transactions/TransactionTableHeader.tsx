
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionTableHeader() {
  const headers = [
    { label: "ID Transaction", width: "w-32" },
    { label: "Type", width: "w-40" },
    { label: "Montant", width: "w-32" },
    { label: "Expéditeur", width: "w-48" },
    { label: "Bénéficiaire", width: "w-48" },
    { label: "Date", width: "w-32" },
    { label: "Statut", width: "w-28" },
    { label: "Actions", width: "w-32" }
  ];

  return (
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-gray-50 via-white to-gray-50 hover:from-gray-100 hover:via-gray-50 hover:to-gray-100 transition-all duration-200 border-b-2 border-gray-200">
        {headers.map((header, index) => (
          <TableHead 
            key={index}
            className={`font-bold text-gray-800 py-4 ${header.width} ${
              index === headers.length - 1 ? 'text-right' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <span>{header.label}</span>
              {index < headers.length - 1 && (
                <div className="h-1 w-1 bg-[#F97316] rounded-full opacity-60"></div>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
