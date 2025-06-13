
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types";
import { ReceiptHeader } from "./components/ReceiptHeader";
import { ReceiptTransactionInfo } from "./components/ReceiptTransactionInfo";
import { ReceiptPersonInfo } from "./components/ReceiptPersonInfo";
import { ReceiptAmountInfo } from "./components/ReceiptAmountInfo";
import { ReceiptOtherInfo } from "./components/ReceiptOtherInfo";
import { ReceiptQRSection } from "./components/ReceiptQRSection";
import { ReceiptFooter } from "./components/ReceiptFooter";
import { ReceiptActions } from "./components/ReceiptActions";
import { useReceiptActions } from "./hooks/useReceiptActions";

interface TransactionReceiptProps {
  transaction: Transaction;
  verificationUrl?: string;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ transaction, verificationUrl }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Générer l'URL de vérification si elle n'est pas fournie
  const getVerificationUrl = () => {
    if (verificationUrl) return verificationUrl;
    return `${window.location.origin}/verify?code=${transaction.id}`;
  };

  const finalVerificationUrl = getVerificationUrl();
  const { printReceipt, downloadPDF } = useReceiptActions(transaction, finalVerificationUrl);

  return (
    <Card className="overflow-hidden max-w-sm mx-auto">
      <CardContent className="p-4" ref={receiptRef}>
        <div className="font-mono text-xs space-y-2" style={{ fontFamily: 'Courier New, monospace' }}>
          <ReceiptHeader />

          <ReceiptTransactionInfo
            transactionId={transaction.id}
            createdAt={transaction.createdAt}
            direction={transaction.direction}
          />

          <div className="border-t border-dashed border-black my-2"></div>

          <ReceiptPersonInfo
            sender={transaction.sender}
            recipient={transaction.recipient}
          />

          <div className="border-t border-dashed border-black my-2"></div>

          <ReceiptAmountInfo
            amount={transaction.amount}
            currency={transaction.currency}
            commissionPercentage={transaction.commissionPercentage}
            commissionAmount={transaction.commissionAmount}
            receivingAmount={transaction.receivingAmount}
          />

          <div className="border-t border-dashed border-black my-2"></div>

          <ReceiptOtherInfo
            paymentMethod={transaction.paymentMethod}
            status={transaction.status}
          />

          <ReceiptQRSection
            verificationUrl={finalVerificationUrl}
            transactionId={transaction.id}
          />

          <ReceiptFooter />

          <ReceiptActions
            onDownloadPDF={downloadPDF}
            onPrint={printReceipt}
          />
        </div>
      </CardContent>
    </Card>
  );
};
