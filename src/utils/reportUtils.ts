
import { Transaction } from "@/types";
import { isSameMonth, isSameWeek, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type ReportType = "mensuel" | "hebdomadaire" | "journalier";

export function filterTransactionsByDate(
  transactions: Transaction[],
  type: ReportType | "tous",
  date?: Date
): Transaction[] {
  if (!date) return transactions;
  return transactions.filter((tx) => {
    if (!tx.createdAt) return false;
    const txDate = typeof tx.createdAt === "string" ? parseISO(tx.createdAt) : new Date(tx.createdAt);
    if (type === "mensuel")
      return isSameMonth(txDate, date);
    if (type === "hebdomadaire")
      return isSameWeek(txDate, date, { locale: fr });
    if (type === "journalier")
      return isSameDay(txDate, date);
    return true;
  });
}

export function calculateSummary(transactions: Transaction[]) {
  let totalAmount = 0;
  let totalCommissions = 0;
  let nbTransactions = transactions.length;
  let nbPending = transactions.filter(tx => tx.status === "pending").length;
  let nbCompleted = transactions.filter(tx => tx.status === "completed").length;
  let nbCancelled = transactions.filter(tx => tx.status === "cancelled").length;
  
  transactions.forEach(tx => {
    totalAmount += tx.amount;
    totalCommissions += tx.commissionAmount || 0;
  });
  
  return {
    nbTransactions,
    totalAmount,
    totalCommissions,
    nbPending,
    nbCompleted,
    nbCancelled
  };
}
