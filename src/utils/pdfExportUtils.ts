
import jsPDF from "jspdf";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const LOGO_URL = "/public/lovable-uploads/b41d0d5e-3f93-4cc4-8fee-1f2457623fad.png";

export const fetchImageBase64 = (url: string): Promise<string> => {
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

export const exportTransactionsPDF = async (
  filteredTransactions: Transaction[],
  summary: {
    nbTransactions: number;
    totalAmount: number;
    totalCommissions: number;
    nbPending: number;
    nbCompleted: number;
    nbCancelled: number;
  }
) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = 14;
  
  try {
    const logoData = await fetchImageBase64(LOGO_URL);
    doc.addImage(logoData, "PNG", 14, 8, 50, 50);
    y = 62;
  } catch (e) { 
    y = 24; 
  }

  doc.setFontSize(18);
  doc.text("Rapport détaillé transactions", 80, y);
  y += 10;

  // Résumé Financier
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

  // Tableau transactions détaillées
  doc.setFontSize(13);
  doc.setTextColor(67, 160, 71);
  doc.text("Détails des transactions filtrées :", 14, y);
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
    if ((idx+1)%15 === 0) { 
      doc.addPage(); 
      y = 25; 
    }
  });

  doc.save("rapport_transactions.pdf");
};
