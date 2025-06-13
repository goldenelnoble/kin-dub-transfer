import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  BarChart, 
  Settings, 
  Users, 
  History, 
  Shield, 
  FileText,
  CreditCard,
  TrendingUp,
  Menu,
  Calculator
} from "lucide-react";
import { useState } from "react";
import { ImpersonationBanner } from "@/components/auth/ImpersonationBanner";

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: <BarChart className="h-5 w-5" />,
      visible: true,
      color: "text-blue-600"
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <CreditCard className="h-5 w-5" />,
      visible: true,
      color: "text-green-600"
    },
    {
      name: "Reçus",
      path: "/receipts",
      icon: <FileText className="h-5 w-5" />,
      visible: true,
      color: "text-purple-600"
    },
    {
      name: "Rapports",
      path: "/reports",
      icon: <TrendingUp className="h-5 w-5" />,
      visible: true,
      color: "text-indigo-600"
    },
    {
      name: "Journal d'audit",
      path: "/audit-log",
      icon: <History className="h-5 w-5" />,
      visible: true,
      color: "text-orange-600"
    },
    {
      name: "Utilisateurs",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
      visible: true,
      color: "text-pink-600"
    },
    {
      name: "Paramètres",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      visible: true,
      color: "text-gray-600"
    },
    {
      name: "Administration",
      path: "/admin-settings",
      icon: <Shield className="h-5 w-5" />,
      visible: true,
      color: "text-red-600"
    },
    {
      name: "Comptabilité",
      path: "/accounting",
      icon: <Calculator className="h-5 w-5" />,
      visible: true,
      color: "text-emerald-600"
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-[#F97316] to-[#F2C94C] rounded-lg flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Golden El Nobles</h1>
              <p className="text-xs text-gray-500">Cargo Management</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hover:bg-gray-100 transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Impersonation Banner */}
      {!collapsed && <ImpersonationBanner />}

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-3 space-y-2">
          {navigationItems
            .filter(item => item.visible)
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-[#F97316]/10 to-[#F2C94C]/10 text-[#F97316] shadow-sm border border-[#F97316]/20" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-[#F97316]" : item.color
                  )}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="ml-3 transition-all duration-200">
                      {item.name}
                    </span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto h-2 w-2 bg-[#F97316] rounded-full"></div>
                  )}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className={cn(
          "flex items-center transition-all duration-200",
          collapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#F97316] to-[#F2C94C] flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                Administrateur
              </div>
              <div className="text-xs text-gray-500 truncate">
                Accès complet au système
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
