import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Works } from './components/Works';
import { Admin } from './components/Admin';
import { Members, Awards, Activity, Contact } from './components/OtherPages';
import { PageView, Project, Member, AwardItem, ActivityLog, SiteConfig } from './types';
import { DataService } from './services/store';

// Splash Screen Component
const SplashScreen: React.FC = () => {
  const mainText = "작당모의";
  const subText = "Architectural Student Club";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
       {/* Background Grid - Very Subtle */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none perspective-[500px]">
          <div className="absolute inset-[-50%] bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] [transform:perspective(500px)_rotateX(60deg)] animate-[gridMove_8s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]"></div>
       </div>

      <div className="relative p-10 flex flex-col items-center z-10 text-center">
        {/* Main Title - Cinematic Reveal */}
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4">
          {mainText.split('').map((char, index) => (
            <span 
              key={index} 
              className="inline-block animate-cinematic" 
              style={{ animationDelay: `${index * 0.15}s` }} // Slow stagger
            >
              {char}
            </span>
          ))}
        </h1>
        
        {/* Subtitle - Slow Fade */}
        <div className="h-px w-12 bg-white/30 mb-4 animate-fade-slow" style={{ animationDelay: '0.8s' }}></div>
        
        <p 
           className="text-white/60 text-xs md:text-sm font-mono uppercase tracking-[0.2em] animate-cinematic"
           style={{ animationDelay: '1.0s' }}
        >
           {subText}
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    homeHeroTitle: "", homeHeroSubtitle: "", homeHeroDescription: "", homeHeroImageUrl: "", homeGridImages: [],
    aboutDefinition: "", contactRecruitText: "", contactCollabText: ""
  });

  // Initialize Data Effects and Splash Timer
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [p, m, a, act, conf] = await Promise.all([
          DataService.getProjects(),
          DataService.getMembers(),
          DataService.getAwards(),
          DataService.getActivities(),
          DataService.getSiteConfig()
        ]);

        setProjects(p);
        setMembers(m);
        setAwards(a);
        setActivities(act);
        setSiteConfig(conf);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadAllData();

    // Splash screen timer
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); // Slightly longer for the slow animation

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home featuredProjects={projects} onNavigate={handleNavigate} config={siteConfig} />;
      // About page removed
      case 'members':
        return <Members members={members} />;
      case 'works':
        return <Works projects={projects} />;
      // Process route removed
      case 'activity':
        return <Activity items={activities} />;
      case 'award':
        return <Awards items={awards} />;
      case 'contact':
        return <Contact config={siteConfig} onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <Admin 
            projects={projects} setProjects={setProjects}
            members={members} setMembers={setMembers}
            activities={activities} setActivities={setActivities}
            awards={awards} setAwards={setAwards}
            config={siteConfig} setConfig={setSiteConfig}
            onLogout={() => setCurrentPage('home')} 
          />
        );
      default:
        return <Home featuredProjects={projects} onNavigate={handleNavigate} config={siteConfig} />;
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
};

export default App;