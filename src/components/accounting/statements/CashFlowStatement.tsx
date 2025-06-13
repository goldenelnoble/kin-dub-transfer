
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/types";
import { useMemo } from "react";

interface CashFlowStatementProps {
  transactions: Transaction[];
}

export function CashFlowStatement({ transactions }: CashFlowStatementProps) {
  const cashFlowData = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // FLUX DE TRÉSORERIE D'EXPLOITATION
    const commissionRevenue = completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0);
    const operatingExpenses = -commissionRevenue * 0.30; // 30% du CA en charges
    const netOperatingCashFlow = commissionRevenue + operatingExpenses;
    
    // FLUX DE TRÉSORERIE D'INVESTISSEMENT
    const equipmentPurchases = -25000; // Achat d'équipements
    const softwareInvestments = -15000; // Investissement logiciels
    const netInvestingCashFlow = equipmentPurchases + softwareInvestments;
    
    // FLUX DE TRÉSORERIE DE FINANCEMENT
    const initialCapitalInvestment = 100000; // Apport initial
    const dividendsPaid = -10000; // Dividendes versés
    const netFinancingCashFlow = initialCapitalInvestment + dividendsPaid;
    
    // VARIATION NETTE DE TRÉSORERIE
    const netCashFlow = netOperatingCashFlow + netInvestingCashFlow + netFinancingCashFlow;
    const beginningCash = 50000; // Trésorerie de début
    const endingCash = beginningCash + netCashFlow;

    return {
      commissionRevenue,
      operatingExpenses,
      netOperatingCashFlow,
      equipmentPurchases,
      softwareInvestments,
      netInvestingCashFlow,
      initialCapitalInvestment,
      dividendsPaid,
      netFinancingCashFlow,
      netCashFlow,
      beginningCash,
      endingCash
    };
  }, [transactions]);

  const cashFlowSections = [
    {
      title: "FLUX DE TRÉSORERIE D'EXPLOITATION",
      items: [
        { name: "Commissions perçues", amount: cashFlowData.commissionRevenue, isInflow: true },
        { name: "Charges d'exploitation", amount: cashFlowData.operatingExpenses, isInflow: false },
        { name: "Flux net d'exploitation", amount: cashFlowData.netOperatingCashFlow, isSubtotal: true }
      ]
    },
    {
      title: "FLUX DE TRÉSORERIE D'INVESTISSEMENT",
      items: [
        { name: "Achat d'équipements", amount: cashFlowData.equipmentPurchases, isInflow: false },
        { name: "Investissements logiciels", amount: cashFlowData.softwareInvestments, isInflow: false },
        { name: "Flux net d'investissement", amount: cashFlowData.netInvestingCashFlow, isSubtotal: true }
      ]
    },
    {
      title: "FLUX DE TRÉSORERIE DE FINANCEMENT",
      items: [
        { name: "Apport en capital", amount: cashFlowData.initialCapitalInvestment, isInflow: true },
        { name: "Dividendes versés", amount: cashFlowData.dividendsPaid, isInflow: false },
        { name: "Flux net de financement", amount: cashFlowData.netFinancingCashFlow, isSubtotal: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047]">Tableau de Flux de Trésorerie</CardTitle>
          <CardDescription>
            Analyse des mouvements de trésorerie par activité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tableau principal */}
            <div className="lg:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-3/4">Description</TableHead>
                    <TableHead className="text-right">Montant (USD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlowSections.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      <TableRow>
                        <TableCell colSpan={2} className="font-bold text-[#43A047] bg-[#43A047]/10 py-3">
                          {section.title}
                        </TableCell>
                      </TableRow>
                      {section.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex} className={item.isSubtotal ? "border-t-2 font-bold" : ""}>
                          <TableCell className={item.isSubtotal ? "pl-4 font-bold" : "pl-8"}>
                            {item.name}
                          </TableCell>
                          <TableCell className={`text-right ${
                            item.isSubtotal 
                              ? "font-bold text-[#43A047]" 
                              : item.isInflow 
                                ? "text-green-600" 
                                : "text-red-600"
                          }`}>
                            {item.amount >= 0 ? '' : ''}
                            {Math.abs(item.amount).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Résumé final */}
                  <TableRow className="border-t-4 border-[#43A047]">
                    <TableCell colSpan={2} className="font-bold text-[#43A047] bg-[#43A047]/10 py-3">
                      VARIATION NETTE DE TRÉSORERIE
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-4 font-bold">Variation nette de trésorerie</TableCell>
                    <TableCell className={`text-right font-bold ${cashFlowData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cashFlowData.netCashFlow >= 0 ? '+' : ''}{cashFlowData.netCashFlow.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-4">Trésorerie en début de période</TableCell>
                    <TableCell className="text-right">{cashFlowData.beginningCash.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="pl-4 font-bold">Trésorerie en fin de période</TableCell>
                    <TableCell className="text-right font-bold text-[#43A047]">
                      {cashFlowData.endingCash.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Résumé et indicateurs */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé des Flux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Exploitation:</span>
                    <span className={`font-bold ${cashFlowData.netOperatingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cashFlowData.netOperatingCashFlow >= 0 ? '+' : ''}{cashFlowData.netOperatingCashFlow.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investissement:</span>
                    <span className={`font-bold ${cashFlowData.netInvestingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cashFlowData.netInvestingCashFlow >= 0 ? '+' : ''}{cashFlowData.netInvestingCashFlow.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financement:</span>
                    <span className={`font-bold ${cashFlowData.netFinancingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cashFlowData.netFinancingCashFlow >= 0 ? '+' : ''}{cashFlowData.netFinancingCashFlow.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Indicateurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ratio de liquidité:</span>
                    <span className="font-bold text-[#43A047]">
                      {(cashFlowData.endingCash / Math.abs(cashFlowData.operatingExpenses)).toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge de trésorerie:</span>
                    <span className="font-bold text-[#43A047]">
                      {((cashFlowData.netOperatingCashFlow / cashFlowData.commissionRevenue) * 100).toFixed(1)}%
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
