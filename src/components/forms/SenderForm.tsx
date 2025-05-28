
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SenderFormProps {
  senderName: string;
  setSenderName: (value: string) => void;
  senderPhone: string;
  setSenderPhone: (value: string) => void;
  senderIdNumber: string;
  setSenderIdNumber: (value: string) => void;
  senderIdType: string;
  setSenderIdType: (value: string) => void;
}

export function SenderForm({
  senderName,
  setSenderName,
  senderPhone,
  setSenderPhone,
  senderIdNumber,
  setSenderIdNumber,
  senderIdType,
  setSenderIdType
}: SenderFormProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-2">Informations de l'expéditeur *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sender-name">Nom complet *</Label>
          <Input
            id="sender-name"
            placeholder="Nom de l'expéditeur"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sender-phone">Téléphone *</Label>
          <Input
            id="sender-phone"
            placeholder="Numéro de téléphone"
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            required
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
          <Label htmlFor="sender-id-number">Numéro de pièce d'identité *</Label>
          <Input
            id="sender-id-number"
            placeholder="Numéro de la pièce d'identité"
            value={senderIdNumber}
            onChange={(e) => setSenderIdNumber(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
