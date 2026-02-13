import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Works } from './components/Works';
import { Admin } from './components/Admin';
import { Members, Archive, Activity, Contact } from './components/OtherPages';
import { PageView, Project, Member, ArchiveItem, ActivityLog, SiteConfig } from './types';
import { DataService } from './services/store';

// Splash Screen Component
const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div className="relative p-10 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white splash-text text-center tracking-tight">
          작당모의
        </h1>
        <p className="text-white/50 text-xs tracking-[0.5em] mt-6 uppercase text-center splash-fade" style={{ animationDelay: '0.5s' }}>
          Jakdang Architectural Studio
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
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    homeHeroTitle: "", homeHeroSubtitle: "", homeHeroDescription: "", homeHeroImageUrl: "",
    aboutDefinition: "", aboutDescription: "", contactRecruitText: "", contactCollabText: ""
  });

  // Initialize Data Effects and Splash Timer
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [p, m, a, act, conf] = await Promise.all([
          DataService.getProjects(),
          DataService.getMembers(),
          DataService.getArchive(),
          DataService.getActivities(),
          DataService.getSiteConfig()
        ]);

        setProjects(p);
        setMembers(m);
        setArchive(a);
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
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
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
      case 'archive':
        return <Archive items={archive} />;
      case 'contact':
        return <Contact config={siteConfig} onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <Admin 
            projects={projects} setProjects={setProjects}
            members={members} setMembers={setMembers}
            activities={activities} setActivities={setActivities}
            archive={archive} setArchive={setArchive}
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