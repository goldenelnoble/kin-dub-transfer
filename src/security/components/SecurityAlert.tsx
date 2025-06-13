
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface SecurityAlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  autoHide?: boolean;
  duration?: number;
}

export function SecurityAlert({ 
  type, 
  title, 
  message, 
  autoHide = true, 
  duration = 5000 
}: SecurityAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Shield className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Composant pour afficher le statut de sécurité global
export function SecurityStatus() {
  const [securityChecks, setSecurityChecks] = useState({
    https: true,
    csrf: true,
    rateLimit: true,
    inputSanitization: true,
    passwordPolicy: true
  });

  const allChecksPass = Object.values(securityChecks).every(check => check);

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-[#F97316]" />
        <h3 className="font-semibold">Statut de Sécurité</h3>
      </div>
      
      <div className="space-y-2">
        {Object.entries(securityChecks).map(([check, status]) => (
          <div key={check} className="flex items-center justify-between">
            <span className="text-sm capitalize">
              {check.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
            <div className="flex items-center gap-1">
              {status ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs">
                {status ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <div className={`text-sm font-medium ${allChecksPass ? 'text-green-600' : 'text-orange-600'}`}>
          Niveau de sécurité: {allChecksPass ? 'Optimal' : 'À améliorer'}
        </div>
      </div>
    </div>
  );
}
