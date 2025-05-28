
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";
import { 
  Currency, 
  PaymentMethod, 
  TransactionDirection 
} from "@/types";
import { AVAILABLE_CURRENCIES, CURRENCY_SYMBOLS, MOBILE_MONEY_NETWORKS } from "@/lib/constants";

interface TransactionDetailsFormProps {
  direction: TransactionDirection;
  setDirection: (value: TransactionDirection) => void;
  amount: string;
  setAmount: (value: string) => void;
  currency: Currency;
  setCurrency: (value: Currency) => void;
  commissionPercentage: string;
  setCommissionPercentage: (value: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  mobileMoneyNetwork: string;
  setMobileMoneyNetwork: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  onDirectionChange: (direction: TransactionDirection) => void;
}

export function TransactionDetailsForm({
  direction,
  setDirection,
  amount,
  setAmount,
  currency,
  setCurrency,
  commissionPercentage,
  setCommissionPercentage,
  paymentMethod,
  setPaymentMethod,
  mobileMoneyNetwork,
  setMobileMoneyNetwork,
  notes,
  setNotes,
  onDirectionChange
}: TransactionDetailsFormProps) {
  const handleDirectionChange = (newDirection: TransactionDirection) => {
    setDirection(newDirection);
    onDirectionChange(newDirection);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Direction du transfert</Label>
        <RadioGroup 
          className="grid grid-cols-2 gap-4 pt-2"
          value={direction}
          onValueChange={(value) => handleDirectionChange(value as TransactionDirection)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TransactionDirection.KINSHASA_TO_DUBAI} id="kinshasa-to-dubai" />
            <Label htmlFor="kinshasa-to-dubai" className="flex items-center">
              <span>Kinshasa</span>
              <ArrowRight className="h-4 w-4 mx-1" />
              <span>Dubaï</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TransactionDirection.DUBAI_TO_KINSHASA} id="dubai-to-kinshasa" />
            <Label htmlFor="dubai-to-kinshasa" className="flex items-center">
              <span>Dubaï</span>
              <ArrowRight className="h-4 w-4 mx-1" />
              <span>Kinshasa</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Montant *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_CURRENCIES.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {curr} ({CURRENCY_SYMBOLS[curr]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commission">Commission (%)</Label>
          <Input
            id="commission"
            type="number"
            step="0.1"
            placeholder="3.5"
            value={commissionPercentage}
            onChange={(e) => setCommissionPercentage(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mode de paiement</Label>
          <RadioGroup 
            className="flex items-center space-x-4 pt-2"
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethod.AGENCY} id="agency" />
              <Label htmlFor="agency">Agence</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={PaymentMethod.MOBILE_MONEY} id="mobile-money" />
              <Label htmlFor="mobile-money">Mobile Money</Label>
            </div>
          </RadioGroup>
        </div>
        
        {paymentMethod === PaymentMethod.MOBILE_MONEY && (
          <div className="space-y-2">
            <Label htmlFor="mobile-network">Réseau Mobile Money *</Label>
            <Select 
              value={mobileMoneyNetwork} 
              onValueChange={setMobileMoneyNetwork}
            >
              <SelectTrigger id="mobile-network">
                <SelectValue placeholder="Sélectionner un réseau" />
              </SelectTrigger>
              <SelectContent>
                {MOBILE_MONEY_NETWORKS
                  .filter(network => network.active)
                  .filter(network => {
                    if (direction === TransactionDirection.KINSHASA_TO_DUBAI) {
                      return network.country === "Congo DRC";
                    } else {
                      return network.country === "UAE";
                    }
                  })
                  .map(network => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Input
          id="notes"
          placeholder="Ajouter des commentaires ou des notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
