
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RecipientFormProps {
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientPhone: string;
  setRecipientPhone: (value: string) => void;
}

export function RecipientForm({
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone
}: RecipientFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-2">Informations du bénéficiaire *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipient-name">Nom complet *</Label>
          <Input
            id="recipient-name"
            placeholder="Nom du bénéficiaire"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient-phone">Téléphone *</Label>
          <Input
            id="recipient-phone"
            placeholder="Numéro de téléphone"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
