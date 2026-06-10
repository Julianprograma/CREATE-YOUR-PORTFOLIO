'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, X, Trash2, ExternalLink, GitBranch, Upload, Loader } from 'lucide-react';
import { createProject, deleteProject, updateProject, uploadProjectImage } from '@/actions/projects';
import { createBrowserClient } from '@supabase/ssr';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  tags: string[];
  image_url?: string;
  github_url?: string;
  live_url?: string;
  created_at?: string;
}

interface ProjectInput {
  title: string;
  description: string;
  long_description?: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'live'>('editor');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [formState, setFormState] = useState<ProjectInput>({
    title: '',
    description: '',
    long_description: '',
    tags: [],
    github_url: '',
    live_url: '',
    image_url: '',
  });

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error al cargar proyectos');
      console.error(error);
      setProjects([]);
    } else {
      setProjects(data || []);
      setLastUpdated(new Date());
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchProjects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormState({
      title: '',
      description: '',
      long_description: '',
      tags: [],
      github_url: '',
      live_url: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormState({
      title: project.title,
      description: project.description,
      long_description: project.long_description || '',
      tags: project.tags || [],
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede exceder 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadProjectImage(formData);
      setFormState({ ...formState, image_url: result.url });
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Error al subir imagen');
    } finally {
      setIsUploadingImage(false);
      // Limpiar el input
      e.target.value = '';
    }
  };

  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProject) {
        await updateProject(editingProject.id, {
          ...formState,
          tags: formState.tags,
        });
        toast.success('Proyecto actualizado');
      } else {
        await createProject({
          ...formState,
          tags: formState.tags,
        });
        toast.success('Proyecto guardado exitosamente');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      toast.error('Error al guardar el proyecto');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await deleteProject(id);
      toast.success('Proyecto eliminado');
      fetchProjects();
    } catch (error) {
      toast.error('Error al eliminar');
      console.error(error);
    }
  };

  return (
    <div className="pt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Editor de Proyectos</h1>
          <p className="text-sm text-neutral-400">Administra, edita y publica todos los proyectos con vista profesional en tiempo real.</p>
          {lastUpdated && (
            <p className="text-xs text-neutral-500 mt-2">Última actualización: {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('editor')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === 'editor'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === 'live'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Vista en vivo
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <>
          {isLoading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm text-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Pencil size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Ningún proyecto todavía</h3>
              <p className="text-sm text-neutral-400">Comienza agregando tu primer proyecto de ingeniería o diseño.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group relative bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 hover:bg-white/5 transition-colors flex flex-col h-full">
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mt-1">Proyecto #{project.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
                        title="Editar proyecto"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-full bg-white/5 text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar proyecto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-400 mb-6 line-clamp-3 flex-grow">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                        <GitBranch size={18} />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Portafolio en vivo</h2>
            <p className="text-sm text-neutral-400">Todos los proyectos que creas aquí se muestran en esta vista profesional al instante.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm text-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <Pencil size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Sin proyectos en la vista previa</h3>
              <p className="text-sm text-neutral-400">Agrega un proyecto para verlo en tu portafolio público.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <article key={project.id} className="group overflow-hidden rounded-[32px] border border-white/10 bg-[#111115] p-6 transition hover:border-white/20">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-400">Proyecto destacado</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-neutral-400 mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase text-neutral-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5">
                        <GitBranch size={16} /> GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5">
                        <ExternalLink size={16} /> Ver demo
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {editingProject ? 'Editar Proyecto' : 'Agregar Proyecto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Título</label>
                <input
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  name="title"
                  type="text"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ej: AgroClima IoT"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Descripción Corta</label>
                <textarea
                  required
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  name="description"
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Análisis de datasets aplicados al cambio climático..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tags (separados por coma)</label>
                <input
                  required
                  value={formState.tags.join(', ')}
                  onChange={(e) => setFormState({ ...formState, tags: e.target.value.split(',').map((tag) => tag.trim()) })}
                  name="tags"
                  type="text"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Python, Orange, Minería de Datos"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Descripción Larga (Opcional)</label>
                <textarea
                  value={formState.long_description || ''}
                  onChange={(e) => setFormState({ ...formState, long_description: e.target.value })}
                  name="long_description"
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Descripción detallada del proyecto, tecnologías usadas, resultados obtenidos..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-3">Imagen del Proyecto</label>
                <div className="space-y-3">
                  {/* Input para cargar archivo */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 w-full p-4 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader size={18} className="animate-spin text-blue-400" />
                          <span className="text-sm text-neutral-300">Cargando imagen...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="text-neutral-400" />
                          <span className="text-sm text-neutral-300">Haz clic para cargar una imagen</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Input para URL manual */}
                  <div>
                    <input
                      value={formState.image_url || ''}
                      onChange={(e) => setFormState({ ...formState, image_url: e.target.value })}
                      name="image_url"
                      type="url"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="O pega una URL de imagen aquí (https://ejemplo.com/imagen.jpg)"
                    />
                  </div>

                  {/* Preview de la imagen */}
                  {formState.image_url && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
                      <div className="relative h-40 w-full">
                        <img
                          src={formState.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            toast.error('Error al cargar la imagen');
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">URL GitHub (Opcional)</label>
                  <input
                    value={formState.github_url || ''}
                    onChange={(e) => setFormState({ ...formState, github_url: e.target.value })}
                    name="github_url"
                    type="url"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">URL Demo (Opcional)</label>
                  <input
                    value={formState.live_url || ''}
                    onChange={(e) => setFormState({ ...formState, live_url: e.target.value })}
                    name="live_url"
                    type="url"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors">
                  {isSubmitting ? 'Guardando...' : editingProject ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
