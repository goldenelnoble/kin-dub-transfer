
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Shield, 
  AlertTriangle, 
  Save,
  Clock,
  DollarSign,
  FileText
} from 'lucide-react';
import { OperatorSecurityConfig } from '../OperatorSecurityConfig';
import { toast } from '@/components/ui/sonner';

const OperatorSecuritySettings = () => {
  const [settings, setSettings] = useState(OperatorSecurityConfig);
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    toast.success("Paramètres de sécurité opérateurs sauvegardés");
    setIsDirty(false);
  };

  const updateSetting = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      setIsDirty(true);
      return newSettings;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#43A047]">
            Configuration Sécurité Opérateurs
          </h2>
          <p className="text-muted-foreground">
            Paramètres des contraintes de sécurité pour Dubaï et Kinshasa
          </p>
        </div>
        <Button onClick={handleSave} disabled={!isDirty} className="bg-[#43A047] hover:bg-[#2E7D32]">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical">Contraintes Techniques</TabsTrigger>
          <TabsTrigger value="legal">Contraintes Légales</TabsTrigger>
          <TabsTrigger value="penalties">Sanctions</TabsTrigger>
          <TabsTrigger value="monitoring">Surveillance</TabsTrigger>
        </TabsList>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-[#43A047]" />
                <span>Infrastructure et Redondance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minProviders">Fournisseurs réseau minimum</Label>
                  <Input
                    id="minProviders"
                    type="number"
                    value={settings.technicalConstraints.infrastructure.networkRedundancy.minimumProviders}
                    onChange={(e) => updateSetting(
                      ['technicalConstraints', 'infrastructure', 'networkRedundancy', 'minimumProviders'],
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxLatency">Latence maximale (ms)</Label>
                  <Input
                    id="maxLatency"
                    type="number"
                    value={settings.technicalConstraints.infrastructure.networkRedundancy.maxLatency}
                    onChange={(e) => updateSetting(
                      ['technicalConstraints', 'infrastructure', 'networkRedundancy', 'maxLatency'],
                      parseInt(e.target.value)
                    )}
                  />
                </div>
                
                <div>
                  <Label htmlFor="uptime">Uptime requis (%)</Label>
                  <Input
                    id="uptime"
                    type="number"
                    step="0.1"
                    value={settings.technicalConstraints.infrastructure.networkRedundancy.uptimeRequirement}
                    onChange={(e) => updateSetting(
                      ['technicalConstraints', 'infrastructure', 'networkRedundancy', 'uptimeRequirement'],
                      parseFloat(e.target.value)
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Sécurité Physique</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="biometric">Accès biométrique requis</Label>
                    <Switch
                      id="biometric"
                      checked={settings.technicalConstraints.infrastructure.physicalSecurity.biometricAccess}
                      onCheckedChange={(checked) => updateSetting(
                        ['technicalConstraints', 'infrastructure', 'physicalSecurity', 'biometricAccess'],
                        checked
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="surveillance">Surveillance 24/7</Label>
                    <Badge variant="outline">
                      {settings.technicalConstraints.infrastructure.physicalSecurity.surveillance}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Continuité d'Activité</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="autonomy">Autonomie électrique (heures)</Label>
                    <Input
                      id="autonomy"
                      type="number"
                      value={settings.technicalConstraints.infrastructure.businessContinuity.powerBackup.autonomyHours}
                      onChange={(e) => updateSetting(
                        ['technicalConstraints', 'infrastructure', 'businessContinuity', 'powerBackup', 'autonomyHours'],
                        parseInt(e.target.value)
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recovery">Temps de récupération (minutes)</Label>
                    <Input
                      id="recovery"
                      type="number"
                      value={settings.technicalConstraints.infrastructure.businessContinuity.recoveryTime}
                      onChange={(e) => updateSetting(
                        ['technicalConstraints', 'infrastructure', 'businessContinuity', 'recoveryTime'],
                        parseInt(e.target.value)
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#F97316]" />
                <span>Fenêtres de Maintenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-[#F97316]">🇦🇪 Dubaï</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Fenêtre autorisée</Label>
                      <Input
                        value={settings.technicalConstraints.maintenance.dubai.allowedWindow}
                        onChange={(e) => updateSetting(
                          ['technicalConstraints', 'maintenance', 'dubai', 'allowedWindow'],
                          e.target.value
                        )}
                      />
                    </div>
                    <div>
                      <Label>Durée max (heures)</Label>
                      <Input
                        type="number"
                        value={settings.technicalConstraints.maintenance.dubai.maxDuration}
                        onChange={(e) => updateSetting(
                          ['technicalConstraints', 'maintenance', 'dubai', 'maxDuration'],
                          parseInt(e.target.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-[#43A047]">🇨🇩 Kinshasa</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Fenêtre autorisée</Label>
                      <Input
                        value={settings.technicalConstraints.maintenance.kinshasa.allowedWindow}
                        onChange={(e) => updateSetting(
                          ['technicalConstraints', 'maintenance', 'kinshasa', 'allowedWindow'],
                          e.target.value
                        )}
                      />
                    </div>
                    <div>
                      <Label>Durée max (heures)</Label>
                      <Input
                        type="number"
                        value={settings.technicalConstraints.maintenance.kinshasa.maxDuration}
                        onChange={(e) => updateSetting(
                          ['technicalConstraints', 'maintenance', 'kinshasa', 'maxDuration'],
                          parseInt(e.target.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#F97316]">🇦🇪 Dubaï - Conformité Légale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Lois applicables</Label>
                  <div className="space-y-2 mt-2">
                    {settings.legalConstraints.dubai.laws.map((law, index) => (
                      <Badge key={index} variant="outline" className="block w-fit">
                        {law}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Chiffrement requis</Label>
                  <Input
                    value={settings.legalConstraints.dubai.requirements.dataEncryption}
                    onChange={(e) => updateSetting(
                      ['legalConstraints', 'dubai', 'requirements', 'dataEncryption'],
                      e.target.value
                    )}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Délai notification fuite</Label>
                  <Input
                    value={settings.legalConstraints.dubai.requirements.breachNotification}
                    onChange={(e) => updateSetting(
                      ['legalConstraints', 'dubai', 'requirements', 'breachNotification'],
                      e.target.value
                    )}
                    className="mt-1"
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Organisme régulateur: {settings.legalConstraints.dubai.regulatoryBody}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#43A047]">🇨🇩 Kinshasa - Conformité Légale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Lois applicables</Label>
                  <div className="space-y-2 mt-2">
                    {settings.legalConstraints.kinshasa.laws.map((law, index) => (
                      <Badge key={index} variant="outline" className="block w-fit text-xs">
                        {law}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Localisation des données obligatoire</Label>
                  <Switch
                    checked={settings.legalConstraints.kinshasa.requirements.dataLocalization}
                    onCheckedChange={(checked) => updateSetting(
                      ['legalConstraints', 'kinshasa', 'requirements', 'dataLocalization'],
                      checked
                    )}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Consentement explicite requis</Label>
                  <Switch
                    checked={settings.legalConstraints.kinshasa.requirements.explicitConsent}
                    onCheckedChange={(checked) => updateSetting(
                      ['legalConstraints', 'kinshasa', 'requirements', 'explicitConsent'],
                      checked
                    )}
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Organisme régulateur: {settings.legalConstraints.kinshasa.regulatoryBody}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="penalties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-red-500" />
                <span>Sanctions Financières</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="downtimePenalty">Pénalité indisponibilité (% CA/heure)</Label>
                  <Input
                    id="downtimePenalty"
                    type="number"
                    step="0.01"
                    value={settings.sanctions.financial.downtimePerHour * 100}
                    onChange={(e) => updateSetting(
                      ['sanctions', 'financial', 'downtimePerHour'],
                      parseFloat(e.target.value) / 100
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Actuellement: {(settings.sanctions.financial.downtimePerHour * 100)}%
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="breachPenalty">Pénalité fuite de données (USD)</Label>
                  <Input
                    id="breachPenalty"
                    type="number"
                    value={settings.sanctions.financial.dataBreachPenalty}
                    onChange={(e) => updateSetting(
                      ['sanctions', 'financial', 'dataBreachPenalty'],
                      parseInt(e.target.value)
                    )}
                  />
                </div>
              </div>
              
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Les sanctions financières sont appliquées automatiquement selon les incidents détectés.
                  Résiliation immédiate en cas d'accès non autorisé ou de violation de localisation des données.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-[#43A047]" />
                <span>Obligations de Transparence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Fréquence des audits</Label>
                  <Input
                    value={settings.transparencyObligations.audits.frequency}
                    onChange={(e) => updateSetting(
                      ['transparencyObligations', 'audits', 'frequency'],
                      e.target.value
                    )}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Niveau de rapport requis</Label>
                  <Input
                    value={settings.transparencyObligations.audits.reportLevel}
                    onChange={(e) => updateSetting(
                      ['transparencyObligations', 'audits', 'reportLevel'],
                      e.target.value
                    )}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Rétention des Logs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Dubaï (années)</Label>
                    <Input
                      type="number"
                      value={settings.transparencyObligations.logging.retention.dubai}
                      onChange={(e) => updateSetting(
                        ['transparencyObligations', 'logging', 'retention', 'dubai'],
                        parseInt(e.target.value)
                      )}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Kinshasa (années)</Label>
                    <Input
                      type="number"
                      value={settings.transparencyObligations.logging.retention.kinshasa}
                      onChange={(e) => updateSetting(
                        ['transparencyObligations', 'logging', 'retention', 'kinshasa'],
                        parseInt(e.target.value)
                      )}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Monitoring temps réel</Label>
                <Switch
                  checked={settings.transparencyObligations.logging.realTimeMonitoring}
                  onCheckedChange={(checked) => updateSetting(
                    ['transparencyObligations', 'logging', 'realTimeMonitoring'],
                    checked
                  )}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Accès API aux logs</Label>
                <Switch
                  checked={settings.transparencyObligations.logging.apiAccess}
                  onCheckedChange={(checked) => updateSetting(
                    ['transparencyObligations', 'logging', 'apiAccess'],
                    checked
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperatorSecuritySettings;
