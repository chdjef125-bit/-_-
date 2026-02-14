import React from 'react';
import { Project } from '../types';

interface WorksProps {
  projects: Project[];
}

export const Works: React.FC<WorksProps> = ({ projects }) => {
  // Filter state removed to show all projects directly

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Title Only - No Filters */}
        <div className="px-6 md:px-12 pb-12 md:pb-24">
           <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white uppercase">WORKS</h1>
        </div>

        {/* Masonry Layout - No gaps, Variable Heights */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-0 space-y-0 bg-black">
          {projects.map((project) => (
            <article 
              key={project.id} 
              className="group relative w-full break-inside-avoid cursor-pointer overflow-hidden border-[0.5px] border-neutral-900 bg-neutral-900"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-auto block opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              
              {/* Overlay: Text Only, No Background/Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between z-10 p-8 pointer-events-none">
                
                <div className="flex justify-between items-start">
                   <span className="text-xs font-mono uppercase text-white bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-1">{project.category}</span>
                   <span className="text-xs font-mono text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1">{project.year}</span>
                </div>
                
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {/* Title and Author in Black, Shadow Removed */}
                  <h3 className="text-3xl font-bold text-black leading-tight mb-2">{project.title}</h3>
                  <p className="text-sm font-mono text-black">{project.author}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-32 text-center text-neutral-600">
            Nothing to see here yet.
          </div>
        )}
      </div>
    </div>
  );
};