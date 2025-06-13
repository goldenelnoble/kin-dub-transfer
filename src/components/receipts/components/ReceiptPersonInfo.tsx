
import React from 'react';

interface Person {
  name: string;
  phone: string;
}

interface ReceiptPersonInfoProps {
  sender: Person;
  recipient: Person;
}

export const ReceiptPersonInfo: React.FC<ReceiptPersonInfoProps> = ({
  sender,
  recipient
}) => {
  return (
    <>
      {/* Expéditeur */}
      <div>
        <div className="font-bold mb-1">EXPEDITEUR:</div>
        <div className="flex justify-between text-xs">
          <span>Nom:</span>
          <span className="truncate ml-2">{sender.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Tel:</span>
          <span>{sender.phone}</span>
        </div>
      </div>

      {/* Destinataire */}
      <div>
        <div className="font-bold mb-1">DESTINATAIRE:</div>
        <div className="flex justify-between text-xs">
          <span>Nom:</span>
          <span className="truncate ml-2">{recipient.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Tel:</span>
          <span>{recipient.phone}</span>
        </div>
      </div>
    </>
  );
};
