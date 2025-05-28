
import { Transaction } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionDetailsProps {
  filteredTransactions: Transaction[];
}

export function TransactionDetails({ filteredTransactions }: TransactionDetailsProps) {
  return (
    <div className="border rounded-md p-4 bg-[#fffbe8]">
      <h3 className="font-semibold text-[#F97316] mb-2">Détail transactions</h3>
      <div className="overflow-x-auto max-h-80">
        <table className="w-full min-w-[650px] text-xs">
          <thead>
            <tr className="bg-[#43A047] text-white">
              <th className="p-1">ID</th>
              <th className="p-1">Date</th>
              <th className="p-1">Emetteur</th>
              <th className="p-1">Récepteur</th>
              <th className="p-1">Montant</th>
              <th className="p-1">Statut</th>
              <th className="p-1">Commission</th>
              <th className="p-1">Sens</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">Aucune transaction pour cette période.</td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="text-center">
                  <td className="p-1">{t.id}</td>
                  <td className="p-1">{format(new Date(t.createdAt), "PPP", { locale: fr })}</td>
                  <td className="p-1">{t.sender?.name || "-"}</td>
                  <td className="p-1">{t.recipient?.name || "-"}</td>
                  <td className="p-1">{t.amount.toLocaleString()} $</td>
                  <td className="p-1">{t.status}</td>
                  <td className="p-1">{t.commissionAmount?.toLocaleString() ?? 0} $</td>
                  <td className="p-1">{t.direction}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
