
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Shield, Database, Trash2, RotateCcw, Save, RefreshCw, DollarSign, Percent } from "lucide-react";
import { DataManagementService, AuditLogEntry } from "@/services/DataManagementService";
import { UserRole, Currency } from "@/types";
import { useNavigate } from "react-router-dom";
import { DEFAULT_COMMISSION_PERCENTAGES, CURRENCY_SYMBOLS, AVAILABLE_CURRENCIES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminSettings() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<null | 'reset' | 'backup' | 'restore' | 'saveFinance'>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => DataManagementService.getAuditLog());
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtrer les logs d'audit
  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save financial settings
  const saveFinancialSettings = () => {
    setPendingAction('saveFinance');
    setIsConfirmPasswordOpen(true);
  };

  // Exécuter l'action après confirmation
  const executeAction = () => {
    // Dans un système réel, on vérifierait le mot de passe avec le backend
    // Ici on simule une vérification basique
    const isPasswordValid = password === 'admin123';
    
    if (!isPasswordValid) {
      toast.error("Mot de passe incorrect");
      return;
    }
    
    if (pendingAction === 'reset') {
      const success = DataManagementService.resetAllData(user);
      if (success) {
        toast.success("Toutes les données ont été réinitialisées avec succès");
      } else {
        toast.error("Une erreur est survenue lors de la réinitialisation");
      }
    } else if (pendingAction === 'backup') {
      const success = DataManagementService.createBackup(user);
      if (success) {
        toast.success("Sauvegarde créée avec succès");
      } else {
        toast.error("Une erreur est survenue lors de la création de la sauvegarde");
      }
    } else if (pendingAction === 'restore') {
      const success = DataManagementService.restoreFromBackup(user);
      if (success) {
        toast.success("Données restaurées avec succès");
      } else {
        toast.error("Une erreur est survenue lors de la restauration de la sauvegarde");
      }
    } else if (pendingAction === 'saveFinance') {
      // Simuler la sauvegarde des paramètres financiers
      // Dans une vraie application, vous appelleriez un service pour mettre à jour ces valeurs dans la base de données
      const updatedSettings = {
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
      
      // Log l'action dans le journal d'audit
      DataManagementService.addAuditLogEntry({
        id: String(Date.now()),
        date: new Date().toISOString(),
        user: user?.name || "Unknown",
        action: "Mise à jour des paramètres financiers",
        status: "Succès",
        details: `Commissions: ${kinshasaToDubaiCommission}% / ${dubaiToKinshasaCommission}%, Devise par défaut: ${defaultCurrency}`
      });
      
      // Mettre à jour les logs d'audit pour l'affichage
      setAuditLogs(DataManagementService.getAuditLog());
      
      toast.success("Paramètres financiers mis à jour avec succès");
    }
    
    // Rafraîchir les logs
    setAuditLogs(DataManagementService.getAuditLog());
    
    // Réinitialiser
    setPassword("");
    setIsConfirmPasswordOpen(false);
    setPendingAction(null);
  };

  const statusColors: Record<string, string> = {
    "Succès": "text-green-500",
    "Échec": "text-red-500",
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Shield className="h-10 w-10 text-[#43A047]" />
          <div>
            <h1 className="text-3xl font-bold text-[#F97316]">Administration Système</h1>
            <p className="text-[#43A047]">
              Configuration et gestion des données de l'application
            </p>
          </div>
        </div>

        <Tabs defaultValue="finance" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="finance">Paramètres Financiers</TabsTrigger>
            <TabsTrigger value="data">Gestion des données</TabsTrigger>
            <TabsTrigger value="audit">Journal d'audit complet</TabsTrigger>
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
                      <p className="text-xs text-gray-500">
                        Taux appliqué aux transferts de Kinshasa vers Dubai
                      </p>
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
                      <p className="text-xs text-gray-500">
                        Taux appliqué aux transferts de Dubai vers Kinshasa
                      </p>
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
          
          <TabsContent value="data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-amber-50">
                  <CardTitle className="text-[#F97316]">Sauvegarde et restauration</CardTitle>
                  <CardDescription>
                    Créer des points de sauvegarde et restaurer en cas de besoin
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Les sauvegardes contiennent toutes les données de l'application, y compris les transactions et les journaux d'audit.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#43A047] text-[#43A047] hover:bg-[#43A047] hover:text-white"
                    onClick={() => {
                      setPendingAction('backup');
                      setIsConfirmPasswordOpen(true);
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Créer une sauvegarde
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                    onClick={() => {
                      setPendingAction('restore');
                      setIsConfirmPasswordOpen(true);
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restaurer la dernière sauvegarde
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-500">Réinitialisation des données</CardTitle>
                  <CardDescription>
                    Effacer toutes les données de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-red-600 mb-4">
                    Cette action supprimera toutes les transactions et réinitialisera le système. Les logs de sécurité seront conservés. Cette action est irréversible.
                  </p>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tout réinitialiser
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Réinitialisation complète du système</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous absolument sûr ? Cette action supprimera toutes les transactions et données du système, et créera automatiquement une sauvegarde avant de procéder.
                          <br /><br />
                          <span className="font-bold text-red-500">Cette action est irréversible</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          setPendingAction('reset');
                          setIsConfirmPasswordOpen(true);
                        }}>
                          Continuer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Journal d'audit complet</span>
                  <div className="w-64">
                    <Input 
                      placeholder="Rechercher..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardTitle>
                <CardDescription>
                  Historique complet des actions système importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Détails</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Aucune entrée de journal trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-[#F2C94C]">{formatDate(entry.date)}</TableCell>
                          <TableCell>{entry.action}</TableCell>
                          <TableCell>{entry.user}</TableCell>
                          <TableCell className={statusColors[entry.status] || ""}>{entry.status}</TableCell>
                          <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={isConfirmPasswordOpen} onOpenChange={setIsConfirmPasswordOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation requise</AlertDialogTitle>
              <AlertDialogDescription>
                Pour des raisons de sécurité, veuillez confirmer votre mot de passe pour continuer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input 
                type="password" 
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={executeAction}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
