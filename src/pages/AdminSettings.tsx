
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shield, Database, RotateCcw, Save, DollarSign, Percent } from "lucide-react";
import { UserRole, Currency } from "@/types";
import { useNavigate } from "react-router-dom";
import { DEFAULT_COMMISSION_PERCENTAGES, CURRENCY_SYMBOLS, AVAILABLE_CURRENCIES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemResetService } from "@/services/SystemResetService";

export default function AdminSettings() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Financial parameters state
  const [kinshasaToDubaiCommission, setKinshasaToDubaiCommission] = useState(DEFAULT_COMMISSION_PERCENTAGES.kinshasa_to_dubai);
  const [dubaiToKinshasaCommission, setDubaiToKinshasaCommission] = useState(DEFAULT_COMMISSION_PERCENTAGES.dubai_to_kinshasa);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(Currency.USD);
  const [minTransactionAmount, setMinTransactionAmount] = useState(10);
  const [maxTransactionAmount, setMaxTransactionAmount] = useState(100000);

  // Vérifier les autorisations
  if (!hasPermission("canConfigureSystem")) {
    toast.error("Vous n'avez pas accès à cette page");
    navigate("/dashboard");
  }

  // Save financial settings
  const saveFinancialSettings = () => {
    try {
      const settings = {
        commissionPercentages: {
          kinshasa_to_dubai: kinshasaToDubaiCommission,
          dubai_to_kinshasa: dubaiToKinshasaCommission,
        },
        defaultCurrency,
        transactionLimits: {
          min: minTransactionAmount,
          max: maxTransactionAmount,
        }
      };
      
      localStorage.setItem('financial_settings', JSON.stringify(settings));
      toast.success("Paramètres financiers sauvegardés avec succès");
      console.log('AdminSettings: Financial settings saved:', settings);
      
    } catch (error) {
      console.error('AdminSettings: Error saving financial settings:', error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    }
  };

  // Reset system
  const handleResetSystem = async () => {
    // Simple password check (in real app, this would be more secure)
    if (password !== 'admin123') {
      toast.error("Mot de passe incorrect");
      return;
    }
    
    setIsResetting(true);
    
    try {
      console.log('AdminSettings: Starting system reset...');
      const success = await SystemResetService.resetSystem({
        resetTransactions: true,
        resetUsers: false,
        resetSettings: false
      });
      
      if (success) {
        toast.success("Système réinitialisé avec succès ! Rechargement en cours...");
      }
    } catch (error) {
      console.error('AdminSettings: Error during system reset:', error);
      toast.error("Erreur lors de la réinitialisation du système");
    } finally {
      setIsResetting(false);
      setPassword("");
      setIsConfirmPasswordOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Shield className="h-10 w-10 text-[#43A047]" />
          <div>
            <h1 className="text-3xl font-bold text-[#F97316]">Administration Système</h1>
            <p className="text-[#43A047]">
              Configuration et gestion synchronisée du système
            </p>
          </div>
        </div>

        <Tabs defaultValue="finance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="finance">Paramètres Financiers</TabsTrigger>
            <TabsTrigger value="system">Gestion Système</TabsTrigger>
          </TabsList>
          
          <TabsContent value="finance">
            <Card>
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center gap-2 text-[#F97316]">
                  <DollarSign className="h-5 w-5" />
                  Paramètres Financiers
                </CardTitle>
                <CardDescription>
                  Configuration des commissions et autres paramètres financiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Commissions de transaction</h3>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="kinshasa-dubai">
                        Commission Kinshasa → Dubai (%)
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="kinshasa-dubai"
                          type="number"
                          step="0.01"
                          min="0"
                          max="20"
                          value={kinshasaToDubaiCommission}
                          onChange={(e) => setKinshasaToDubaiCommission(parseFloat(e.target.value))}
                          className="mr-2"
                        />
                        <Percent className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dubai-kinshasa">
                        Commission Dubai → Kinshasa (%)
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="dubai-kinshasa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="20"
                          value={dubaiToKinshasaCommission}
                          onChange={(e) => setDubaiToKinshasaCommission(parseFloat(e.target.value))}
                          className="mr-2"
                        />
                        <Percent className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Devises et limites</h3>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Devise par défaut</Label>
                      <Select
                        value={defaultCurrency}
                        onValueChange={(value) => setDefaultCurrency(value as Currency)}
                      >
                        <SelectTrigger id="default-currency">
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_CURRENCIES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency} ({CURRENCY_SYMBOLS[currency]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="min-amount">Montant minimum (USD)</Label>
                      <Input
                        id="min-amount"
                        type="number"
                        min="1"
                        value={minTransactionAmount}
                        onChange={(e) => setMinTransactionAmount(parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-amount">Montant maximum (USD)</Label>
                      <Input
                        id="max-amount"
                        type="number"
                        min="1"
                        value={maxTransactionAmount}
                        onChange={(e) => setMaxTransactionAmount(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={saveFinancialSettings}
                  className="ml-auto bg-[#43A047] hover:bg-[#2E7D32]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <Database className="h-5 w-5" />
                  Réinitialisation du Système
                </CardTitle>
                <CardDescription>
                  Remettre les compteurs à zéro et nettoyer toutes les données
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-red-600">
                    Cette action supprimera toutes les transactions, expéditeurs et bénéficiaires de la base de données.
                    Le système sera remis à zéro complet pour une synchronisation parfaite.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Action irréversible - Toutes les données seront perdues
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {isResetting ? "Réinitialisation..." : "Remettre à Zéro"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Réinitialisation complète du système</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous absolument sûr ? Cette action supprimera TOUTES les données :
                        <br />• Toutes les transactions
                        <br />• Tous les expéditeurs  
                        <br />• Tous les bénéficiaires
                        <br /><br />
                        <span className="font-bold text-red-500">Cette action est irréversible</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setIsConfirmPasswordOpen(true)}>
                        Continuer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={isConfirmPasswordOpen} onOpenChange={setIsConfirmPasswordOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation requise</AlertDialogTitle>
              <AlertDialogDescription>
                Pour des raisons de sécurité, veuillez confirmer votre mot de passe pour la réinitialisation complète.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input 
                type="password" 
                placeholder="Mot de passe (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isResetting}>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetSystem}
                disabled={isResetting}
              >
                {isResetting ? "Réinitialisation..." : "Confirmer la réinitialisation"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
