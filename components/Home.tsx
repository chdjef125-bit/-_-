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
  
  // Ensure we have images for the grid (fill with pattern if empty)
  const gridImages = config.homeGridImages && config.homeGridImages.length > 0 
    ? config.homeGridImages 
    : Array(24).fill(config.homeHeroImageUrl); // Fallback to hero image repeated

  return (
    <div className="bg-black w-full text-white">
      
      {/* 1. HERO - FULL SCREEN PHOTO GRID */}
      <section className="h-screen w-full relative overflow-hidden flex flex-col justify-center bg-black">
        
        {/* --- DENSE IMAGE GRID BACKGROUND (User Requested) --- */}
        <div className="absolute inset-0 z-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 auto-rows-fr gap-[1px] bg-neutral-900 opacity-60">
           {/* Duplicate images to fill screen if needed, slicing to keep performance reasonable */}
           {[...gridImages, ...gridImages, ...gridImages].slice(0, 48).map((img, idx) => (
             <div key={idx} className="relative w-full h-full overflow-hidden group">
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out"
                />
             </div>
           ))}
        </div>

        {/* --- ARCHITECTURAL OVERLAY --- */}
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 z-1 bg-black/50 pointer-events-none"></div>

        {/* Grid Pattern (Thin lines overlaying the photos) */}
        <div className="absolute inset-0 z-1 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#aaa_1px,transparent_1px),linear-gradient(to_bottom,#aaa_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* --- CONTENT --- */}
        <div className="max-w-[1920px] mx-auto w-full h-full px-6 md:px-12 flex flex-col justify-center relative z-10 pointer-events-none">
          
          {/* Main Title - Centered vertically */}
          <div className="flex-grow flex flex-col justify-center">
            <h1 className="text-[10vw] md:text-[8vw] leading-none font-bold tracking-tighter text-white select-none drop-shadow-2xl">
              {titleWords.map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
          </div>
          
          {/* Description - Bottom aligned */}
          <div className="absolute bottom-12 left-6 md:left-12 max-w-2xl">
            <p className="text-lg md:text-xl text-white font-light leading-relaxed opacity-90 drop-shadow-md">
              {config.homeHeroDescription}
            </p>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 right-6 md:right-12 hidden md:flex flex-col items-center gap-2 opacity-50">
             <span className="text-[10px] font-mono uppercase tracking-widest text-white">Scroll</span>
             <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>

      {/* 2. MANIFESTO - Clean Split */}
      <section className="border-t border-neutral-900 bg-black relative">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1920px] mx-auto">
          <div className="p-8 md:p-24 border-b md:border-b-0 md:border-r border-neutral-900 relative">
             {/* Decorative Number */}
             <span className="absolute top-8 left-8 text-xs font-mono text-neutral-700">01 / CONSPIRACY</span>
             
             <h2 className="text-4xl font-bold mb-8 mt-4">Conspire.</h2>
             <p className="text-neutral-400 text-lg leading-relaxed mb-8">
               {config.aboutDefinition}
             </p>
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
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. WORKS SECTION REMOVED AS REQUESTED */}

      {/* 4. CTA - Simple */}
      <section className="py-32 px-6 text-center relative overflow-hidden bg-black border-t border-neutral-900">
        {/* Background Grid for Footer Area too */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>
        
        <RevealSection>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Join the Conspiracy</h2>
            <button 
               onClick={() => onNavigate('contact')}
               className="px-8 py-3 bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </RevealSection>
      </section>

    </div>
  );
};