
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100/80">
      <Sidebar />
      <div className="flex-1 overflow-auto relative">
        {/* Effet de lueur décoratif */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#F97316]/3 to-transparent pointer-events-none"></div>
        
        <main className="p-8 min-h-full relative z-10">
          <div className="max-w-8xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#F2C94C]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
