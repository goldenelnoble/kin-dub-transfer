
import { SecurityConfig } from './SecurityConfig';

// Système de logging sécurisé pour audit et conformité
export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  private logs: AuditLog[] = [];

  static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  // Log d'une action critique
  logCriticalAction(action: CriticalAction): void {
    if (!SecurityConfig.auditLog.criticalActions.includes(action.type)) {
      return;
    }

    const auditEntry: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: action.type,
      userId: action.userId,
      userEmail: action.userEmail,
      ipAddress: action.ipAddress,
      userAgent: action.userAgent,
      resource: action.resource,
      action: action.action,
      result: action.result,
      details: this.sanitizeDetails(action.details),
      riskLevel: this.calculateRiskLevel(action),
      sessionId: action.sessionId
    };

    this.logs.push(auditEntry);
    this.persistLog(auditEntry);

    // Alerte en cas d'action à haut risque
    if (auditEntry.riskLevel === 'HIGH') {
      this.triggerSecurityAlert(auditEntry);
    }
  }

  // Calcul du niveau de risque
  private calculateRiskLevel(action: CriticalAction): 'LOW' | 'MEDIUM' | 'HIGH' {
    const highRiskActions = ['user_delete', 'role_change', 'admin_action'];
    const mediumRiskActions = ['transaction_delete', 'password_change'];

    if (highRiskActions.includes(action.type)) return 'HIGH';
    if (mediumRiskActions.includes(action.type)) return 'MEDIUM';
    if (action.result === 'FAILURE') return 'MEDIUM';
    
    return 'LOW';
  }

  // Sanitisation des détails sensibles
  private sanitizeDetails(details: any): any {
    if (!details) return {};

    const sanitized = { ...details };
    
    // Masquage des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***MASKED***';
      }
    }

    return sanitized;
  }

  // Persistance du log (en production: vers SIEM)
  private persistLog(log: AuditLog): void {
    console.log(`[SECURITY AUDIT] ${log.timestamp} - ${log.type}:`, {
      user: log.userEmail,
      ip: log.ipAddress,
      result: log.result,
      risk: log.riskLevel
    });

    // En production: envoyer vers ELK Stack ou SIEM
    // this.sendToSIEM(log);
  }

  // Alerte de sécurité
  private triggerSecurityAlert(log: AuditLog): void {
    console.warn(`[SECURITY ALERT] High-risk action detected:`, log);
    
    // En production: notification SOC, email admin, etc.
    // this.notifySecurityTeam(log);
  }

  // Récupération des logs pour audit
  getAuditLogs(filters?: AuditLogFilters): AuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate!)
      );
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.riskLevel) {
      filteredLogs = filteredLogs.filter(log => log.riskLevel === filters.riskLevel);
    }

    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

// Types pour le système d'audit
export interface CriticalAction {
  type: 'login_attempt' | 'password_change' | 'role_change' | 'transaction_create' | 
        'transaction_update' | 'transaction_delete' | 'user_create' | 'user_delete' | 'admin_action';
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: any;
  sessionId?: string;
}

export interface AuditLog extends CriticalAction {
  id: string;
  timestamp: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}
