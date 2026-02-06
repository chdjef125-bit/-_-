import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Box, Layers, PenTool, ChevronDown } from 'lucide-react';
import { PageView, Project, SiteConfig } from '../types';

interface HomeProps {
  featuredProjects: Project[];
  onNavigate: (page: PageView) => void;
  config: SiteConfig;
}

// Helper component for Scroll Reveals
const RevealSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
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
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset trigger point
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? 'active' : ''}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ featuredProjects, onNavigate, config }) => {
  return (
    <div>
      {/* Full Screen Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url('${config.homeHeroImageUrl}')` }}
        >
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
        </div>

        {/* Main Center Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-sans font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            {config.homeHeroTitle}
          </h1>
          <p className="text-xl md:text-3xl text-white/90 font-light mb-16 tracking-wide drop-shadow-lg">
            {config.homeHeroSubtitle}
          </p>
          
          <button 
            onClick={() => {
              document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex flex-col items-center gap-3 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase border-b border-transparent group-hover:border-white pb-1">Learn More</span>
            <ChevronDown className="animate-bounce mt-2" size={24} />
          </button>
        </div>

        {/* Right Vertical Action Button */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-6">
           <div className="h-24 w-[1px] bg-white/40"></div>
           <button 
             onClick={() => onNavigate('contact')}
             className="vertical-rl text-xs font-bold tracking-[0.2em] text-white hover:text-jakdang-accent transition-colors rotate-180 py-2 uppercase whitespace-nowrap"
             style={{ writingMode: 'vertical-rl' }}
           >
             Join The Conspiracy
           </button>
           <div className="h-24 w-[1px] bg-white/40"></div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-jakdang-accent/90 backdrop-blur-md z-20 py-4 px-6 md:px-12 flex justify-between items-center border-t border-white/10">
          <div className="flex items-center gap-4 overflow-hidden w-full">
            <span className="text-white font-medium text-sm md:text-lg tracking-wide marquee">
              {config.homeHeroDescription}
            </span>
          </div>
          <div className="hidden md:block shrink-0 ml-8 text-white/70 text-xs font-mono border border-white/30 px-2 py-1 rounded">
             JAKDANG © {new Date().getFullYear()}
          </div>
        </div>
      </section>

      {/* Wrapper for the rest of the content to match layout constraints */}
      <div id="content-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        
        {/* Philosophy / Definition */}
        <RevealSection>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                <span className="text-jakdang-accent font-mono text-lg">01.</span>
                The Conspiracy
              </h2>
              <p className="text-jakdang-muted leading-relaxed">
                '작당(作黨)'은 본래 떼를 지어 일을 꾀한다는 뜻입니다. 우리는 이 단어를 재정의합니다. 
                단순한 학생 동아리가 아닌, <strong className="text-white">준전문 설계 집단</strong>으로서 
                건축적 담론을 생산하고 실험적인 공간을 모의하는 곳입니다.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <Box className="text-jakdang-accent mt-1" size={20} />
                  <div>
                    <strong className="block text-white">Studio Culture</strong>
                    <span className="text-sm text-jakdang-muted">Intense critique and peer review culture similar to professional studios.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Layers className="text-jakdang-accent mt-1" size={20} />
                  <div>
                    <strong className="block text-white">Process Oriented</strong>
                    <span className="text-sm text-jakdang-muted">Documenting the "Why" and "How", not just the "What".</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-neutral-900 p-8 border border-neutral-800 relative shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-neutral-800 flex flex-col items-center justify-center p-4 text-center hover:bg-jakdang-accent hover:text-white transition-colors cursor-crosshair">
                    <PenTool className="mb-2" />
                    <span className="font-mono text-xs uppercase">Research</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex flex-col items-center justify-center p-4 text-center hover:bg-jakdang-accent hover:text-white transition-colors cursor-crosshair">
                    <Layers className="mb-2" />
                    <span className="font-mono text-xs uppercase">Narrative</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex flex-col items-center justify-center p-4 text-center hover:bg-jakdang-accent hover:text-white transition-colors cursor-crosshair">
                    <Box className="mb-2" />
                    <span className="font-mono text-xs uppercase">Massing</span>
                 </div>
                 <div className="aspect-square bg-neutral-800 flex flex-col items-center justify-center p-4 text-center hover:bg-jakdang-accent hover:text-white transition-colors cursor-crosshair">
                    <ArrowRight className="mb-2" />
                    <span className="font-mono text-xs uppercase">Output</span>
                 </div>
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Featured Works */}
        <RevealSection>
          <section>
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
              <h2 className="text-3xl font-serif font-bold text-white">
                <span className="text-jakdang-accent font-mono text-lg mr-4">02.</span>
                Featured Works
              </h2>
              <button onClick={() => onNavigate('works')} className="text-sm text-jakdang-muted hover:text-white flex items-center gap-2">
                View All Archive <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, index) => (
                <div key={project.id} onClick={() => onNavigate('works')} className="group cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-900 border border-white/5 relative">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="border border-white px-4 py-2 uppercase text-xs tracking-widest">View Project</span>
                    </div>
                  </div>
                  <div className="mt-4 border-l-2 border-transparent group-hover:border-jakdang-accent pl-3 transition-all">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-jakdang-muted font-mono mt-1">{project.year} | {project.category}</p>
                  </div>
                </div>
              ))}
              {featuredProjects.length === 0 && (
                <div className="col-span-3 text-center py-12 text-neutral-600 font-mono text-sm border border-dashed border-neutral-800">
                   Projects arriving soon...
                </div>
              )}
            </div>
          </section>
        </RevealSection>

        {/* CTA */}
        <RevealSection>
          <section className="bg-white text-black p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-jakdang-accent to-black"></div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Join the Conspiracy</h2>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
              우리는 함께 고민하고, 치열하게 토론하며, 결국에는 만들어낼 동료를 찾습니다.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button onClick={() => onNavigate('contact')} className="border-2 border-black px-8 py-4 font-bold hover:bg-black hover:text-white transition-colors uppercase tracking-widest">
                Contact for Collaboration
              </button>
            </div>
          </section>
        </RevealSection>
      </div>
    </div>
  );
};