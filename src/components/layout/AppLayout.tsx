
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-golden-50/30">
      <Sidebar />
      <div className="flex-1 overflow-auto relative">
        {/* Effets décoratifs modernisés */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-golden-400/3 via-emerald-400/2 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tl from-golden-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <main className="relative z-10 min-h-full">
          {children}
        </main>
        
        {/* Motifs décoratifs supplémentaires */}
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-tl from-noble-400/5 to-transparent rounded-full blur-2xl pointer-events-none animate-float"></div>
      </div>
    </div>
  );
}
