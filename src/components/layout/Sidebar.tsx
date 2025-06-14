
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
  ChevronDown,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Tableau de Bord", href: "/dashboard", icon: BarChart3 },
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
    <div className="flex flex-col w-72 bg-gradient-to-b from-noble-900 via-noble-800 to-noble-900 text-white h-full shadow-2xl relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-golden-500/5 via-transparent to-emerald-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-golden-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
      
      {/* Header avec logo officiel */}
      <div className="relative z-10 flex items-center justify-center px-6 py-8 border-b border-white/10">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-golden-500/20">
              <img 
                src="/lovable-uploads/3699c74f-5ee4-4571-93ea-3850eeb8546e.png" 
                alt="Golden El Nobles Cargo Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse border-2 border-noble-800"></div>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-lg font-playfair font-bold bg-gradient-to-r from-golden-400 to-golden-300 bg-clip-text text-transparent">
              Golden El Nobles
            </span>
            <span className="text-xs text-white/70 font-inter tracking-wide">
              Cargo Services L.L.C
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 py-6 relative z-10">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.includes(item.name);
              const hasActiveChild = isSectionActive(item.children);
              
              return (
                <div key={item.name} className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-inter font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl h-12",
                      hasActiveChild && "bg-gradient-to-r from-golden-500/20 to-emerald-500/20 text-white border border-golden-500/30"
                    )}
                    onClick={() => toggleSection(item.name)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-1 border-l border-white/20 pl-4">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-inter text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg h-10",
                            isActive(child.href) && "bg-gradient-to-r from-golden-500/30 to-emerald-500/30 text-white border-l-2 border-golden-500"
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
                  "w-full justify-start font-inter font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl h-12",
                  isActive(item.href) && "bg-gradient-to-r from-golden-500/20 to-emerald-500/20 text-white border border-golden-500/30"
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
      
      <Separator className="bg-white/20" />
      
      {/* User Profile */}
      <div className="p-6 relative z-10">
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-sm hover:from-white/15 hover:to-white/10 transition-all duration-300">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-golden-500 to-golden-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold font-inter">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-noble-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white font-inter truncate">Admin</p>
            <p className="text-xs text-white/60 truncate font-inter">Administrateur Système</p>
          </div>
          <Sparkles className="h-4 w-4 text-golden-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
