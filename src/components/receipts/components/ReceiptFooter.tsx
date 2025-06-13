
import React from 'react';

export const ReceiptFooter: React.FC = () => {
  return (
    <div className="text-center border-t-2 border-black pt-2 space-y-1">
      <div className="text-xs">Merci de votre confiance</div>
      <div className="text-xs">Gardez ce reçu précieusement</div>
      <div className="text-xs">Service Client: +243 XXX XXX XXX</div>
      <div className="text-xs font-bold">Vérification: {window.location.origin}/verify</div>
    </div>
  );
};
