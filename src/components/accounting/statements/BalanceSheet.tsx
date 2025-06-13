
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from "@/types";
import { useMemo } from "react";

interface BalanceSheetProps {
  transactions: Transaction[];
}

export function BalanceSheet({ transactions }: BalanceSheetProps) {
  const balanceData = useMemo(() => {
    const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.COMPLETED);
    
    // ACTIFS
    const cashInHand = completedTransactions.reduce((acc, tx) => acc + tx.commissionAmount, 0);
    const accountsReceivable = transactions.filter(tx => tx.status === TransactionStatus.PENDING).reduce((acc, tx) => acc + tx.commissionAmount, 0);
    const totalCurrentAssets = cashInHand + accountsReceivable;
    
    // Actifs immobilisés (estimation)
    const equipment = 50000; // Équipement IT
    const software = 25000; // Licences logicielles
    const totalFixedAssets = equipment + software;
    
    const totalAssets = totalCurrentAssets + totalFixedAssets;
    
    // PASSIFS
    const accountsPayable = 15000; // Fournisseurs
    const taxesPayable = totalCurrentAssets * 0.20; // Estimation taxes
    const totalCurrentLiabilities = accountsPayable + taxesPayable;
    
    // CAPITAUX PROPRES
    const initialCapital = 100000;
    const retainedEarnings = totalAssets - totalCurrentLiabilities - initialCapital;
    const totalEquity = initialCapital + retainedEarnings;
    
    const totalLiabilitiesAndEquity = totalCurrentLiabilities + totalEquity;

    return {
      cashInHand,
      accountsReceivable,
      totalCurrentAssets,
      equipment,
      software,
      totalFixedAssets,
      totalAssets,
      accountsPayable,
      taxesPayable,
      totalCurrentLiabilities,
      initialCapital,
      retainedEarnings,
      totalEquity,
      totalLiabilitiesAndEquity
    };
  }, [transactions]);

  const balanceItems = [
    {
      title: "ACTIFS",
      sections: [
        {
          subtitle: "Actifs Circulants",
          items: [
            { name: "Trésorerie", amount: balanceData.cashInHand },
            { name: "Créances clients", amount: balanceData.accountsReceivable },
            { name: "TOTAL ACTIFS CIRCULANTS", amount: balanceData.totalCurrentAssets, isSubtotal: true }
          ]
        },
        {
          subtitle: "Actifs Immobilisés",
          items: [
            { name: "Équipements", amount: balanceData.equipment },
            { name: "Logiciels", amount: balanceData.software },
            { name: "TOTAL ACTIFS IMMOBILISÉS", amount: balanceData.totalFixedAssets, isSubtotal: true }
          ]
        },
        {
          subtitle: "",
          items: [
            { name: "TOTAL ACTIFS", amount: balanceData.totalAssets, isTotal: true }
          ]
        }
      ]
    },
    {
      title: "PASSIFS ET CAPITAUX PROPRES",
      sections: [
        {
          subtitle: "Passifs à Court Terme",
          items: [
            { name: "Fournisseurs", amount: balanceData.accountsPayable },
            { name: "Taxes à payer", amount: balanceData.taxesPayable },
            { name: "TOTAL PASSIFS", amount: balanceData.totalCurrentLiabilities, isSubtotal: true }
          ]
        },
        {
          subtitle: "Capitaux Propres",
          items: [
            { name: "Capital initial", amount: balanceData.initialCapital },
            { name: "Bénéfices non distribués", amount: balanceData.retainedEarnings },
            { name: "TOTAL CAPITAUX PROPRES", amount: balanceData.totalEquity, isSubtotal: true }
          ]
        },
        {
          subtitle: "",
          items: [
            { name: "TOTAL PASSIFS ET CAPITAUX", amount: balanceData.totalLiabilitiesAndEquity, isTotal: true }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047]">Bilan</CardTitle>
          <CardDescription>
            Situation financière à un moment donné
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {balanceItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-lg font-bold text-[#43A047] mb-4 text-center bg-[#43A047]/10 py-2 rounded">
                  {section.title}
                </h3>
                
                <Table>
                  <TableBody>
                    {section.sections.map((subsection, subsectionIndex) => (
                      <React.Fragment key={subsectionIndex}>
                        {subsection.subtitle && (
                          <TableRow>
                            <TableCell colSpan={2} className="font-semibold text-[#43A047] bg-[#43A047]/5 py-2">
                              {subsection.subtitle}
                            </TableCell>
                          </TableRow>
                        )}
                        {subsection.items.map((item, itemIndex) => (
                          <TableRow key={itemIndex} className={item.isTotal ? "border-t-4 border-[#43A047] font-bold bg-[#43A047]/10" : item.isSubtotal ? "border-t-2 font-semibold" : ""}>
                            <TableCell className={item.isTotal || item.isSubtotal ? "font-bold pl-4" : "pl-8"}>
                              {item.name}
                            </TableCell>
                            <TableCell className={`text-right ${item.isTotal ? "font-bold text-[#43A047] text-lg" : item.isSubtotal ? "font-semibold text-[#43A047]" : ""}`}>
                              {item.amount.toLocaleString()} USD
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>

          {/* Vérification de l'équilibre */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Vérification de l'équilibre du bilan:</p>
              <p className={`font-bold ${Math.abs(balanceData.totalAssets - balanceData.totalLiabilitiesAndEquity) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(balanceData.totalAssets - balanceData.totalLiabilitiesAndEquity) < 0.01 
                  ? "✓ Bilan équilibré" 
                  : `⚠️ Écart: ${Math.abs(balanceData.totalAssets - balanceData.totalLiabilitiesAndEquity).toFixed(2)} USD`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
