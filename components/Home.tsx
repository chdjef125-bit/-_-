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
  
  // Logic to create a fixed grid pattern of exactly 72 images (divisible by 4, 8, 12).
  const denseGridImages = useMemo(() => {
    const sourceImages = config.homeGridImages && config.homeGridImages.length > 0 
      ? config.homeGridImages 
      : [config.homeHeroImageUrl]; 

    // Target 72 images to fit the screen nicely with new column counts
    const targetCount = 72;
    
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
        
        {/* --- GRID BACKGROUND --- */}
        <div className="absolute inset-0 z-0 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1 bg-black place-content-center">
           {denseGridImages.map((img, idx) => (
             <div key={idx} className="relative w-full pt-[100%] overflow-hidden bg-neutral-900">
                <img 
                  src={img} 
                  alt="" 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 block"
                />
             </div>
           ))}
        </div>

        {/* --- CONTENT OVERLAY --- */}
        <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
           <div className="absolute inset-0 bg-black/50"></div>
           
           <div className="max-w-[1920px] mx-auto w-full px-6 md:px-12 relative z-20 h-full flex flex-col items-start justify-end md:justify-center pb-24 md:pb-0">
              <div className="w-full text-left">
                <h1 className="text-[15vw] md:text-[5.5vw] leading-[0.9] font-bold tracking-tighter text-white select-none drop-shadow-2xl opacity-100 mb-6 md:mb-8">
                  {titleWords.map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h1>
                
                <div className="w-full md:max-w-xl">
                   <p className="text-[3.2vw] md:text-lg text-white font-light leading-relaxed opacity-90 drop-shadow-md whitespace-nowrap">
                     {config.homeHeroDescription}
                   </p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. MANIFESTO - REDESIGNED (Minimal & Clean) */}
      <section className="bg-black relative overflow-hidden py-24 md:py-40">
        
        {/* Global Section Grid Background (Subtle) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]"></div>
        </div>

        <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            
            {/* Left: Text Block */}
            <div className="order-2 md:order-1">
               {/* Technical/Minimal Label */}
               <div className="flex items-center gap-3 mb-8 opacity-70">
                  <div className="w-2 h-2 bg-jakdang-accent"></div>
                  <span className="font-mono text-xs tracking-[0.2em] text-white">MANIFESTO</span>
                  <div className="h-px w-16 bg-neutral-800"></div>
               </div>

               {/* Title - Pure Accent Color */}
               <h2 className="text-6xl md:text-9xl font-bold mb-8 tracking-tighter text-jakdang-accent leading-[0.8]">
                 {config.homeManifestoTitle || "Conspire"}
               </h2>
               
               {/* Definition */}
               <div className="border-l border-neutral-800 pl-6 md:pl-8">
                 <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light max-w-md">
                   {config.aboutDefinition}
                 </p>
               </div>

               {/* Decorative Stats/Info */}
               <div className="mt-16 grid grid-cols-2 gap-8 border-t border-neutral-900 pt-8 max-w-sm">
                  <div>
                    <span className="block text-xs font-mono text-neutral-600 mb-1 uppercase">Establishment</span>
                    <span className="block text-white font-bold">2021.03</span>
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-neutral-600 mb-1 uppercase">Location</span>
                    <span className="block text-white font-bold">Busan, KR</span>
                  </div>
               </div>
            </div>

            {/* Right: Clean Image with Fading Grid Background */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end relative">
               
               {/* Fading Grid Background for Image Focus */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(closest-side,black,transparent)] opacity-40"></div>
               </div>

               <div className="relative w-full max-w-md group">
                  {config.homeManifestoImageUrl ? (
                    <div className="relative z-10">
                       <img 
                          src={config.homeManifestoImageUrl} 
                          alt="Manifesto" 
                          className="w-full h-auto object-contain grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/5] flex items-center justify-center text-neutral-800 font-mono text-xs uppercase tracking-widest bg-neutral-900">
                      [ No Visual Signal ]
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-20 md:py-32 px-6 flex justify-center items-center relative overflow-hidden bg-black border-t border-neutral-900">
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