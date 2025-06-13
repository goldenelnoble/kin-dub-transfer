
import { AlertTriangle, User, X } from 'lucide-react';
import { useImpersonation } from '@/hooks/useImpersonation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ImpersonationBanner() {
  const { isImpersonating, originalUser, impersonatedUser, stopImpersonation } = useImpersonation();

  if (!isImpersonating || !originalUser || !impersonatedUser) {
    return null;
  }

  return (
    <Card className="mx-3 mb-4 border-orange-200 bg-orange-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div className="text-sm">
              <div className="font-semibold text-orange-900">Mode Impersonation</div>
              <div className="text-orange-700">
                Connecté en tant que: <span className="font-medium">{impersonatedUser.name}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={stopImpersonation}
            className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
