import React, { useState } from 'react';
import { Project } from '../types';

interface WorksProps {
  projects: Project[];
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <article 
    className="group relative w-full break-inside-avoid cursor-pointer overflow-hidden border-[0.5px] border-neutral-900 bg-neutral-900"
  >
    <img 
      src={project.imageUrl} 
      alt={project.title} 
      className="w-full h-auto block opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
    />
    
    {/* Overlay: Gradient Background for readability on any image */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between z-10 p-8 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent">
      
      <div className="flex justify-between items-start">
          <span className="text-xs font-mono uppercase text-white bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-1">{project.category}</span>
          <span className="text-xs font-mono text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1">{project.year}</span>
      </div>
      
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        {/* Title and Author in White with Drop Shadow */}
        <h3 className="text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md">{project.title}</h3>
        <p className="text-sm font-mono text-neutral-300 drop-shadow-md">{project.author}</p>
      </div>
    </div>
  </article>
);

export const Works: React.FC<WorksProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<'works' | 'studies'>('works');

  const worksProjects = projects.filter(p => p.category !== 'Study');
  const studyProjects = projects.filter(p => p.category === 'Study');

  const displayedProjects = activeTab === 'works' ? worksProjects : studyProjects;

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Navigation / Header - Toggle System */}
        <div className="px-6 md:px-12 pb-12 md:pb-24 pt-12 md:pt-0">
           <div className="flex flex-wrap gap-x-8 md:gap-x-16 gap-y-2 items-baseline">
             <button 
               onClick={() => setActiveTab('works')}
               className={`text-5xl md:text-8xl font-bold tracking-tighter uppercase transition-colors duration-300 ${activeTab === 'works' ? 'text-white' : 'text-neutral-800 hover:text-neutral-500'}`}
             >
               WORKS
             </button>
             <button 
               onClick={() => setActiveTab('studies')}
               className={`text-5xl md:text-8xl font-bold tracking-tighter uppercase transition-colors duration-300 ${activeTab === 'studies' ? 'text-white' : 'text-neutral-800 hover:text-neutral-500'}`}
             >
               STUDIES
             </button>
           </div>
        </div>

        {/* Content Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-0 space-y-0 bg-black pb-32 min-h-[50vh]">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {displayedProjects.length === 0 && (
             <div className="break-inside-avoid px-6 md:px-12 py-12 text-neutral-600 font-mono text-sm">
               {activeTab === 'works' ? 'No main projects uploaded yet.' : 'No study records uploaded yet.'}
             </div>
          )}
        </div>

      </div>
    </div>
  );
};