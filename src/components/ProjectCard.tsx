'use client';

import { useState } from 'react';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    long_description?: string;
    tags: string[];
    image_url?: string;
    github_url?: string;
    live_url?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition hover:border-blue-400/30 hover:bg-white/10 flex flex-col h-full"
      >
        {project.image_url && (
          <div className="relative h-48 md:h-56 overflow-hidden bg-black/30">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium">
                Ver detalles
              </span>
            </div>
          </div>
        )}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <span className="text-xs uppercase tracking-[0.3em] text-blue-400 mb-2">Proyecto</span>
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">{project.title}</h3>
          <p className="text-sm leading-6 text-neutral-300 mb-6 line-clamp-3">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
