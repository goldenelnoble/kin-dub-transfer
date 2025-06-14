
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  BarChart3, 
  ArrowLeftRight, 
  Receipt, 
  FileText, 
  Users, 
  Settings,
  Shield,
  ClipboardCheck,
  History,
  Package,
  Search,
  UserCheck,
  Archive,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Tableau de bord", href: "/dashboard", icon: BarChart3 },
  {
    name: "Logistique",
    icon: Package,
    children: [
      { name: "Colis", href: "/parcels", icon: Package },
      { name: "Suivi", href: "/track", icon: Search },
      { name: "Clients", href: "/clients", icon: UserCheck },
      { name: "Marchandises", href: "/marchandises", icon: Archive },
    ]
  },
  {
    name: "Transactions",
    icon: ArrowLeftRight,
    children: [
      { name: "Toutes les transactions", href: "/transactions", icon: ArrowLeftRight },
      { name: "Reçus", href: "/receipts", icon: Receipt },
    ]
  },
  { name: "Rapports", href: "/reports", icon: FileText },
  { name: "Comptabilité", href: "/accounting", icon: BarChart3 },
  { name: "Utilisateurs", href: "/users", icon: Users },
  {
    name: "Administration",
    icon: Settings,
    children: [
      { name: "Paramètres", href: "/admin/settings", icon: Settings },
      { name: "Sécurité", href: "/security", icon: Shield },
      { name: "Conformité", href: "/compliance", icon: ClipboardCheck },
      { name: "Journal d'audit", href: "/audit", icon: History },
    ]
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isSectionActive = (children: any[]) => {
    return children.some(child => isActive(child.href));
  };

  return (
    <div className="flex flex-col w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 h-full shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#F2C94C] rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-[#F97316] to-[#F2C94C] bg-clip-text text-transparent">
              LogiFlow
            </span>
            <span className="text-xs text-gray-500">Gestion Logistique</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.includes(item.name);
              const hasActiveChild = isSectionActive(item.children);
              
              return (
                <div key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      hasActiveChild && "bg-orange-50 text-[#F97316]"
                    )}
                    onClick={() => toggleSection(item.name)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-normal text-sm",
                            isActive(child.href) && "bg-orange-50 text-[#F97316] border-r-2 border-[#F97316]"
                          )}
                          onClick={() => navigate(child.href)}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal",
                  isActive(item.href) && "bg-orange-50 text-[#F97316] border-r-2 border-[#F97316]"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F97316] to-[#F2C94C] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
}
