
import DOMPurify from 'dompurify';

// Sanitisation stricte des entrées utilisateur selon OWASP
export class InputSanitizer {
  // Protection contre les injections SQL
  static sanitizeForDatabase(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Suppression des caractères dangereux pour SQL
    return input
      .replace(/['"`;\\]/g, '')
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '')
      .trim()
      .slice(0, 1000); // Limitation de longueur
  }

  // Protection contre XSS
  static sanitizeForHTML(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  // Sanitisation générale avec règles multiples
  static sanitizeInput(input: string, rules: string = 'SQLi-XSS-RCE'): string {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input;

    if (rules.includes('SQLi')) {
      sanitized = this.sanitizeForDatabase(sanitized);
    }

    if (rules.includes('XSS')) {
      sanitized = this.sanitizeForHTML(sanitized);
    }

    if (rules.includes('RCE')) {
      // Protection contre l'exécution de code
      sanitized = sanitized.replace(/[<>&"']/g, (char) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return entities[char] || char;
      });
    }

    return sanitized;
  }

  // Validation des emails
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validation des numéros de téléphone
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Masquage des données sensibles
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (!data || data.length <= visibleChars) return data;
    
    const visible = data.slice(-visibleChars);
    const masked = '*'.repeat(data.length - visibleChars);
    return masked + visible;
  }
}
