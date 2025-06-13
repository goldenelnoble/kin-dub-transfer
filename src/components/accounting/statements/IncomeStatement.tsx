
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/types";
import { useMemo } from "react";

interface IncomeStatementProps {
  transactions: Transaction[];
}

export function IncomeStatement({ transactions }: IncomeStatementProps) {
  const incomeData = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // Revenus
    const commissionRevenue = completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0);
    const serviceRevenue = completedTransactions.length * 2; // Frais de service fixe
    const totalRevenue = commissionRevenue + serviceRevenue;
    
    // Charges (estimation basée sur les coûts opérationnels)
    const operatingExpenses = totalRevenue * 0.15; // 15% du CA
    const marketingExpenses = totalRevenue * 0.05; // 5% du CA
    const administrativeExpenses = totalRevenue * 0.10; // 10% du CA
    const totalExpenses = operatingExpenses + marketingExpenses + administrativeExpenses;
    
    // Résultats
    const grossProfit = totalRevenue;
    const operatingProfit = grossProfit - totalExpenses;
    const netProfit = operatingProfit; // Pas d'impôts pour simplifier
    
    // Marges
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const operatingMargin = totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0;
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      commissionRevenue,
      serviceRevenue,
      totalRevenue,
      operatingExpenses,
      marketingExpenses,
      administrativeExpenses,
      totalExpenses,
      grossProfit,
      operatingProfit,
      netProfit,
      grossMargin,
      operatingMargin,
      netMargin
    };
  }, [transactions]);

  const incomeItems = [
    { label: "PRODUITS", items: [
      { name: "Commissions sur transferts", amount: incomeData.commissionRevenue, isSubtotal: false },
      { name: "Frais de service", amount: incomeData.serviceRevenue, isSubtotal: false },
      { name: "TOTAL PRODUITS", amount: incomeData.totalRevenue, isSubtotal: true }
    ]},
    { label: "CHARGES", items: [
      { name: "Charges opérationnelles", amount: incomeData.operatingExpenses, isSubtotal: false },
      { name: "Frais de marketing", amount: incomeData.marketingExpenses, isSubtotal: false },
      { name: "Frais administratifs", amount: incomeData.administrativeExpenses, isSubtotal: false },
      { name: "TOTAL CHARGES", amount: incomeData.totalExpenses, isSubtotal: true }
    ]},
    { label: "RÉSULTATS", items: [
      { name: "Résultat brut", amount: incomeData.grossProfit, isSubtotal: false },
      { name: "Résultat opérationnel", amount: incomeData.operatingProfit, isSubtotal: false },
      { name: "RÉSULTAT NET", amount: incomeData.netProfit, isSubtotal: true }
    ]}
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047]">Compte de Résultat</CardTitle>
          <CardDescription>
            Analyse des revenus et charges sur la période
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table principale */}
            <div className="lg:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-3/4">Description</TableHead>
                    <TableHead className="text-right">Montant (USD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeItems.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      <TableRow>
                        <TableCell colSpan={2} className="font-bold text-[#43A047] bg-[#43A047]/10 py-3">
                          {section.label}
                        </TableCell>
                      </TableRow>
                      {section.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex} className={item.isSubtotal ? "border-t-2 font-bold" : ""}>
                          <TableCell className={item.isSubtotal ? "pl-4 font-bold" : "pl-8"}>
                            {item.name}
                          </TableCell>
                          <TableCell className={`text-right ${item.isSubtotal ? "font-bold text-[#43A047]" : ""}`}>
                            {item.amount >= 0 ? '' : '-'}{Math.abs(item.amount).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Indicateurs clés */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ratios de Rentabilité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Marge brute:</span>
                    <span className="font-bold text-[#43A047]">{incomeData.grossMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge opérationnelle:</span>
                    <span className="font-bold text-[#43A047]">{incomeData.operatingMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge nette:</span>
                    <span className="font-bold text-[#43A047]">{incomeData.netMargin.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span className="font-bold">{transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenus/Transaction:</span>
                    <span className="font-bold text-[#43A047]">
                      {transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length > 0 
                        ? (incomeData.totalRevenue / transactions.filter(tx => tx.status === TransactionStatus.COMPLETED).length).toFixed(2)
                        : '0'} USD
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
