'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session) {
      toast.error('Credenciales incorrectas');
      setIsLoading(false);
      return;
    }

    toast.success('Acceso autorizado');
    window.location.assign('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#000000]">
      
      {/* Luz de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl z-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Lock className="text-white" size={24} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">Editor Mode</h2>
        <p className="text-center text-neutral-400 text-sm mb-8">Ingresa tus credenciales maestras.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="admin@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}