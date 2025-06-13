
import { Card, CardContent } from "@/components/ui/card";

export function TransactionListLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F97316]"></div>
        <span className="ml-2">Chargement des transactions...</span>
      </CardContent>
    </Card>
  );
}
