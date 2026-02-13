import React, { useEffect, useRef, useState } from 'react';
import { PageView, Project, SiteConfig } from '../types';

interface HomeProps {
  featuredProjects: Project[];
  onNavigate: (page: PageView) => void;
  config: SiteConfig;
}

const RevealSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={`reveal ${isVisible ? 'active' : ''}`}>
      {children}
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ featuredProjects, onNavigate, config }) => {
  // Use user config title or default to split layout
  const titleWords = config.homeHeroTitle ? config.homeHeroTitle.split(' ') : ["JAK", "DANG"];

  return (
    <div className="bg-black w-full overflow-hidden">
      
      {/* 1. HERO - MASSIVE TYPOGRAPHY */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 relative">
        <div className="max-w-[1920px] mx-auto w-full">
          <div className="mb-8">
             <span className="text-xs font-bold tracking-widest text-jakdang-accent uppercase">Architectural Studio</span>
          </div>
          
          <h1 className="text-[15vw] leading-[0.8] font-bold tracking-tighter text-white mix-blend-difference select-none">
            {titleWords.map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          
          <div className="mt-12 max-w-2xl">
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
              {config.homeHeroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2. MANIFESTO - Clean Split */}
      <section className="border-t border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1920px] mx-auto">
          <div className="p-8 md:p-24 border-b md:border-b-0 md:border-r border-neutral-900">
             <h2 className="text-4xl font-bold mb-8">Conspire.</h2>
             <p className="text-neutral-400 text-lg leading-relaxed mb-8">
               {config.aboutDefinition}
             </p>
             {/* Read Manifesto button removed as About page is deleted */}
          </div>
          <div className="grid grid-cols-2">
             {[
               config.processResearchImageUrl,
               config.processNarrativeImageUrl,
               config.processMassingImageUrl,
               config.processOutputImageUrl
             ].map((img, idx) => (
               <div key={idx} className="aspect-square relative group overflow-hidden border-b border-r border-neutral-900 last:border-r-0 md:odd:border-r">
                  <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. WORKS - Clean Grid */}
      <section className="border-t border-neutral-900">
        <div className="max-w-[1920px] mx-auto">
          <div className="p-6 md:px-12 md:py-8 border-b border-neutral-900 flex justify-between items-end">
             <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-800">WORKS</h2>
             <button onClick={() => onNavigate('works')} className="hidden md:block text-sm font-bold uppercase tracking-widest hover:text-jakdang-accent transition-colors">
               View All Archive
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project, idx) => (
              <div 
                key={project.id} 
                onClick={() => onNavigate('works')}
                className="group relative aspect-[4/5] border-b border-neutral-900 md:border-r md:last:border-r-0 cursor-pointer overflow-hidden"
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-mono mb-2 text-jakdang-accent">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden p-6 text-center border-b border-neutral-900">
             <button onClick={() => onNavigate('works')} className="text-sm font-bold uppercase tracking-widest">
               View All Projects
             </button>
          </div>
        </div>
      </section>

      {/* 4. CTA - Simple */}
      <section className="py-32 px-6 text-center">
        <RevealSection>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Join the Conspiracy</h2>
          <button 
             onClick={() => onNavigate('contact')}
             className="px-8 py-3 bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
          >
            Contact Us
          </button>
        </RevealSection>
      </section>

    </div>
  );
};