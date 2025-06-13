
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Bell, Database } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurityContext';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { toast } from '@/components/ui/sonner';

export function SecuritySettings() {
  const { 
    isSecurityEnabled, 
    securityLevel, 
    generateSecurePassword,
    logSecurityEvent 
  } = useSecurity();
  
  const [settings, setSettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 15,
    passwordExpiration: 90,
    allowConcurrentSessions: true,
    enableSecurityNotifications: true,
    autoLockout: true,
    maxLoginAttempts: 5
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGeneratePassword = () => {
    const password = generateSecurePassword(20);
    setNewPassword(password);
    setConfirmPassword('');
    toast.success('Mot de passe sécurisé généré');
    
    logSecurityEvent({
      type: 'admin_action',
      action: 'secure_password_generated',
      result: 'SUCCESS',
      details: { length: 20, timestamp: new Date().toISOString() }
    });
  };

  const handleSaveSettings = () => {
    // Validation
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Simuler la sauvegarde des paramètres
    console.log('[SECURITY] Saving security settings:', settings);
    
    logSecurityEvent({
      type: 'admin_action',
      action: 'security_settings_updated',
      result: 'SUCCESS',
      details: { 
        changedSettings: Object.keys(settings),
        timestamp: new Date().toISOString()
      }
    });
    
    toast.success('Paramètres de sécurité sauvegardés');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* État général */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>État de la sécurité</span>
          </CardTitle>
          <CardDescription>
            Configuration globale du système de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Système de sécurité</Label>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSecurityEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isSecurityEnabled ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Niveau de sécurité</Label>
            <RadioGroup 
              value={securityLevel} 
              className="flex space-x-4"
              disabled
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LOW" id="low" />
                <Label htmlFor="low">Bas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MEDIUM" id="medium" />
                <Label htmlFor="medium">Moyen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HIGH" id="high" />
                <Label htmlFor="high">Élevé</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Authentification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Authentification</span>
          </CardTitle>
          <CardDescription>
            Paramètres d'authentification et de mots de passe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Ajouter une couche de sécurité supplémentaire
              </p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => updateSetting('enableTwoFactor', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="1440"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
              min="3"
              max="10"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Générateur de mot de passe sécurisé</Label>
              <Button variant="outline" onClick={handleGeneratePassword}>
                Générer
              </Button>
            </div>
            
            {newPassword && (
              <div className="space-y-2">
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  type="text"
                />
                <PasswordStrengthIndicator password={newPassword} />
              </div>
            )}
            
            {newPassword && (
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                type="password"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications de sécurité</span>
          </CardTitle>
          <CardDescription>
            Alertes et notifications pour les événements de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications activées</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des alertes pour les événements suspects
              </p>
            </div>
            <Switch
              checked={settings.enableSecurityNotifications}
              onCheckedChange={(checked) => updateSetting('enableSecurityNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Verrouillage automatique</Label>
              <p className="text-sm text-muted-foreground">
                Bloquer automatiquement les comptes suspects
              </p>
            </div>
            <Switch
              checked={settings.autoLockout}
              onCheckedChange={(checked) => updateSetting('autoLockout', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">
          Annuler
        </Button>
        <Button onClick={handleSaveSettings}>
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
}
