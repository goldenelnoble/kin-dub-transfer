
import { SecurityConfig } from './SecurityConfig';

// Rate Limiting pour protection contre DDoS et abus d'API
export class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, RequestHistory[]> = new Map();
  private blockedIPs: Set<string> = new Set();

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  // Vérification des limites de taux
  checkRateLimit(identifier: string, endpoint?: string): RateLimitResult {
    const now = Date.now();
    const { rateLimiting } = SecurityConfig;

    // Vérification si l'IP est bloquée
    if (this.blockedIPs.has(identifier)) {
      return {
        allowed: false,
        reason: 'IP_BLOCKED',
        retryAfter: rateLimiting.blockDurationMinutes * 60
      };
    }

    // Vérification de la whitelist
    if (rateLimiting.whitelistedIPs.includes(identifier)) {
      return { allowed: true };
    }

    // Récupération de l'historique des requêtes
    let history = this.requests.get(identifier) || [];
    
    // Nettoyage des anciennes requêtes (> 1 minute)
    history = history.filter(req => now - req.timestamp < 60000);

    // Vérification du rate limiting par seconde
    const recentRequests = history.filter(req => now - req.timestamp < 1000);
    if (recentRequests.length >= rateLimiting.maxRequestsPerSecond) {
      this.blockIP(identifier);
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 1
      };
    }

    // Vérification du rate limiting par minute
    if (history.length >= rateLimiting.maxRequestsPerMinute) {
      this.blockIP(identifier);
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 60
      };
    }

    // Enregistrement de la nouvelle requête
    history.push({
      timestamp: now,
      endpoint: endpoint || 'unknown'
    });

    this.requests.set(identifier, history);

    return { allowed: true };
  }

  // Blocage d'une IP
  private blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    
    // Déblocage automatique après la durée configurée
    setTimeout(() => {
      this.blockedIPs.delete(ip);
    }, SecurityConfig.rateLimiting.blockDurationMinutes * 60 * 1000);

    console.warn(`[SECURITY] IP ${ip} blocked for rate limit violation`);
  }

  // Nettoyage périodique
  cleanup(): void {
    const now = Date.now();
    const cutoff = now - 60000; // 1 minute

    for (const [ip, history] of this.requests.entries()) {
      const validRequests = history.filter(req => req.timestamp > cutoff);
      
      if (validRequests.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, validRequests);
      }
    }
  }

  // Statistiques de rate limiting
  getStats(): RateLimitStats {
    return {
      totalTrackedIPs: this.requests.size,
      blockedIPs: this.blockedIPs.size,
      totalRequests: Array.from(this.requests.values())
        .reduce((sum, history) => sum + history.length, 0)
    };
  }
}

// Types pour le rate limiting
interface RequestHistory {
  timestamp: number;
  endpoint: string;
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: 'RATE_LIMIT_EXCEEDED' | 'IP_BLOCKED';
  retryAfter?: number;
}

interface RateLimitStats {
  totalTrackedIPs: number;
  blockedIPs: number;
  totalRequests: number;
}
