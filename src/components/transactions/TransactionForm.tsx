
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Currency, 
  PaymentMethod, 
  TransactionDirection,
  TransactionStatus 
} from "@/types";
import { CURRENCY_SYMBOLS, DEFAULT_COMMISSION_PERCENTAGES } from "@/lib/constants";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { TransactionService } from "@/services/TransactionService";
import { TransactionDetailsForm } from "../forms/TransactionDetailsForm";
import { SenderForm } from "../forms/SenderForm";
import { RecipientForm } from "../forms/RecipientForm";

export function TransactionForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [direction, setDirection] = useState<TransactionDirection>(TransactionDirection.KINSHASA_TO_DUBAI);
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [commissionPercentage, setCommissionPercentage] = useState<string>(
    DEFAULT_COMMISSION_PERCENTAGES[TransactionDirection.KINSHASA_TO_DUBAI].toString()
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.AGENCY);
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [senderPhone, setSenderPhone] = useState<string>("");
  const [senderIdNumber, setSenderIdNumber] = useState<string>("");
  const [senderIdType, setSenderIdType] = useState<string>("passport");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Calculate commission and final amount
  const amountValue = parseFloat(amount) || 0;
  const commissionValue = parseFloat(commissionPercentage) || 0;
  const commissionAmount = (amountValue * commissionValue) / 100;
  const totalAmount = amountValue + commissionAmount;
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  const handleDirectionChange = (newDirection: TransactionDirection) => {
    setDirection(newDirection);
    setCommissionPercentage(DEFAULT_COMMISSION_PERCENTAGES[newDirection].toString());
    console.log('TransactionForm: Direction changed to:', newDirection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log('TransactionForm: Starting form submission...');
    
    // Valider les champs requis
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }
    
    if (!senderName.trim() || !senderPhone.trim() || !senderIdNumber.trim()) {
      toast.error("Veuillez compléter les informations de l'expéditeur");
      return;
    }
    
    if (!recipientName.trim() || !recipientPhone.trim()) {
      toast.error("Veuillez compléter les informations du bénéficiaire");
      return;
    }
    
    if (paymentMethod === PaymentMethod.MOBILE_MONEY && !mobileMoneyNetwork) {
      toast.error("Veuillez sélectionner un réseau de mobile money");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('TransactionForm: Creating transaction with data:', {
        direction,
        amount: amountValue,
        currency,
        paymentMethod,
        sender: { name: senderName, phone: senderPhone },
        recipient: { name: recipientName, phone: recipientPhone }
      });
      
      const transaction = {
        direction,
        amount: amountValue,
        receivingAmount: amountValue,
        currency,
        commissionPercentage: commissionValue,
        commissionAmount,
        paymentMethod,
        mobileMoneyNetwork: mobileMoneyNetwork || undefined,
        status: TransactionStatus.PENDING,
        sender: {
          name: senderName.trim(),
          phone: senderPhone.trim(),
          idNumber: senderIdNumber.trim(),
          idType: senderIdType
        },
        recipient: {
          name: recipientName.trim(),
          phone: recipientPhone.trim()
        },
        notes: notes.trim() || undefined,
        createdBy: "Operator User"
      };
      
      const createdTransaction = await TransactionService.createTransaction(transaction);
      console.log('TransactionForm: Transaction created successfully:', createdTransaction.id);
      
      toast.success("Transaction créée avec succès !", {
        description: `ID: ${createdTransaction.id.slice(0, 8)}... - Montant: ${currencySymbol}${amountValue.toLocaleString()}`,
        action: {
          label: "Voir les transactions",
          onClick: () => navigate("/transactions")
        }
      });
      
      // Réinitialiser le formulaire
      setAmount("");
      setSenderName("");
      setSenderPhone("");
      setSenderIdNumber("");
      setRecipientName("");
      setRecipientPhone("");
      setNotes("");
      setMobileMoneyNetwork("");
      
      // Rediriger vers la liste des transactions après un délai
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
      
    } catch (error) {
      console.error("TransactionForm: Error creating transaction:", error);
      toast.error("Erreur lors de la création de la transaction", {
        description: "Veuillez vérifier les données et réessayer"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nouvelle Transaction</CardTitle>
        <CardDescription>
          Créer une nouvelle transaction synchronisée avec la base de données
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransactionDetailsForm
            direction={direction}
            setDirection={setDirection}
            amount={amount}
            setAmount={setAmount}
            currency={currency}
            setCurrency={setCurrency}
            commissionPercentage={commissionPercentage}
            setCommissionPercentage={setCommissionPercentage}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            mobileMoneyNetwork={mobileMoneyNetwork}
            setMobileMoneyNetwork={setMobileMoneyNetwork}
            notes={notes}
            setNotes={setNotes}
            onDirectionChange={handleDirectionChange}
          />
          
          <SenderForm
            senderName={senderName}
            setSenderName={setSenderName}
            senderPhone={senderPhone}
            setSenderPhone={setSenderPhone}
            senderIdNumber={senderIdNumber}
            setSenderIdNumber={setSenderIdNumber}
            senderIdType={senderIdType}
            setSenderIdType={setSenderIdType}
          />
          
          <RecipientForm
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            recipientPhone={recipientPhone}
            setRecipientPhone={setRecipientPhone}
          />
          
          <div className="border rounded-md p-4 bg-muted/50">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Montant:</span>
                <span className="font-medium">{currencySymbol}{amountValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission ({commissionValue}%):</span>
                <span className="font-medium">{currencySymbol}{commissionAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total à payer:</span>
                <span className="text-[#F97316]">{currencySymbol}{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          className="w-full bg-[#43A047] hover:bg-[#2E7D32]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création en cours..." : "Créer la transaction"}
        </Button>
      </CardFooter>
    </Card>
  );
}
