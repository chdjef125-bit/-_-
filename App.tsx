import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Works } from './components/Works';
import { Admin } from './components/Admin';
import { About, Members, Process, Archive, Activity, Contact } from './components/OtherPages';
import { PageView, Project, Member, ArchiveItem, ActivityLog, ProcessStep, SiteConfig } from './types';
import { DataService } from './services/store';

// Splash Screen Component
const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div className="relative p-10">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-white splash-text text-center">
          작당
        </h1>
        <p className="text-white/50 text-xs tracking-[0.5em] mt-4 uppercase text-center splash-text" style={{ animationDelay: '0.3s' }}>
          Jakdang Architectural Studio
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-jakdang-accent splash-line"></div>
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
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DataService.getSiteConfig());

  // Initialize Data Effects and Splash Timer
  useEffect(() => {
    setProjects(DataService.getProjects());
    setMembers(DataService.getMembers());
    setArchive(DataService.getArchive());
    setActivities(DataService.getActivities());
    setProcessSteps(DataService.getProcess());
    setSiteConfig(DataService.getSiteConfig());

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
      case 'about':
        return <About config={siteConfig} />;
      case 'members':
        return <Members members={members} />;
      case 'works':
        return <Works projects={projects} />;
      case 'process':
        return <Process items={processSteps} />;
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
            process={processSteps} setProcess={setProcessSteps}
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