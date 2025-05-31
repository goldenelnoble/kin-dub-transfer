
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, BarChart, Settings, LogOut, Users, History, Shield, FileText } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navigationItems = [
    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: <BarChart className="h-5 w-5" />,
      visible: true
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <ArrowRight className="h-5 w-5" />,
      visible: true
    },
    {
      name: "Reçus",
      path: "/receipts",
      icon: <FileText className="h-5 w-5" />,
      visible: true
    },
    {
      name: "Rapports",
      path: "/reports",
      icon: <ArrowRight className="h-5 w-5" />,
      visible: hasPermission("canViewReports")
    },
    {
      name: "Journal d'audit",
      path: "/audit-log",
      icon: <History className="h-5 w-5" />,
      visible: hasPermission("canViewAuditLog")
    },
    {
      name: "Utilisateurs",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
      visible: hasPermission("canCreateUsers") || hasPermission("canEditUsers")
    },
    {
      name: "Paramètres",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      visible: hasPermission("canConfigureSystem")
    },
    {
      name: "Administration",
      path: "/admin-settings",
      icon: <Shield className="h-5 w-5" />,
      visible: hasPermission("canConfigureSystem")
    }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-6 w-6 text-[#F97316]" />
            <span className="font-bold text-xl text-sidebar-foreground">TransferApp</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigationItems
            .filter(item => item.visible)
            .map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center"
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center",
          collapsed ? "flex-col space-y-2" : "space-x-2"
        )}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-[#F97316] flex items-center justify-center text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </div>
              <div className="text-xs text-sidebar-foreground/70 truncate">
                {user.role === UserRole.ADMIN && "Administrateur"}
                {user.role === UserRole.SUPERVISOR && "Superviseur"} 
                {user.role === UserRole.OPERATOR && "Opérateur"}
                {user.role === UserRole.AUDITOR && "Auditeur"}
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Déconnexion"
            className={cn(collapsed && "mt-2")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
