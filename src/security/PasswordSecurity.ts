
import { SecurityConfig } from './SecurityConfig';

// Validation et sécurisation des mots de passe selon OWASP
export class PasswordSecurity {
  private static readonly commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];

  // Validation de la force du mot de passe
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: number;
  } {
    const errors: string[] = [];
    const { passwordPolicy } = SecurityConfig;

    // Vérification de la longueur minimum
    if (password.length < passwordPolicy.minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${passwordPolicy.minLength} caractères`);
    }

    // Vérification des caractères requis
    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    // Vérification contre les mots de passe communs
    if (this.commonPasswords.includes(password.toLowerCase())) {
      errors.push('Ce mot de passe est trop commun');
    }

    // Calcul de la force (score zxcvbn simulé)
    const strength = this.calculateStrength(password);

    if (strength < passwordPolicy.zxcvbnMinScore) {
      errors.push('Le mot de passe n\'est pas assez complexe');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  // Calcul de la force du mot de passe (0-4)
  private static calculateStrength(password: string): number {
    let score = 0;

    // Longueur
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Variété de caractères
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    // Patterns complexes
    if (!/(.)\1{2,}/.test(password)) score++; // Pas de répétitions
    if (!/123|abc|qwe/i.test(password)) score++; // Pas de séquences

    return Math.min(score, 4);
  }

  // Génération de mot de passe sécurisé
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Hachage sécurisé du mot de passe
  static async hashPassword(password: string): Promise<string> {
    // Note: En production, utiliser bcrypt ou Argon2
    const encoder = new TextEncoder();
    const data = encoder.encode(password + process.env.SALT || 'default-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
