
import { TransactionStats } from "./TransactionStats";
import { Transaction } from "@/types";

interface TransactionListStatsProps {
  transactions: Transaction[];
  currencyFilter: string;
}

export function TransactionListStats({ transactions, currencyFilter }: TransactionListStatsProps) {
  return (
    <TransactionStats 
      transactions={transactions}
      currencyFilter={currencyFilter}
    />
  );
}
