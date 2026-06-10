'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { createProject } from '@/actions/projects';
import toast from 'react-hot-toast';

export default function ProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const tagsArray = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) || [];

    try {
      await createProject({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        long_description: formData.get('long_description') as string,
        tags: tagsArray,
        github_url: formData.get('github_url') as string,
        live_url: formData.get('live_url') as string,
      });
      
      toast.success('Proyecto publicado exitosamente');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error al guardar el proyecto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors"
      >
        <Plus size={16} />
        Nuevo Proyecto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-[#1c1c1e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Añadir Proyecto</h2>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Título del Proyecto</label>
                <input required name="title" type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej: agroClima - Minería de Datos" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Descripción Corta</label>
                <input required name="description" type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Resumen impactante del proyecto..." />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Tags (separados por coma)</label>
                <input required name="tags" type="text" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Next.js, Python, Orange, Supabase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">URL de GitHub</label>
                  <input name="github_url" type="url" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">URL Demo / Live</label>
                  <input name="live_url" type="url" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Descripción Detallada (Opcional)</label>
                <textarea name="long_description" rows={4} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Explica el storytelling técnico y gráfico aquí..."></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Guardando...' : 'Publicar Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}