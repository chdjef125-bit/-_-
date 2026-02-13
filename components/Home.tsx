import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  
  // Logic to create a denser grid pattern.
  const denseGridImages = useMemo(() => {
    const sourceImages = config.homeGridImages && config.homeGridImages.length > 0 
      ? config.homeGridImages 
      : [config.homeHeroImageUrl]; 

    // Increased count for denser grid (14 cols x 10 rows approx = 140 images needed)
    const minCount = 140;
    const targetCount = Math.max(sourceImages.length, minCount);
    
    const result: string[] = [];

    // Fill the array
    while (result.length < targetCount) {
       const batch = [...sourceImages];
       // Fisher-Yates Shuffle for randomness
       for (let i = batch.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [batch[i], batch[j]] = [batch[j], batch[i]];
       }
       result.push(...batch);
    }
    
    return result.slice(0, targetCount);
  }, [config.homeGridImages, config.homeHeroImageUrl]);

  return (
    <div className="bg-black w-full text-white">
      
      {/* 1. HERO - FULL SCREEN PHOTO GRID */}
      <section className="h-screen w-full relative overflow-hidden flex flex-col justify-center bg-black">
        
        {/* --- DENSE IMAGE GRID BACKGROUND --- */}
        {/* 
           Adjusted for denser layout:
           - Mobile: 6 cols
           - Tablet: 10 cols
           - Desktop: 14 cols
           gap-0.5 for thin distinct lines.
        */}
        <div className="absolute inset-0 z-0 grid grid-cols-6 md:grid-cols-10 lg:grid-cols-14 gap-0.5 bg-black content-start">
           {denseGridImages.map((img, idx) => (
             <div key={idx} className="relative w-full aspect-square overflow-hidden bg-neutral-900">
                <img 
                  src={img} 
                  alt="" 
                  loading="lazy"
                  // Static style: grayscale, no hover effect, dim opacity to act as background
                  className="w-full h-full object-cover grayscale opacity-50"
                />
             </div>
           ))}
        </div>

        {/* --- CONTENT OVERLAY --- */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none">
           {/* Darker overlay for text readability against busy grid */}
           <div className="absolute inset-0 bg-black/60"></div>
           
           <div className="max-w-[1920px] mx-auto w-full px-6 md:px-12 relative z-20">
              <h1 className="text-[12vw] md:text-[9vw] leading-none font-bold tracking-tighter text-white select-none drop-shadow-2xl opacity-100">
                {titleWords.map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              
              <div className="mt-12 max-w-xl">
                 <p className="text-lg md:text-xl text-white font-light leading-relaxed opacity-90 drop-shadow-md">
                   {config.homeHeroDescription}
                 </p>
              </div>
           </div>

           {/* Scroll Indicator */}
           <div className="absolute bottom-12 right-6 md:right-12 hidden md:flex flex-col items-center gap-2 opacity-50">
             <span className="text-[10px] font-mono uppercase tracking-widest text-white">Scroll</span>
             <div className="w-[1px] h-12 bg-white"></div>
           </div>
        </div>
      </section>

      {/* 2. MANIFESTO */}
      <section className="border-t border-neutral-900 bg-black relative">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1920px] mx-auto min-h-[80vh]">
          
          {/* Left: Text Content */}
          <div className="p-8 md:p-24 border-b md:border-b-0 md:border-r border-neutral-900 relative flex flex-col justify-center">
             <span className="absolute top-8 left-8 text-xs font-mono text-neutral-700">01 / CONSPIRACY</span>
             <h2 className="text-4xl md:text-5xl font-bold mb-8 mt-4 tracking-tight">Conspire.</h2>
             <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-8 max-w-md">
               {config.aboutDefinition}
             </p>
          </div>

          {/* Right: Compact Image Module */}
          <div className="relative flex items-center justify-center p-12 md:p-24 bg-neutral-900/10 overflow-hidden">
             <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
             </div>

             <div className="relative w-full max-w-[400px] aspect-square z-10">
                <div className="grid grid-cols-2 h-full w-full border border-neutral-800 bg-black shadow-2xl">
                   {[
                     config.processResearchImageUrl,
                     config.processNarrativeImageUrl,
                     config.processMassingImageUrl,
                     config.processOutputImageUrl
                   ].map((img, idx) => (
                     <div key={idx} className="relative group overflow-hidden border-b border-r border-neutral-800 last:border-r-0 md:odd:border-r hover:border-white/20 transition-colors">
                        <img 
                          src={img} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-white">Phase 0{idx+1}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="absolute -bottom-8 right-0 flex items-center gap-2">
                   <div className="h-[1px] w-8 bg-neutral-700"></div>
                   <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Process Archive</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-32 px-6 flex justify-center items-center relative overflow-hidden bg-black border-t border-neutral-900">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        </div>
        
        <RevealSection>
          <div className="relative z-10 p-12 md:p-16 max-w-3xl mx-auto">
            <div className="absolute inset-0 border border-white/10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white pointer-events-none"></div>

            <div className="text-center relative z-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Join the Conspiracy</h2>
              <button 
                 onClick={() => onNavigate('contact')}
                 className="px-8 py-3 bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </RevealSection>
      </section>

    </div>
  );
};