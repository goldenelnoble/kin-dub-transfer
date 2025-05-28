
interface FinancialSummaryProps {
  summary: {
    nbTransactions: number;
    totalAmount: number;
    totalCommissions: number;
    nbPending: number;
    nbCompleted: number;
    nbCancelled: number;
  };
}

export function FinancialSummary({ summary }: FinancialSummaryProps) {
  return (
    <div className="border rounded-md p-4 bg-[#f3fff6]">
      <h3 className="font-semibold text-[#43A047] mb-2">Résumé financier de la période</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F2C94C] text-[#222]">
            <th className="p-2">Transactions</th>
            <th className="p-2">Montant total</th>
            <th className="p-2">Total commissions</th>
            <th className="p-2">En attente</th>
            <th className="p-2">Validées</th>
            <th className="p-2">Annulées</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="p-2">{summary.nbTransactions}</td>
            <td className="p-2">{summary.totalAmount.toLocaleString()} $</td>
            <td className="p-2">{summary.totalCommissions.toLocaleString()} $</td>
            <td className="p-2">{summary.nbPending}</td>
            <td className="p-2">{summary.nbCompleted}</td>
            <td className="p-2">{summary.nbCancelled}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
