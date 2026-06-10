import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import { createClientServer } from '@/lib/supabase';

export default async function Home() {
  const supabase = await createClientServer();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col w-full bg-[#000000] text-white">
      <Hero />

      <section id="destacados" className="bg-[#050507] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-blue-400">Lo que ofrezco</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Ingenio aplicado a soluciones reales.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-neutral-400 leading-relaxed">
              Combino análisis de datos, arquitectura de software y diseño intuitivo para entregar software que sea potente, confiable y fácil de usar.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-blue-400/30 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.28em] text-blue-400">Arquitectura</p>
              <h3 className="mt-6 text-2xl font-semibold text-white">Sistemas escalables</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                Diseño de plataformas que resisten crecimiento y cambian sin perder estabilidad ni velocidad.
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-blue-400/30 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.28em] text-blue-400">Automatización</p>
              <h3 className="mt-6 text-2xl font-semibold text-white">Procesos inteligentes</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                Implementación de flujos automáticos para reducir trabajo manual y acelerar la entrega de valor.
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-blue-400/30 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.28em] text-blue-400">Experiencia</p>
              <h3 className="mt-6 text-2xl font-semibold text-white">Interacción clara</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300">
                Interfaces y procesos construidos para que cualquier usuario se sienta confiado desde el primer uso.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="proyectos" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-400">Proyectos</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Trabajos recientes</h2>
            </div>
            <p className="max-w-md text-sm text-neutral-400">
              Muestra tu mejor trabajo con claridad: sistemas, análisis de datos, interfaces y soluciones escalables.
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm text-red-400">Error cargando proyectos.</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm text-neutral-400">No hay proyectos publicados todavía. Publica proyectos desde el dashboard.</p>
            </div>
          )}
        </div>
      </section>

      <section id="contacto" className="bg-[#050507] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-glass backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-400">Contacto</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Hablemos de tu próximo proyecto</h2>
            </div>
            <p className="max-w-3xl text-base text-neutral-300 leading-relaxed">
              Si quieres una solución con arquitectura sólida, interfaz profesional y tecnología confiable, escríbeme para construirlo juntos.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Email</p>
                <p className="mt-4 text-base text-white">hola@tudominio.com</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Disponible</p>
                <p className="mt-4 text-base text-white">Freelance / proyectos</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Enlace</p>
                <p className="mt-4 text-base text-white">linkedin.com/in/julian-moreno</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}