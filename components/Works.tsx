import React, { useState } from 'react';
import { Project } from '../types';

interface WorksProps {
  projects: Project[];
}

export const Works: React.FC<WorksProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'All' | 'Academic' | 'Competition' | 'Personal' | 'Team'>('All');
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Large Typographic Filter - Scaled up to match other pages headers */}
        <div className="px-6 md:px-12 py-12 md:py-24 flex flex-wrap gap-x-6 md:gap-x-12 gap-y-2 items-baseline select-none">
          {['All', 'Academic', 'Competition', 'Team', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`text-4xl md:text-7xl font-bold tracking-tighter uppercase transition-all duration-300 leading-none ${
                filter === cat ? 'text-white' : 'text-neutral-800 hover:text-neutral-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clean Grid - No Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-neutral-900">
          {filteredProjects.map((project, idx) => (
            <article 
              key={project.id} 
              className="group relative aspect-square border-b border-neutral-900 md:border-r lg:nth-child(3n):border-r-0 cursor-pointer overflow-hidden"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="flex justify-between">
                   <span className="text-xs font-mono uppercase text-white bg-black px-2 py-1">{project.category}</span>
                   <span className="text-xs font-mono text-white">{project.year}</span>
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">{project.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-32 text-center text-neutral-600">
            Nothing to see here yet.
          </div>
        )}
      </div>
    </div>
  );
};