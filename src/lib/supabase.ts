import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente global estático útil para operaciones públicas del lado del cliente o vistas estáticas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función factoría para instanciar clientes con cookies dentro de contextos del servidor (middleware/Actions)
export async function createClientServer() {
  const { cookies } = await import('next/headers');
  const { createServerClient } = await import('@supabase/ssr');

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Captura intencionada: El middleware maneja la mutación de cookies de sesión directamente
        }
      },
    },
  });
}