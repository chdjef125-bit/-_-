import React, { useState } from 'react';
import { Project } from '../types';
import { Filter, Search } from 'lucide-react';

interface WorksProps {
  projects: Project[];
}

export const Works: React.FC<WorksProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'All' | 'Academic' | 'Competition' | 'Personal' | 'Team'>('All');
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Works Archive</h1>
          <p className="text-jakdang-muted font-mono text-sm">Documented Evidence of Design Intelligence.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['All', 'Academic', 'Competition', 'Team', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                filter === cat 
                  ? 'bg-jakdang-accent border-jakdang-accent text-white' 
                  : 'border-white/20 text-jakdang-muted hover:border-white hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <article key={project.id} className="group bg-neutral-900 border border-neutral-800 hover:border-jakdang-accent transition-colors duration-300">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-mono uppercase border border-white/10 text-white">
                {project.year}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-jakdang-accent text-xs font-bold uppercase tracking-widest">{project.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-jakdang-accent transition-colors">{project.title}</h3>
              <p className="text-sm text-jakdang-muted line-clamp-2 mb-4 font-light">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded text-neutral-400">#{tag}</span>
                ))}
              </div>
              <div className="mt-4 text-xs font-mono text-neutral-500 text-right">
                Author: {project.author}
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="py-20 text-center border border-dashed border-white/10">
          <Filter className="mx-auto text-neutral-700 mb-4" size={48} />
          <p className="text-neutral-500 font-mono">No records found in this category.</p>
        </div>
      )}
    </div>
  );
};