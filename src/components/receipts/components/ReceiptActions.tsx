
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ReceiptActionsProps {
  onDownloadPDF: () => void;
  onPrint: () => void;
}

export const ReceiptActions: React.FC<ReceiptActionsProps> = ({
  onDownloadPDF,
  onPrint
}) => {
  return (
    <div className="flex justify-center space-x-2 pt-4">
      <Button variant="outline" size="sm" onClick={onDownloadPDF}>
        <Download className="h-3 w-3 mr-1" />
        PDF
      </Button>
      <Button size="sm" onClick={onPrint} className="bg-[#F2C94C] text-black hover:bg-[#DBA32A]">
        <Printer className="h-3 w-3 mr-1" />
        Imprimer
      </Button>
    </div>
  );
};
