import { ReactNode } from 'react';
import { LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] font-sans">
      {/* Sidebar / Topbar minimalista del Editor */}
      <header className="border-b border-white/10 bg-[#1c1c1e] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white">Julian Moreno <span className="text-neutral-500 font-normal">| Editor Mode</span></h1>
        </div>
        <button className="text-xs flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </header>
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}