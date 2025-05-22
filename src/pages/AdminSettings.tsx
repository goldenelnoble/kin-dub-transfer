
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
import { Shield, Database, Trash2, RotateCcw, Save, RefreshCw } from "lucide-react";
import { DataManagementService, AuditLogEntry } from "@/services/DataManagementService";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<null | 'reset' | 'backup' | 'restore'>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => DataManagementService.getAuditLog());
  const [searchTerm, setSearchTerm] = useState("");

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

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="data">Gestion des données</TabsTrigger>
            <TabsTrigger value="audit">Journal d'audit complet</TabsTrigger>
          </TabsList>
          
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
