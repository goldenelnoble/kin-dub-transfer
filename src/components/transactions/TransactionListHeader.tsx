
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export function TransactionListHeader({ filteredCount, totalCount }: TransactionListHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>Toutes les Transactions</CardTitle>
      <CardDescription>
        Liste complète des transactions avec filtres - {filteredCount} transaction(s) trouvée(s)
        {filteredCount !== totalCount && ` sur ${totalCount} au total`}
      </CardDescription>
    </CardHeader>
  );
}
