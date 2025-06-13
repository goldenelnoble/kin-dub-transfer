
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurityContext';
import { SecurityAuditLogger } from '../SecurityAuditLogger';
import { RateLimiter } from '../RateLimiter';

export function SecurityDashboard() {
  const { isSecurityEnabled, securityLevel, logSecurityEvent } = useSecurity();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [rateLimitStats, setRateLimitStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadSecurityStats = async () => {
    setIsLoading(true);
    try {
      const auditLogger = SecurityAuditLogger.getInstance();
      const rateLimiter = RateLimiter.getInstance();
      
      // Récupérer les logs d'audit récents
      const recentLogs = auditLogger.getAuditLogs({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24h
      });
      
      setAuditLogs(recentLogs.slice(0, 10)); // 10 derniers logs
      setRateLimitStats(rateLimiter.getStats());
      
      // Logger l'accès au dashboard de sécurité
      logSecurityEvent({
        type: 'admin_action',
        action: 'security_dashboard_accessed',
        result: 'SUCCESS',
        details: { timestamp: new Date().toISOString() }
      });
      
    } catch (error) {
      console.error('[SECURITY] Error loading security stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityStats();
  }, []);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'MEDIUM': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'LOW': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Status de sécurité global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État de sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSecurityEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">
                {isSecurityEnabled ? 'Activé' : 'Désactivé'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau de sécurité</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getSecurityLevelColor(securityLevel)}>
              {securityLevel}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs surveillées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rateLimitStats.totalTrackedIPs || 0}</div>
            <p className="text-xs text-muted-foreground">
              {rateLimitStats.blockedIPs || 0} bloquées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs d'audit récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Logs d'audit récents</CardTitle>
            <CardDescription>
              Événements de sécurité des dernières 24 heures
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={loadSecurityStats}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {auditLogs.length > 0 ? (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getRiskLevelIcon(log.riskLevel)}
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.userEmail || 'Utilisateur anonyme'} • {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={log.result === 'SUCCESS' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {log.result}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun événement de sécurité récent</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
