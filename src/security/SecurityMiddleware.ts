
import { InputSanitizer } from './InputSanitizer';
import { RateLimiter } from './RateLimiter';
import { SecurityAuditLogger } from './SecurityAuditLogger';
import { SecurityConfig } from './SecurityConfig';

// Middleware de sécurité pour l'application
export class SecurityMiddleware {
  private static rateLimiter = RateLimiter.getInstance();
  private static auditLogger = SecurityAuditLogger.getInstance();

  // Middleware principal de sécurité
  static async applySecurityMiddleware(request: SecurityRequest): Promise<SecurityResponse> {
    const startTime = Date.now();

    try {
      // 1. Rate Limiting
      const rateLimitCheck = this.rateLimiter.checkRateLimit(
        request.clientIP, 
        request.endpoint
      );

      if (!rateLimitCheck.allowed) {
        this.auditLogger.logCriticalAction({
          type: 'login_attempt',
          action: 'rate_limit_exceeded',
          result: 'FAILURE',
          ipAddress: request.clientIP,
          userAgent: request.userAgent,
          details: { endpoint: request.endpoint, reason: rateLimitCheck.reason }
        });

        return {
          allowed: false,
          statusCode: 429,
          message: 'Trop de requêtes. Veuillez réessayer plus tard.',
          headers: {
            'Retry-After': rateLimitCheck.retryAfter?.toString() || '60'
          }
        };
      }

      // 2. Sanitisation des entrées
      const sanitizedData = this.sanitizeRequestData(request.data);

      // 3. Validation CSRF pour les requêtes POST/PUT/DELETE
      if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        const csrfValid = this.validateCSRFToken(request.csrfToken, request.sessionId);
        if (!csrfValid) {
          this.auditLogger.logCriticalAction({
            type: 'admin_action',
            action: 'csrf_validation_failed',
            result: 'FAILURE',
            ipAddress: request.clientIP,
            userAgent: request.userAgent,
            sessionId: request.sessionId
          });

          return {
            allowed: false,
            statusCode: 403,
            message: 'Token CSRF invalide'
          };
        }
      }

      // 4. Application des en-têtes de sécurité
      const securityHeaders = this.getSecurityHeaders();

      return {
        allowed: true,
        statusCode: 200,
        sanitizedData,
        headers: securityHeaders,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('[SECURITY] Error in security middleware:', error);
      
      return {
        allowed: false,
        statusCode: 500,
        message: 'Erreur de sécurité interne'
      };
    }
  }

  // Sanitisation des données de requête
  private static sanitizeRequestData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = InputSanitizer.sanitizeInput(value, 'SQLi-XSS-RCE');
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Validation du token CSRF
  private static validateCSRFToken(token?: string, sessionId?: string): boolean {
    if (!token || !sessionId) return false;
    
    // En production: validation contre le token stocké en session
    // Pour cette démo, on simule une validation basique
    const expectedToken = `csrf_${sessionId}_${Date.now()}`;
    return token.startsWith('csrf_');
  }

  // Génération des en-têtes de sécurité
  private static getSecurityHeaders(): Record<string, string> {
    const { csp, hsts } = SecurityConfig;

    return {
      // Content Security Policy
      'Content-Security-Policy': Object.entries(csp)
        .map(([directive, value]) => `${directive.replace(/([A-Z])/g, '-$1').toLowerCase()} ${value}`)
        .join('; '),

      // HTTP Strict Transport Security
      'Strict-Transport-Security': `max-age=${hsts.maxAge}${hsts.includeSubDomains ? '; includeSubDomains' : ''}${hsts.preload ? '; preload' : ''}`,

      // Autres en-têtes de sécurité
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    };
  }

  // Nettoyage périodique
  static startCleanupJob(): void {
    setInterval(() => {
      this.rateLimiter.cleanup();
    }, 60000); // Nettoyage toutes les minutes
  }
}

// Types pour le middleware
export interface SecurityRequest {
  clientIP: string;
  userAgent?: string;
  endpoint: string;
  method: string;
  data?: any;
  csrfToken?: string;
  sessionId?: string;
}

export interface SecurityResponse {
  allowed: boolean;
  statusCode: number;
  message?: string;
  sanitizedData?: any;
  headers?: Record<string, string>;
  processingTime?: number;
}
