import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { Transaction, TransactionStatus } from "@/types";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface TransactionReceiptProps {
  transaction: Transaction;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ transaction }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const printReceipt = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && receiptRef.current) {
      printWindow.document.write('<html><head><title>Golden El Nobles - Reçu de Transaction</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; padding: 20px; }
        .receipt { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .receipt-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .receipt-logo { text-align: center; margin-bottom: 20px; }
        .logo-text { font-size: 24px; font-weight: bold; color: #F2C94C; }
        .receipt-title { text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
        .receipt-section { margin-bottom: 15px; }
        .section-title { font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #eee; }
        .receipt-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .receipt-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        .badge-pending { background: #FEF3CF; color: #F7C33F; }
        .badge-validated { background: #F2C94C20; color: #F7C33F; }
        .badge-completed { background: #43A04720; color: #43A047; }
        .badge-cancelled { background: #FEC6A1; color: #F97316; }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="receipt">');
      
      // Logo et en-tête
      printWindow.document.write('<div class="receipt-logo">');
      printWindow.document.write('<div class="logo-text">GOLDEN EL NOBLES</div>');
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-title">REÇU DE TRANSACTION</div>');
      
      // Information sur la transaction
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Détails de la transaction</div>');
      printWindow.document.write(`<div class="receipt-row"><span>ID Transaction:</span><span>${transaction.id}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Date:</span><span>${formatDate(transaction.createdAt)}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Direction:</span><span>${
        transaction.direction === "kinshasa_to_dubai" ? "Kinshasa → Dubaï" : "Dubaï → Kinshasa"
      }</span></div>`);
      
      // Montants
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Montant:</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount.toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Commission (${transaction.commissionPercentage}%):</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${transaction.commissionAmount.toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Montant total:</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${(transaction.amount + transaction.commissionAmount).toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write(`<div class="receipt-row"><span>Méthode de paiement:</span><span>${
        transaction.paymentMethod === "agency" ? "Agence" : "Mobile Money"
      }${transaction.mobileMoneyNetwork ? ` (${transaction.mobileMoneyNetwork})` : ''}</span></div>`);
      
      printWindow.document.write(`<div class="receipt-row"><span>Statut:</span><span class="badge badge-${transaction.status}">
        ${transaction.status === TransactionStatus.PENDING ? 'En attente' : 
          transaction.status === TransactionStatus.VALIDATED ? 'Validée' :
          transaction.status === TransactionStatus.COMPLETED ? 'Complétée' : 'Annulée'}
      </span></div>`);
      printWindow.document.write('</div>');
      
      // Informations expéditeur
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Informations de l\'expéditeur</div>');
      printWindow.document.write(`<div class="receipt-row"><span>Nom:</span><span>${transaction.sender.name}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Téléphone:</span><span>${transaction.sender.phone}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Pièce d'identité:</span><span>${
        transaction.sender.idType === "passport" ? "Passeport" :
        transaction.sender.idType === "id_card" ? "Carte d'identité" :
        transaction.sender.idType === "driving_license" ? "Permis de conduire" : "Autre"
      } (${transaction.sender.idNumber})</span></div>`);
      printWindow.document.write('</div>');
      
      // Informations bénéficiaire
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Informations du bénéficiaire</div>');
      printWindow.document.write(`<div class="receipt-row"><span>Nom:</span><span>${transaction.recipient.name}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Téléphone:</span><span>${transaction.recipient.phone}</span></div>`);
      
      if (transaction.recipient.idNumber) {
        printWindow.document.write(`<div class="receipt-row"><span>Pièce d'identité:</span><span>${
          transaction.recipient.idType === "passport" ? "Passeport" :
          transaction.recipient.idType === "id_card" ? "Carte d'identité" :
          transaction.recipient.idType === "driving_license" ? "Permis de conduire" : "Autre"
        } (${transaction.recipient.idNumber})</span></div>`);
      }
      
      printWindow.document.write('</div>');
      
      // Notes
      if (transaction.notes) {
        printWindow.document.write('<div class="receipt-section">');
        printWindow.document.write('<div class="section-title">Notes</div>');
        printWindow.document.write(`<div>${transaction.notes}</div>`);
        printWindow.document.write('</div>');
      }
      
      // Footer
      printWindow.document.write('<div class="receipt-footer">');
      printWindow.document.write('<p>Golden El Nobles - Services de transfert d\'argent</p>');
      printWindow.document.write(`<p>Ce reçu a été généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write('</div>'); // End receipt
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        toast.success("Impression du reçu lancée");
      }, 300);
    }
  };

  const downloadPDF = () => {
    // Utiliser la même méthode d'impression pour l'instant
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow && receiptRef.current) {
      printWindow.document.write('<html><head><title>Golden El Nobles - Reçu de Transaction</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; padding: 20px; }
        .receipt { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .receipt-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .receipt-logo { text-align: center; margin-bottom: 20px; }
        .logo-text { font-size: 24px; font-weight: bold; color: #F2C94C; }
        .receipt-title { text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
        .receipt-section { margin-bottom: 15px; }
        .section-title { font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #eee; }
        .receipt-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .receipt-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        .badge-pending { background: #FEF3CF; color: #F7C33F; }
        .badge-validated { background: #F2C94C20; color: #F7C33F; }
        .badge-completed { background: #43A04720; color: #43A047; }
        .badge-cancelled { background: #FEC6A1; color: #F97316; }
        @media print {
          .no-print, .no-print * {
            display: none !important;
          }
        }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="receipt">');
      
      // Logo et en-tête
      printWindow.document.write('<div class="receipt-logo">');
      printWindow.document.write('<div class="logo-text">GOLDEN EL NOBLES</div>');
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-title">REÇU DE TRANSACTION</div>');
      
      // Information sur la transaction
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Détails de la transaction</div>');
      printWindow.document.write(`<div class="receipt-row"><span>ID Transaction:</span><span>${transaction.id}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Date:</span><span>${formatDate(transaction.createdAt)}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Direction:</span><span>${
        transaction.direction === "kinshasa_to_dubai" ? "Kinshasa → Dubaï" : "Dubaï → Kinshasa"
      }</span></div>`);
      
      // Montants
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Montant:</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount.toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Commission (${transaction.commissionPercentage}%):</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${transaction.commissionAmount.toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write('<div class="receipt-row">');
      printWindow.document.write(`<span>Montant total:</span><span>${CURRENCY_SYMBOLS[transaction.currency]}${(transaction.amount + transaction.commissionAmount).toLocaleString()}</span>`);
      printWindow.document.write('</div>');
      
      printWindow.document.write(`<div class="receipt-row"><span>Méthode de paiement:</span><span>${
        transaction.paymentMethod === "agency" ? "Agence" : "Mobile Money"
      }${transaction.mobileMoneyNetwork ? ` (${transaction.mobileMoneyNetwork})` : ''}</span></div>`);
      
      printWindow.document.write(`<div class="receipt-row"><span>Statut:</span><span class="badge badge-${transaction.status}">
        ${transaction.status === TransactionStatus.PENDING ? 'En attente' : 
          transaction.status === TransactionStatus.VALIDATED ? 'Validée' :
          transaction.status === TransactionStatus.COMPLETED ? 'Complétée' : 'Annulée'}
      </span></div>`);
      printWindow.document.write('</div>');
      
      // Informations expéditeur
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Informations de l\'expéditeur</div>');
      printWindow.document.write(`<div class="receipt-row"><span>Nom:</span><span>${transaction.sender.name}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Téléphone:</span><span>${transaction.sender.phone}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Pièce d'identité:</span><span>${
        transaction.sender.idType === "passport" ? "Passeport" :
        transaction.sender.idType === "id_card" ? "Carte d'identité" :
        transaction.sender.idType === "driving_license" ? "Permis de conduire" : "Autre"
      } (${transaction.sender.idNumber})</span></div>`);
      printWindow.document.write('</div>');
      
      // Informations bénéficiaire
      printWindow.document.write('<div class="receipt-section">');
      printWindow.document.write('<div class="section-title">Informations du bénéficiaire</div>');
      printWindow.document.write(`<div class="receipt-row"><span>Nom:</span><span>${transaction.recipient.name}</span></div>`);
      printWindow.document.write(`<div class="receipt-row"><span>Téléphone:</span><span>${transaction.recipient.phone}</span></div>`);
      
      if (transaction.recipient.idNumber) {
        printWindow.document.write(`<div class="receipt-row"><span>Pièce d'identité:</span><span>${
          transaction.recipient.idType === "passport" ? "Passeport" :
          transaction.recipient.idType === "id_card" ? "Carte d'identité" :
          transaction.recipient.idType === "driving_license" ? "Permis de conduire" : "Autre"
        } (${transaction.recipient.idNumber})</span></div>`);
      }
      
      printWindow.document.write('</div>');
      
      // Notes
      if (transaction.notes) {
        printWindow.document.write('<div class="receipt-section">');
        printWindow.document.write('<div class="section-title">Notes</div>');
        printWindow.document.write(`<div>${transaction.notes}</div>`);
        printWindow.document.write('</div>');
      }
      
      // Footer
      printWindow.document.write('<div class="receipt-footer">');
      printWindow.document.write('<p>Golden El Nobles - Services de transfert d\'argent</p>');
      printWindow.document.write(`<p>Ce reçu a été généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>`);
      printWindow.document.write('<p class="no-print">Pour enregistrer ce document, utilisez la fonction "Enregistrer sous" de votre navigateur (Ctrl+S / Cmd+S)</p>');
      printWindow.document.write('</div>');
      
      printWindow.document.write('</div>'); // End receipt
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      toast.success("Reçu prêt à être téléchargé. Utilisez Ctrl+S / Cmd+S pour l'enregistrer.");
      setTimeout(() => {
        // Afficher une alerte pour guider l'utilisateur
        printWindow.alert("Pour télécharger le reçu, utilisez la fonction \"Enregistrer sous\" de votre navigateur (Ctrl+S / Cmd+S)");
      }, 500);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6" ref={receiptRef}>
        <div className="space-y-6">
          {/* Logo et en-tête */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-[#F2C94C] text-3xl font-bold">GOLDEN EL NOBLES</div>
            <div className="mt-2 text-xl font-semibold">REÇU DE TRANSACTION</div>
          </div>

          {/* Contenu du reçu visible à l'écran */}
          <div>
            <h3 className="font-medium border-b pb-2 mb-2">Détails de la transaction</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">ID Transaction:</div>
              <div className="text-right font-medium">{transaction.id}</div>
              
              <div className="text-muted-foreground">Date:</div>
              <div className="text-right font-medium">{formatDate(transaction.createdAt)}</div>
              
              <div className="text-muted-foreground">Direction:</div>
              <div className="text-right font-medium">
                {transaction.direction === "kinshasa_to_dubai" ? "Kinshasa → Dubaï" : "Dubaï → Kinshasa"}
              </div>
              
              <div className="text-muted-foreground">Montant:</div>
              <div className="text-right font-medium">
                {CURRENCY_SYMBOLS[transaction.currency]}{transaction.amount.toLocaleString()}
              </div>
              
              <div className="text-muted-foreground">Commission ({transaction.commissionPercentage}%):</div>
              <div className="text-right font-medium">
                {CURRENCY_SYMBOLS[transaction.currency]}{transaction.commissionAmount.toLocaleString()}
              </div>
              
              <div className="text-muted-foreground">Montant total:</div>
              <div className="text-right font-medium">
                {CURRENCY_SYMBOLS[transaction.currency]}{(transaction.amount + transaction.commissionAmount).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Informations de l'expéditeur */}
          <div>
            <h3 className="font-medium border-b pb-2 mb-2">Informations de l'expéditeur</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Nom:</div>
              <div className="text-right font-medium">{transaction.sender.name}</div>
              
              <div className="text-muted-foreground">Téléphone:</div>
              <div className="text-right font-medium">{transaction.sender.phone}</div>
            </div>
          </div>

          {/* Informations du bénéficiaire */}
          <div>
            <h3 className="font-medium border-b pb-2 mb-2">Informations du bénéficiaire</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Nom:</div>
              <div className="text-right font-medium">{transaction.recipient.name}</div>
              
              <div className="text-muted-foreground">Téléphone:</div>
              <div className="text-right font-medium">{transaction.recipient.phone}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" /> Télécharger
            </Button>
            <Button onClick={printReceipt}>
              <Printer className="mr-2 h-4 w-4" /> Imprimer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
