import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Currency, 
  PaymentMethod, 
  TransactionDirection,
  TransactionStatus 
} from "@/types";
import { AVAILABLE_CURRENCIES, CURRENCY_SYMBOLS, DEFAULT_COMMISSION_PERCENTAGES, MOBILE_MONEY_NETWORKS } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TransactionForm() {
  const navigate = useNavigate();
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
    // Update default commission when direction changes
    setCommissionPercentage(DEFAULT_COMMISSION_PERCENTAGES[newDirection].toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }
    
    if (!senderName || !senderPhone || !senderIdNumber) {
      toast.error("Veuillez compléter les informations de l'expéditeur");
      return;
    }
    
    if (!recipientName || !recipientPhone) {
      toast.error("Veuillez compléter les informations du bénéficiaire");
      return;
    }
    
    if (paymentMethod === PaymentMethod.MOBILE_MONEY && !mobileMoneyNetwork) {
      toast.error("Veuillez sélectionner un réseau de mobile money");
      return;
    }
    
    // Create transaction object
    const transactionId = "TXN" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const now = new Date();
    
    const transaction = {
      id: transactionId,
      direction,
      amount: amountValue,
      currency,
      commissionPercentage: commissionValue,
      commissionAmount,
      paymentMethod,
      mobileMoneyNetwork: mobileMoneyNetwork || undefined,
      status: TransactionStatus.PENDING,
      sender: {
        name: senderName,
        phone: senderPhone,
        idNumber: senderIdNumber,
        idType: senderIdType
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone
      },
      notes: notes || undefined,
      createdBy: "Operator User",
      createdAt: now,
      updatedAt: now
    };
    
    console.log("Transaction created:", transaction);
    
    // Ajouter la transaction à la liste existante dans le localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = [transaction, ...existingTransactions];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    toast.success("Transaction créée avec succès", {
      description: `Identifiant: ${transactionId}`,
      action: {
        label: "Voir les transactions",
        onClick: () => navigate("/transactions")
      }
    });
    
    // Reset form
    setAmount("");
    setSenderName("");
    setSenderPhone("");
    setSenderIdNumber("");
    setRecipientName("");
    setRecipientPhone("");
    setNotes("");
    
    // Rediriger vers la liste des transactions
    navigate("/transactions");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nouvelle Transaction</CardTitle>
        <CardDescription>Créer une nouvelle transaction de transfert d'argent</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="amount">Montant</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  <Label htmlFor="mobile-network">Réseau Mobile Money</Label>
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
                          // Filter networks by country based on direction
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
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Informations de l'expéditeur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Nom complet</Label>
                  <Input
                    id="sender-name"
                    placeholder="Nom de l'expéditeur"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-phone">Téléphone</Label>
                  <Input
                    id="sender-phone"
                    placeholder="Numéro de téléphone"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-id-type">Type de pièce d'identité</Label>
                  <Select value={senderIdType} onValueChange={setSenderIdType}>
                    <SelectTrigger id="sender-id-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passeport</SelectItem>
                      <SelectItem value="id_card">Carte d'identité</SelectItem>
                      <SelectItem value="driving_license">Permis de conduire</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-id-number">Numéro de pièce d'identité</Label>
                  <Input
                    id="sender-id-number"
                    placeholder="Numéro de la pièce d'identité"
                    value={senderIdNumber}
                    onChange={(e) => setSenderIdNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Informations du bénéficiaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Nom complet</Label>
                  <Input
                    id="recipient-name"
                    placeholder="Nom du bénéficiaire"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-phone">Téléphone</Label>
                  <Input
                    id="recipient-phone"
                    placeholder="Numéro de téléphone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>
              </div>
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
          
          <div className="border rounded-md p-4 bg-muted/50">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Montant:</span>
                <span>{currencySymbol}{parseFloat(amount || "0").toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission ({commissionPercentage}%):</span>
                <span>{currencySymbol}{commissionAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total à payer:</span>
                <span>{currencySymbol}{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-app-blue-500 hover:bg-app-blue-600">
              Créer la transaction
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
