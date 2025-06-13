
// Configuration centrale de sécurité basée sur OWASP Top 10 2024
export const SecurityConfig = {
  // 1. Configuration WAF & Rate Limiting
  rateLimiting: {
    maxRequestsPerSecond: 100,
    maxRequestsPerMinute: 1000,
    blockDurationMinutes: 60,
    whitelistedIPs: process.env.NODE_ENV === 'development' ? ['127.0.0.1', 'localhost'] : []
  },

  // 2. Configuration des sessions et JWT
  session: {
    cookieSettings: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
      maxAge: 15 * 60 * 1000 // 15 minutes
    },
    jwtExpiration: '15m',
    refreshTokenExpiration: '7d'
  },

  // 3. Politique des mots de passe
  passwordPolicy: {
    minLength: 16,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDurationMinutes: 60,
    zxcvbnMinScore: 4
  },

  // 4. Configuration CSP (Content Security Policy)
  csp: {
    defaultSrc: "'self'",
    scriptSrc: "'self' 'unsafe-inline'",
    styleSrc: "'self' 'unsafe-inline'",
    imgSrc: "'self' data: https:",
    connectSrc: "'self' https://ffbhsuiwzugxsualzdyz.supabase.co",
    fontSrc: "'self'",
    objectSrc: "'none'",
    mediaSrc: "'self'",
    frameSrc: "'none'"
  },

  // 5. Configuration HSTS
  hsts: {
    maxAge: 31536000, // 1 an
    includeSubDomains: true,
    preload: true
  },

  // 6. Configuration de chiffrement
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90,
    sensitiveDataMask: '****'
  },

  // 7. Configuration de logging sécurisé
  auditLog: {
    criticalActions: [
      'login_attempt',
      'password_change',
      'role_change',
      'transaction_create',
      'transaction_update',
      'transaction_delete',
      'user_create',
      'user_delete',
      'admin_action'
    ],
    logLevel: 'info',
    includeSensitiveData: false
  }
};
