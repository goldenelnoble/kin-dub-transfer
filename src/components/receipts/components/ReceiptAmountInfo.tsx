
import React from 'react';

interface ReceiptAmountInfoProps {
  amount: number;
  currency: string;
  commissionPercentage: number;
  commissionAmount: number;
  receivingAmount: number;
}

export const ReceiptAmountInfo: React.FC<ReceiptAmountInfoProps> = ({
  amount,
  currency,
  commissionPercentage,
  commissionAmount,
  receivingAmount
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>Montant envoyé:</span>
        <span>{amount.toLocaleString()} {currency}</span>
      </div>
      <div className="flex justify-between">
        <span>Commission ({commissionPercentage}%):</span>
        <span>{commissionAmount.toLocaleString()} {currency}</span>
      </div>
      <div className="border-t border-dashed border-black my-1"></div>
      <div className="flex justify-between font-bold text-sm">
        <span>TOTAL:</span>
        <span>{(amount + commissionAmount).toLocaleString()} {currency}</span>
      </div>
      <div className="flex justify-between">
        <span>A recevoir:</span>
        <span>{receivingAmount.toLocaleString()} {currency}</span>
      </div>
    </div>
  );
};
