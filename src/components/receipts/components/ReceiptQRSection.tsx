
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptQRSectionProps {
  verificationUrl: string;
  transactionId: string;
}

export const ReceiptQRSection: React.FC<ReceiptQRSectionProps> = ({
  verificationUrl,
  transactionId
}) => {
  return (
    <div className="flex flex-col items-center my-3 space-y-2">
      <QRCodeSVG 
        value={verificationUrl}
        size={60}
        level="H"
        includeMargin={true}
      />
      <div className="text-center text-xs">
        <div>Scannez pour vérifier</div>
        <div className="font-bold">ou utilisez le code: {transactionId}</div>
      </div>
    </div>
  );
};
