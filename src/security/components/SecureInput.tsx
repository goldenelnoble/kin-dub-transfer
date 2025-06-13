
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurityContext';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitizationRules?: string;
  showSecurityIndicator?: boolean;
  onSecureChange?: (sanitizedValue: string) => void;
}

export function SecureInput({ 
  sanitizationRules = 'SQLi-XSS-RCE',
  showSecurityIndicator = true,
  onSecureChange,
  type,
  onChange,
  value,
  ...props 
}: SecureInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSanitized, setIsSanitized] = useState(false);
  const { sanitizeInput } = useSecurity();
  
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    const sanitizedValue = sanitizeInput(originalValue, sanitizationRules);
    
    // Vérifier si la valeur a été modifiée par la sanitisation
    const wasSanitized = originalValue !== sanitizedValue;
    setIsSanitized(wasSanitized);
    
    // Créer un nouvel événement avec la valeur sanitisée
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };
    
    // Appeler les callbacks
    onChange?.(sanitizedEvent);
    onSecureChange?.(sanitizedValue);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type={inputType}
        value={value}
        onChange={handleChange}
        className={`${props.className || ''} ${
          isSanitized ? 'border-yellow-500 focus:border-yellow-500' : ''
        }`}
      />
      
      {isPasswordType && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 p-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      )}
      
      {showSecurityIndicator && isSanitized && (
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
          <Shield 
            className="h-4 w-4 text-yellow-500" 
            aria-label="Entrée sanitisée pour la sécurité"
          />
        </div>
      )}
      
      {isSanitized && (
        <p className="text-xs text-yellow-600 mt-1">
          ⚠️ L'entrée a été automatiquement nettoyée pour votre sécurité
        </p>
      )}
    </div>
  );
}
