
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurityContext';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const { validatePassword } = useSecurity();
  
  const validation = validatePassword(password);
  
  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = (strength: number) => {
    if (strength <= 1) return 'Très faible';
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    if (strength <= 4) return 'Fort';
    return 'Très fort';
  };
  
  const getStrengthIcon = (strength: number) => {
    if (strength <= 2) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (strength <= 3) return <Shield className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (!password) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStrengthIcon(validation.strength)}
          <span className="text-sm font-medium">
            Force: {getStrengthText(validation.strength)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {validation.strength}/5
        </span>
      </div>
      
      <Progress 
        value={(validation.strength / 5) * 100} 
        className="h-2"
      />
      
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Exigences manquantes:</p>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="text-xs text-red-600 flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
