import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Julian Moreno | Sistemas & Diseño Visual',
  description: 'Portafolio de Ingeniería de Sistemas combinada con Estética Gráfica Premium.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head />
      <body className="bg-black text-white antialiased">
        <Toaster position="bottom-right" />

        {/* Navbar principal - Debug: background debe ser visible */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/70 backdrop-blur-lg border-b border-white/10">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-12">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-lg tracking-tight">
              <span className="text-white">JM</span><span className="text-blue-400">.</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/#inicio" className="text-sm text-neutral-300 hover:text-white transition-colors">Inicio</a>
              <a href="/#destacados" className="text-sm text-neutral-300 hover:text-white transition-colors">Destacados</a>
              <a href="/#proyectos" className="text-sm text-neutral-300 hover:text-white transition-colors">Proyectos</a>
              <a href="/#contacto" className="text-sm text-neutral-300 hover:text-white transition-colors">Contacto</a>
              <a href="/admin/dashboard" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">Editor</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen pt-16 bg-black">
          {children}
        </main>
      </body>
    </html>
  );
}