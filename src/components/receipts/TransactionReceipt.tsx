
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Transaction } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { QRCodeSVG } from 'qrcode.react';

interface TransactionReceiptProps {
  transaction: Transaction;
  verificationUrl: string;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ transaction, verificationUrl }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  // Utilisation de la couleur du logo (dorée) au lieu de orange
  const primaryColor = "#F2C94C"; // Couleur dorée du logo
  
  const printReceipt = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu de Transaction - ${transaction.id}</title>
        <style>
        body { font-family: Arial, sans-serif; }
        .receipt { max-width: 800px; margin: 0 auto; padding: 20px; }
        .receipt-header { display: flex; align-items: center; margin-bottom: 20px; }
        .company-logo { width: 166px; /* Logo réduit par 3 (500px ÷ 3 ≈ 166px) */ }
        .header-text { flex: 1; text-align: right; }
        .receipt-title { font-size: 24px; margin: 10px 0; color: ${primaryColor}; }
        .receipt-section { margin-bottom: 20px; }
        .section-title { font-size: 18px; margin-bottom: 10px; color: ${primaryColor}; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 14px; }
        .badge-pending { background: #FEF3CF; color: #F7C33F; }
        .badge-validated { background: #F2C94C20; color: #F7C33F; }
        .badge-completed { background: #43A04720; color: #43A047; }
        .badge-cancelled { background: #FEC6A1; color: ${primaryColor}; }
        .qr-code-container { text-align: center; margin-top: 20px; }
        .qr-code-text { font-size: 12px; margin-top: 5px; color: #777; text-align: center; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="receipt">');
      
      // Header with logo on the left
      printWindow.document.write('<div class="receipt-header">');
      printWindow.document.write('<img class="company-logo" src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" alt="Golden El Nobles Cargo" />');
      printWindow.document.write('<div class="header-text">');
      printWindow.document.write(`<h1 class="receipt-title">Reçu de Transaction</h1>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');
      
      // Transaction details
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write(`<h2 class="section-title">Détails de la Transaction</h2>`);
      printWindow.document.write('<div class="info-grid">');
      printWindow.document.write(`<div class="info-label">ID de transaction:</div><div class="info-value">${transaction.id}</div>`);
      printWindow.document.write(`<div class="info-label">Date:</div><div class="info-value">${formatDate(transaction.createdAt)}</div>`);
      printWindow.document.write(`<div class="info-label">Direction:</div><div class="info-value">${transaction.direction === 'kinshasa_to_dubai' ? 'Kinshasa → Dubaï' : 'Dubaï → Kinshasa'}</div>`);
      printWindow.document.write(`<div class="info-label">Méthode de paiement:</div><div class="info-value">${transaction.paymentMethod === 'agency' ? 'Agence' : 'Mobile Money'}</div>`);
      if (transaction.mobileMoneyNetwork) {
        printWindow.document.write(`<div class="info-label">Réseau:</div><div class="info-value">${transaction.mobileMoneyNetwork}</div>`);
      }
      printWindow.document.write(`<div class="info-label">Statut:</div><div class="info-value"><span class="badge badge-${transaction.status}">${transaction.status}</span></div>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');
      
      // Financial information
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write(`<h2 class="section-title">Informations Financières</h2>`);
      printWindow.document.write('<div class="info-grid">');
      printWindow.document.write(`<div class="info-label">Montant envoyé:</div><div class="info-value">${transaction.amount.toLocaleString()} ${transaction.currency}</div>`);
      printWindow.document.write(`<div class="info-label">Commission (${transaction.commissionPercentage}%):</div><div class="info-value">${transaction.commissionAmount.toLocaleString()} ${transaction.currency}</div>`);
      printWindow.document.write(`<div class="info-label">Montant à recevoir:</div><div class="info-value">${transaction.receivingAmount.toLocaleString()} ${transaction.currency}</div>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');
      
      // Sender information
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write(`<h2 class="section-title">Expéditeur</h2>`);
      printWindow.document.write('<div class="info-grid">');
      printWindow.document.write(`<div class="info-label">Nom:</div><div class="info-value">${transaction.sender.name}</div>`);
      printWindow.document.write(`<div class="info-label">Téléphone:</div><div class="info-value">${transaction.sender.phone}</div>`);
      printWindow.document.write(`<div class="info-label">Type de document:</div><div class="info-value">${transaction.sender.idType}</div>`);
      printWindow.document.write(`<div class="info-label">Numéro de document:</div><div class="info-value">${transaction.sender.idNumber}</div>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');
      
      // Recipient information
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write(`<h2 class="section-title">Destinataire</h2>`);
      printWindow.document.write('<div class="info-grid">');
      printWindow.document.write(`<div class="info-label">Nom:</div><div class="info-value">${transaction.recipient.name}</div>`);
      printWindow.document.write(`<div class="info-label">Téléphone:</div><div class="info-value">${transaction.recipient.phone}</div>`);
      if (transaction.recipient.idType && transaction.recipient.idNumber) {
        printWindow.document.write(`<div class="info-label">Type de document:</div><div class="info-value">${transaction.recipient.idType}</div>`);
        printWindow.document.write(`<div class="info-label">Numéro de document:</div><div class="info-value">${transaction.recipient.idNumber}</div>`);
      }
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');

      // Additional information
      if (transaction.notes) {
        printWindow.document.write('<div class="receipt-section">');
        printWindow.document.write(`<h2 class="section-title">Informations supplémentaires</h2>`);
        printWindow.document.write(`<div>${transaction.notes}</div>`);
        printWindow.document.write('</div>');
      }
      
      // QR Code
      printWindow.document.write('<div class="qr-code-container">');
      printWindow.document.write(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}" width="150" height="150" alt="Code QR de vérification" />`);
      printWindow.document.write('<div class="qr-code-text">Scannez ce code QR pour vérifier l\'authenticité de ce reçu</div>');
      printWindow.document.write('</div>');
      
      // Footer
      printWindow.document.write('<div class="receipt-footer">');
      printWindow.document.write('<p>Golden El Nobles - Services de transfert d\'argent</p>');
      printWindow.document.write('<p>www.golden-el-nobles.com</p>');
      printWindow.document.write('</div>');
      
      printWindow.document.write('</div></body></html>');
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
  };

  const downloadPDF = () => {
    toast.loading("Génération du PDF...");
    
    setTimeout(() => {
      try {
        import('jspdf').then(({ default: jsPDF }) => {
          const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
          });

          // Use window.location.origin for the logo for correct URL in PDF
          const logoUrl = `${window.location.origin}/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png`;
          
          // Set up the document
          doc.setFont("helvetica");
          doc.setFontSize(18);
          doc.setTextColor(primaryColor); // Utilisation de la couleur dorée
          
          // Add logo placeholder (in real app, would add actual image)
          // Adding logo requires more complex setup with image loading
          doc.text("GOLDEN EL NOBLES", 105, 20, { align: "center" });
          
          doc.setFontSize(16);
          doc.text("Reçu de Transaction", 105, 30, { align: "center" });
          
          // Transaction details
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          doc.text(`ID de transaction: ${transaction.id}`, 20, 50);
          doc.text(`Date: ${formatDate(transaction.createdAt)}`, 20, 60);
          doc.text(`Direction: ${transaction.direction === 'kinshasa_to_dubai' ? 'Kinshasa → Dubaï' : 'Dubaï → Kinshasa'}`, 20, 70);
          doc.text(`Méthode: ${transaction.paymentMethod === 'agency' ? 'Agence' : 'Mobile Money'}`, 20, 80);
          doc.text(`Statut: ${transaction.status}`, 20, 90);
          
          // Financial information
          doc.setFontSize(14);
          doc.setTextColor(primaryColor); // Utilisation de la couleur dorée
          doc.text("Informations Financières", 20, 110);
          
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          doc.text(`Montant envoyé: ${transaction.amount.toLocaleString()} ${transaction.currency}`, 20, 120);
          doc.text(`Commission (${transaction.commissionPercentage}%): ${transaction.commissionAmount.toLocaleString()} ${transaction.currency}`, 20, 130);
          doc.text(`Montant à recevoir: ${transaction.receivingAmount.toLocaleString()} ${transaction.currency}`, 20, 140);
          
          // Sender information
          doc.setFontSize(14);
          doc.setTextColor(primaryColor); // Utilisation de la couleur dorée
          doc.text("Expéditeur", 20, 160);
          
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          doc.text(`Nom: ${transaction.sender.name}`, 20, 170);
          doc.text(`Téléphone: ${transaction.sender.phone}`, 20, 180);
          
          // Recipient information
          doc.setFontSize(14);
          doc.setTextColor(primaryColor); // Utilisation de la couleur dorée
          doc.text("Destinataire", 20, 200);
          
          doc.setFontSize(12);
          doc.setTextColor("#000000");
          doc.text(`Nom: ${transaction.recipient.name}`, 20, 210);
          doc.text(`Téléphone: ${transaction.recipient.phone}`, 20, 220);
          
          // QR Code note
          doc.setFontSize(10);
          doc.setTextColor("#666666");
          doc.text("Scannez le QR code pour vérifier l'authenticité du reçu", 105, 240, { align: "center" });
          
          // Footer
          doc.setFontSize(10);
          doc.text("Golden El Nobles - Services de transfert d'argent", 105, 270, { align: "center" });
          doc.text("www.golden-el-nobles.com", 105, 275, { align: "center" });
          
          // Save the PDF
          doc.save(`Reçu-${transaction.id}.pdf`);
          
          toast.dismiss();
          toast.success("PDF téléchargé avec succès");
        });
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        toast.dismiss();
        toast.error("Erreur lors de la génération du PDF");
      }
    }, 100);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6" ref={receiptRef}>
        <div className="flex flex-col space-y-4 print:p-6">
          {/* Header avec logo à gauche et plus petit */}
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png" 
              alt="Golden El Nobles Cargo" 
              className="h-56 w-auto" // Hauteur réduite par 3 (168px ÷ 3 = 56px)
            />
            <div className="text-right">
              <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Reçu de Transaction</h1>
              <div className="text-sm text-muted-foreground">
                Émis le {formatDate(new Date())}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border rounded-md p-4 bg-muted/20">
            <h2 className="font-semibold mb-2" style={{ color: primaryColor }}>Détails de la Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium">{transaction.id}</span>
              </div>
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formatDate(transaction.createdAt)}</span>
              </div>
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">Direction:</span>
                <span className="font-medium">
                  {transaction.direction === 'kinshasa_to_dubai' ? 'Kinshasa → Dubaï' : 'Dubaï → Kinshasa'}
                </span>
              </div>
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">Méthode:</span>
                <span className="font-medium">
                  {transaction.paymentMethod === 'agency' ? 'Agence' : 'Mobile Money'}
                  {transaction.mobileMoneyNetwork && ` (${transaction.mobileMoneyNetwork})`}
                </span>
              </div>
              <div className="flex justify-between md:flex-col">
                <span className="text-muted-foreground">Statut:</span>
                <span className={`font-medium inline-flex items-center px-2 py-1 rounded-full text-xs
                  ${transaction.status === 'pending' ? 'bg-[#FEF3CF] text-[#F7C33F]' : 
                    transaction.status === 'validated' ? 'bg-[#F2C94C]/20 text-[#F7C33F]' :
                    transaction.status === 'completed' ? 'bg-[#43A047]/20 text-[#43A047]' : 
                    `bg-[${primaryColor}]/20 text-[${primaryColor}]`
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2" style={{ color: primaryColor }}>Informations Financières</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Montant envoyé:</span>
                <span className="font-bold text-lg">
                  {transaction.amount.toLocaleString()} {transaction.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Commission ({transaction.commissionPercentage}%):
                </span>
                <span className="font-medium">
                  {transaction.commissionAmount.toLocaleString()} {transaction.currency}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-muted-foreground">Montant à recevoir:</span>
                <span className="font-bold text-lg text-[#43A047]">
                  {transaction.receivingAmount.toLocaleString()} {transaction.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Sender and Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h2 className="font-semibold mb-2" style={{ color: primaryColor }}>Expéditeur</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between md:flex-col">
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium">{transaction.sender.name}</span>
                </div>
                <div className="flex justify-between md:flex-col">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-medium">{transaction.sender.phone}</span>
                </div>
                <div className="flex justify-between md:flex-col">
                  <span className="text-muted-foreground">Document:</span>
                  <span className="font-medium">
                    {transaction.sender.idType} {transaction.sender.idNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h2 className="font-semibold mb-2" style={{ color: primaryColor }}>Destinataire</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between md:flex-col">
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-medium">{transaction.recipient.name}</span>
                </div>
                <div className="flex justify-between md:flex-col">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-medium">{transaction.recipient.phone}</span>
                </div>
                {transaction.recipient.idType && transaction.recipient.idNumber && (
                  <div className="flex justify-between md:flex-col">
                    <span className="text-muted-foreground">Document:</span>
                    <span className="font-medium">
                      {transaction.recipient.idType} {transaction.recipient.idNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center mt-6">
            <QRCodeSVG 
              value={verificationUrl}
              size={150}
              level="H"
              includeMargin={true}
            />
            <p className="mt-2 text-xs text-muted-foreground text-center">
              Scannez ce code QR pour vérifier l'authenticité de ce reçu
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={downloadPDF} style={{ borderColor: primaryColor, color: primaryColor }}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button onClick={printReceipt} style={{ backgroundColor: primaryColor }}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
