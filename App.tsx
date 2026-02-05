import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Works } from './components/Works';
import { Admin } from './components/Admin';
import { About, Members, Process, Archive, Activity, Contact } from './components/OtherPages';
import { PageView, Project, Member, ArchiveItem, ActivityLog, ProcessStep, SiteConfig } from './types';
import { DataService } from './services/store';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [archive, setArchive] = useState<ArchiveItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DataService.getSiteConfig()); // Initialize with store data immediately

  // Initialize Data Effects
  useEffect(() => {
    setProjects(DataService.getProjects());
    setMembers(DataService.getMembers());
    setArchive(DataService.getArchive());
    setActivities(DataService.getActivities());
    setProcessSteps(DataService.getProcess());
    setSiteConfig(DataService.getSiteConfig());
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

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
};

export default App;