
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionService } from "@/services/TransactionService";
import { Transaction, TransactionStatus } from "@/types";
import { IncomeStatement } from "./statements/IncomeStatement";
import { BalanceSheet } from "./statements/BalanceSheet";
import { CashFlowStatement } from "./statements/CashFlowStatement";
import { FileText, TrendingUp, DollarSign } from "lucide-react";

export function FinancialStatements() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#43A047]"></div>
        <span className="ml-2">Chargement des états financiers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#43A047] flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>États Financiers</span>
          </CardTitle>
          <CardDescription>
            Analyse financière complète de votre activité de transfert d'argent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="income" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="income" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Compte de Résultat</span>
              </TabsTrigger>
              <TabsTrigger value="balance" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Bilan</span>
              </TabsTrigger>
              <TabsTrigger value="cashflow" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Flux de Trésorerie</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="income">
              <IncomeStatement transactions={transactions} />
            </TabsContent>

            <TabsContent value="balance">
              <BalanceSheet transactions={transactions} />
            </TabsContent>

            <TabsContent value="cashflow">
              <CashFlowStatement transactions={transactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
