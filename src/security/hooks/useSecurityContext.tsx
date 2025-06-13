
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SecurityAuditLogger, CriticalAction } from '../SecurityAuditLogger';
import { RateLimiter } from '../RateLimiter';
import { PasswordSecurity } from '../PasswordSecurity';
import { InputSanitizer } from '../InputSanitizer';

// Context de sécurité pour l'application React
interface SecurityContextType {
  // Fonctions de sécurité
  sanitizeInput: (input: string, rules?: string) => string;
  validatePassword: (password: string) => { isValid: boolean; errors: string[]; strength: number };
  logSecurityEvent: (action: CriticalAction) => void;
  maskSensitiveData: (data: string, visibleChars?: number) => string;
  
  // État de sécurité
  isSecurityEnabled: boolean;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Fonctions utilitaires
  generateSecurePassword: (length?: number) => string;
  validateEmail: (email: string) => boolean;
  validatePhone: (phone: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  
  const auditLogger = SecurityAuditLogger.getInstance();

  useEffect(() => {
    // Initialisation du système de sécurité
    console.log('[SECURITY] Security context initialized with level:', securityLevel);
    
    // Log de l'initialisation
    auditLogger.logCriticalAction({
      type: 'admin_action',
      action: 'security_system_initialized',
      result: 'SUCCESS',
      details: { securityLevel, timestamp: new Date().toISOString() }
    });
  }, []);

  const contextValue: SecurityContextType = {
    // Fonctions de sécurité
    sanitizeInput: (input: string, rules = 'SQLi-XSS-RCE') => 
      InputSanitizer.sanitizeInput(input, rules),
    
    validatePassword: (password: string) => 
      PasswordSecurity.validatePassword(password),
    
    logSecurityEvent: (action: CriticalAction) => 
      auditLogger.logCriticalAction(action),
    
    maskSensitiveData: (data: string, visibleChars = 4) => 
      InputSanitizer.maskSensitiveData(data, visibleChars),
    
    // État de sécurité
    isSecurityEnabled,
    securityLevel,
    
    // Fonctions utilitaires
    generateSecurePassword: (length = 16) => 
      PasswordSecurity.generateSecurePassword(length),
    
    validateEmail: (email: string) => 
      InputSanitizer.validateEmail(email),
    
    validatePhone: (phone: string) => 
      InputSanitizer.validatePhone(phone)
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
