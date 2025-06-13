
import React from 'react';

interface ReceiptOtherInfoProps {
  paymentMethod: string;
  status: string;
}

export const ReceiptOtherInfo: React.FC<ReceiptOtherInfoProps> = ({
  paymentMethod,
  status
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>Méthode:</span>
        <span>{paymentMethod === 'agency' ? 'Agence' : 'Mobile Money'}</span>
      </div>
      <div className="flex justify-between">
        <span>Statut:</span>
        <span className="uppercase font-bold">{status}</span>
      </div>
    </div>
  );
};
