
import React from 'react';
import { formatDate } from "@/lib/utils";

interface ReceiptTransactionInfoProps {
  transactionId: string;
  createdAt: Date;
  direction: string;
}

export const ReceiptTransactionInfo: React.FC<ReceiptTransactionInfoProps> = ({
  transactionId,
  createdAt,
  direction
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>Date:</span>
        <span>{formatDate(createdAt)}</span>
      </div>
      <div className="flex justify-between">
        <span>ID Trans:</span>
        <span className="font-bold">{transactionId}</span>
      </div>
      <div className="flex justify-between">
        <span>Direction:</span>
        <span>{direction === 'kinshasa_to_dubai' ? 'KIN→DXB' : 'DXB→KIN'}</span>
      </div>
    </div>
  );
};
