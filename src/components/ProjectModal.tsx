'use client';

import { X, ExternalLink, GitBranch } from 'lucide-react';

interface ProjectModalProps {
  project: {
    id: string;
    title: string;
    description: string;
    long_description?: string;
    tags: string[];
    image_url?: string;
    github_url?: string;
    live_url?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        {project.image_url && (
          <div className="relative h-64 md:h-80 overflow-hidden border-b border-white/10">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 md:p-8">
          {/* Close button */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-400 mb-2">Proyecto Destacado</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Descripción corta */}
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Descripción larga si existe */}
          {project.long_description && (
            <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Detalles del Proyecto</h3>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {project.long_description}
              </p>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium uppercase tracking-wider border border-blue-400/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enlaces */}
          {(project.github_url || project.live_url) && (
            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <GitBranch size={16} />
                  <span>Ver en GitHub</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Ver Demo en Vivo</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
