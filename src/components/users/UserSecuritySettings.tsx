
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Bell, RefreshCw } from 'lucide-react';
import { useSecurity } from '@/security/hooks/useSecurityContext';
import { PasswordStrengthIndicator } from '@/security/components/PasswordStrengthIndicator';
import { toast } from '@/components/ui/sonner';

export function UserSecuritySettings() {
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
    enableSecurityNotifications: true,
    autoLockout: true,
    maxLoginAttempts: 5
  });
  
  const [newPassword, setNewPassword] = useState('');

  const handleGeneratePassword = () => {
    const password = generateSecurePassword(20);
    setNewPassword(password);
    toast.success('Mot de passe sécurisé généré');
    
    logSecurityEvent({
      type: 'admin_action',
      action: 'secure_password_generated',
      result: 'SUCCESS',
      details: { length: 20, timestamp: new Date().toISOString() }
    });
  };

  const handleSaveSettings = () => {
    console.log('[SECURITY] Saving user security settings:', settings);
    
    logSecurityEvent({
      type: 'admin_action',
      action: 'user_security_settings_updated',
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
      {/* État de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#F97316]" />
            <span>Sécurité des Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            Configuration de la sécurité pour tous les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Système de sécurité</Label>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSecurityEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">{isSecurityEnabled ? 'Activé' : 'Désactivé'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Niveau de sécurité</Label>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              securityLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
              securityLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {securityLevel === 'HIGH' ? 'Élevé' : securityLevel === 'MEDIUM' ? 'Moyen' : 'Bas'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Authentification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-[#F97316]" />
            <span>Paramètres d'Authentification</span>
          </CardTitle>
          <CardDescription>
            Contrôles de sécurité pour l'authentification des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Exiger une vérification supplémentaire pour tous les utilisateurs
              </p>
            </div>
            <Switch
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => updateSetting('enableTwoFactor', checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Générateur de mot de passe sécurisé</Label>
              <Button 
                variant="outline" 
                onClick={handleGeneratePassword}
                className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Générer
              </Button>
            </div>
            
            {newPassword && (
              <div className="space-y-2">
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mot de passe généré"
                  type="text"
                  className="font-mono"
                />
                <PasswordStrengthIndicator password={newPassword} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-[#F97316]" />
            <span>Notifications de Sécurité</span>
          </CardTitle>
          <CardDescription>
            Alertes et notifications pour les événements de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications de sécurité</Label>
              <p className="text-sm text-muted-foreground">
                Alertes automatiques pour les tentatives de connexion suspectes
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
                Bloquer automatiquement les comptes après plusieurs tentatives échouées
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
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-[#F97316] to-[#F2C94C] hover:from-[#F97316]/90 hover:to-[#F2C94C]/90"
        >
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
}
