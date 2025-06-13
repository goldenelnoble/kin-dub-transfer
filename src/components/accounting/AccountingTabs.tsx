
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralLedger } from "./GeneralLedger";
import { FinancialStatements } from "./FinancialStatements";
import { AccountingReports } from "./AccountingReports";
import { CashFlowAnalysis } from "./CashFlowAnalysis";
import { Book, FileText, BarChart, DollarSign } from "lucide-react";

export function AccountingTabs() {
  return (
    <div className="p-6">
      <Tabs defaultValue="ledger" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="ledger" className="flex items-center space-x-2">
            <Book className="h-4 w-4" />
            <span>Grand Livre</span>
          </TabsTrigger>
          <TabsTrigger value="statements" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>États Financiers</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Rapports</span>
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Flux de Trésorerie</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-4">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <FinancialStatements />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AccountingReports />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <CashFlowAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
