
import { toast } from "@/components/ui/sonner";
import { Transaction } from "@/types";
import { formatDate } from "@/lib/utils";

export const useReceiptActions = (transaction: Transaction, verificationUrl: string) => {
  const printReceipt = () => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reçu - ${transaction.id}</title>
        <style>
        body { 
          font-family: 'Courier New', monospace; 
          margin: 0; 
          padding: 10px; 
          font-size: 12px;
          line-height: 1.2;
          max-width: 300px;
        }
        .receipt { 
          max-width: 280px; 
          margin: 0 auto; 
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .company-name { 
          font-size: 16px; 
          font-weight: bold; 
          margin-bottom: 5px;
        }
        .company-info { 
          font-size: 10px; 
          margin-bottom: 2px;
        }
        .section { 
          margin: 8px 0; 
        }
        .line { 
          display: flex; 
          justify-content: space-between; 
          margin: 2px 0;
        }
        .separator { 
          border-top: 1px dashed #000; 
          margin: 8px 0; 
        }
        .total-line { 
          font-weight: bold; 
          font-size: 14px;
        }
        .footer { 
          text-align: center; 
          margin-top: 15px; 
          padding-top: 10px;
          border-top: 2px solid #000;
          font-size: 10px;
        }
        .qr-container { 
          text-align: center; 
          margin: 10px 0; 
        }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">GOLDEN EL NOBLES</div>
            <div class="company-info">Service de Transfert d'Argent</div>
            <div class="company-info">www.golden-el-nobles.com</div>
          </div>
          
          <div class="section">
            <div class="line"><span>Date:</span><span>${formatDate(transaction.createdAt)}</span></div>
            <div class="line"><span>ID Trans:</span><span>${transaction.id}</span></div>
            <div class="line"><span>Direction:</span><span>${transaction.direction === 'kinshasa_to_dubai' ? 'KIN→DXB' : 'DXB→KIN'}</span></div>
          </div>
          
          <div class="separator"></div>
          
          <div class="section">
            <div style="font-weight: bold; margin-bottom: 5px;">EXPEDITEUR:</div>
            <div class="line"><span>Nom:</span><span>${transaction.sender.name}</span></div>
            <div class="line"><span>Tel:</span><span>${transaction.sender.phone}</span></div>
          </div>
          
          <div class="section">
            <div style="font-weight: bold; margin-bottom: 5px;">DESTINATAIRE:</div>
            <div class="line"><span>Nom:</span><span>${transaction.recipient.name}</span></div>
            <div class="line"><span>Tel:</span><span>${transaction.recipient.phone}</span></div>
          </div>
          
          <div class="separator"></div>
          
          <div class="section">
            <div class="line"><span>Montant envoyé:</span><span>${transaction.amount.toLocaleString()} ${transaction.currency}</span></div>
            <div class="line"><span>Commission (${transaction.commissionPercentage}%):</span><span>${transaction.commissionAmount.toLocaleString()} ${transaction.currency}</span></div>
            <div class="separator"></div>
            <div class="line total-line"><span>TOTAL:</span><span>${(transaction.amount + transaction.commissionAmount).toLocaleString()} ${transaction.currency}</span></div>
            <div class="line"><span>A recevoir:</span><span>${transaction.receivingAmount.toLocaleString()} ${transaction.currency}</span></div>
          </div>
          
          <div class="separator"></div>
          
          <div class="section">
            <div class="line"><span>Méthode:</span><span>${transaction.paymentMethod === 'agency' ? 'Agence' : 'Mobile Money'}</span></div>
            <div class="line"><span>Statut:</span><span>${transaction.status.toUpperCase()}</span></div>
          </div>
          
          <div class="qr-container">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(verificationUrl)}" width="80" height="80" alt="QR Code" />
            <div style="font-size: 9px; margin-top: 5px;">Scannez pour vérifier</div>
          </div>
          
          <div class="footer">
            <div>Merci de votre confiance</div>
            <div>Gardez ce reçu précieusement</div>
            <div>Service Client: +243 XXX XXX XXX</div>
            <div style="margin-top: 5px; font-weight: bold;">Code: ${transaction.id}</div>
          </div>
        </div>
      </body>
      </html>
    `);
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
            format: [80, 200]
          });

          doc.setFont("courier");
          
          // En-tête
          doc.setFontSize(12);
          doc.setFont("courier", "bold");
          doc.text("GOLDEN EL NOBLES", 40, 15, { align: "center" });
          
          doc.setFontSize(8);
          doc.setFont("courier", "normal");
          doc.text("Service de Transfert d'Argent", 40, 20, { align: "center" });
          doc.text("www.golden-el-nobles.com", 40, 25, { align: "center" });
          
          // Ligne de séparation
          doc.line(5, 30, 75, 30);
          
          // Informations transaction
          let y = 35;
          doc.text(`Date: ${formatDate(transaction.createdAt)}`, 5, y);
          y += 5;
          doc.text(`ID: ${transaction.id}`, 5, y);
          y += 5;
          doc.text(`Direction: ${transaction.direction === 'kinshasa_to_dubai' ? 'KIN→DXB' : 'DXB→KIN'}`, 5, y);
          y += 8;
          
          // Expéditeur
          doc.setFont("courier", "bold");
          doc.text("EXPEDITEUR:", 5, y);
          y += 4;
          doc.setFont("courier", "normal");
          doc.text(`Nom: ${transaction.sender.name}`, 5, y);
          y += 4;
          doc.text(`Tel: ${transaction.sender.phone}`, 5, y);
          y += 8;
          
          // Destinataire
          doc.setFont("courier", "bold");
          doc.text("DESTINATAIRE:", 5, y);
          y += 4;
          doc.setFont("courier", "normal");
          doc.text(`Nom: ${transaction.recipient.name}`, 5, y);
          y += 4;
          doc.text(`Tel: ${transaction.recipient.phone}`, 5, y);
          y += 8;
          
          // Ligne pointillée
          for (let i = 5; i < 75; i += 2) {
            doc.line(i, y, i + 1, y);
          }
          y += 5;
          
          // Montants
          doc.text(`Montant: ${transaction.amount.toLocaleString()} ${transaction.currency}`, 5, y);
          y += 4;
          doc.text(`Commission: ${transaction.commissionAmount.toLocaleString()} ${transaction.currency}`, 5, y);
          y += 6;
          
          doc.setFont("courier", "bold");
          doc.text(`TOTAL: ${(transaction.amount + transaction.commissionAmount).toLocaleString()} ${transaction.currency}`, 5, y);
          y += 4;
          doc.setFont("courier", "normal");
          doc.text(`A recevoir: ${transaction.receivingAmount.toLocaleString()} ${transaction.currency}`, 5, y);
          y += 8;
          
          // Autres infos
          doc.text(`Méthode: ${transaction.paymentMethod === 'agency' ? 'Agence' : 'Mobile'}`, 5, y);
          y += 4;
          doc.text(`Statut: ${transaction.status.toUpperCase()}`, 5, y);
          y += 10;
          
          // Footer avec code de transaction
          doc.line(5, y, 75, y);
          y += 5;
          doc.setFontSize(7);
          doc.text("Merci de votre confiance", 40, y, { align: "center" });
          y += 4;
          doc.text("Gardez ce reçu précieusement", 40, y, { align: "center" });
          y += 4;
          doc.setFont("courier", "bold");
          doc.text(`Code: ${transaction.id}`, 40, y, { align: "center" });
          
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

  return { printReceipt, downloadPDF };
};
