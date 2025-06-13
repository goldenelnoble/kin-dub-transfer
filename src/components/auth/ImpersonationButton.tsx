
import { User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImpersonation } from '@/hooks/useImpersonation';
import { User } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImpersonationButtonProps {
  user: User;
}

export function ImpersonationButton({ user }: ImpersonationButtonProps) {
  const { startImpersonation, isImpersonating } = useImpersonation();

  const handleImpersonation = async () => {
    await startImpersonation(user);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImpersonation}
            disabled={isImpersonating}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <UserIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Se connecter en tant que {user.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
