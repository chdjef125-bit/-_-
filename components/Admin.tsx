import React, { useState } from 'react';
import { Project, Member, ActivityLog, ArchiveItem, ProcessStep, SiteConfig } from '../types';
import { Trash2, Plus, Lock, LogOut, Layout, Users, Calendar, Archive, FileText, Settings, Upload, Image as ImageIcon, Link } from 'lucide-react';
import { DataService } from '../services/store';

interface AdminProps {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  members: Member[];
  setMembers: (m: Member[]) => void;
  activities: ActivityLog[];
  setActivities: (a: ActivityLog[]) => void;
  archive: ArchiveItem[];
  setArchive: (a: ArchiveItem[]) => void;
  process: ProcessStep[];
  setProcess: (p: ProcessStep[]) => void;
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;
  onLogout: () => void;
}

type TabType = 'projects' | 'members' | 'activities' | 'archive' | 'process' | 'config';

export const Admin: React.FC<AdminProps> = ({ 
  projects, setProjects, 
  members, setMembers, 
  activities, setActivities, 
  archive, setArchive, 
  process, setProcess,
  config, setConfig,
  onLogout 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  
  // Forms State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: 'Academic', year: '2024', author: '', description: '', imageUrl: '', tags: []
  });
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '', role: 'Member', cohort: '13th', philosophy: '', imageUrl: ''
  });
  const [newActivity, setNewActivity] = useState<Partial<ActivityLog>>({
    title: '', date: '2024.01', type: 'Workshop', description: '', imageUrl: ''
  });
  const [newArchive, setNewArchive] = useState<Partial<ArchiveItem>>({
    title: '', type: 'Award', year: '2024', description: ''
  });
  const [newProcess, setNewProcess] = useState<Partial<ProcessStep>>({
    stepNumber: '00', title: '', description: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') setIsAuthenticated(true);
    else alert('Access Denied');
  };

  /* --- HANDLERS --- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check (approx 2MB limit for localStorage safety)
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Generic delete handler
  const createDeleteHandler = <T extends { id: string }>(
    data: T[], 
    setter: (d: T[]) => void, 
    persister: (d: T[]) => void
  ) => (id: string) => {
    if (confirm('Permanently delete record?')) {
      const updated = data.filter(item => item.id !== id);
      setter(updated);
      persister(updated);
    }
  };

  const deleteProject = createDeleteHandler(projects, setProjects, DataService.saveProjects);
  const deleteMember = createDeleteHandler(members, setMembers, DataService.saveMembers);
  const deleteActivity = createDeleteHandler(activities, setActivities, DataService.saveActivities);
  const deleteArchive = createDeleteHandler(archive, setArchive, DataService.saveArchive);
  const deleteProcess = createDeleteHandler(process, setProcess, DataService.saveProcess);

  // Add Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Project = { ...newProject as Project, id: DataService.generateId() };
    const updated = [item, ...projects];
    setProjects(updated);
    DataService.saveProjects(updated);
    setNewProject({ title: '', category: 'Academic', year: '2024', author: '', description: '', imageUrl: '', tags: [] });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Member = { ...newMember as Member, id: DataService.generateId() };
    const updated = [item, ...members];
    setMembers(updated);
    DataService.saveMembers(updated);
    setNewMember({ name: '', role: 'Member', cohort: '13th', philosophy: '', imageUrl: '' });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ActivityLog = { ...newActivity as ActivityLog, id: DataService.generateId() };
    const updated = [item, ...activities];
    setActivities(updated);
    DataService.saveActivities(updated);
    setNewActivity({ title: '', date: '2024.01', type: 'Workshop', description: '', imageUrl: '' });
  };

  const handleAddArchive = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ArchiveItem = { ...newArchive as ArchiveItem, id: DataService.generateId() };
    const updated = [item, ...archive];
    setArchive(updated);
    DataService.saveArchive(updated);
    setNewArchive({ title: '', type: 'Award', year: '2024', description: '' });
  };
  
  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ProcessStep = { ...newProcess as ProcessStep, id: DataService.generateId() };
    const updated = [...process, item].sort((a,b) => a.stepNumber.localeCompare(b.stepNumber));
    setProcess(updated);
    DataService.saveProcess(updated);
    setNewProcess({ stepNumber: '', title: '', description: '' });
  };

  const handleConfigUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newConfig = { ...config, [e.target.name]: e.target.value };
    setConfig(newConfig);
    DataService.saveSiteConfig(newConfig);
  };
  
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => {
      const newConfig = { ...config, homeHeroImageUrl: url };
      setConfig(newConfig);
      DataService.saveSiteConfig(newConfig);
    });
  };

  /* --- RENDERERS --- */

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800">
          <div className="text-center mb-8">
            <Lock className="mx-auto text-jakdang-accent mb-4" size={48} />
            <h2 className="text-xl font-bold text-white">Admin Access</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:border-jakdang-accent outline-none text-center tracking-widest"
              placeholder="PIN CODE"
              autoFocus
            />
            <button type="submit" className="w-full bg-white text-black font-bold py-3 hover:bg-jakdang-accent hover:text-white transition-colors">
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-neutral-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Console</h1>
          <p className="font-mono text-neutral-500 text-sm">System Management Interface</p>
        </div>
        <button onClick={() => { setIsAuthenticated(false); onLogout(); }} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white">
          <LogOut size={16} /> EXIT
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800">
        {[
          { id: 'projects', icon: Layout, label: 'Projects' },
          { id: 'members', icon: Users, label: 'Members' },
          { id: 'activities', icon: Calendar, label: 'Activities' },
          { id: 'archive', icon: Archive, label: 'Archive' },
          { id: 'process', icon: FileText, label: 'Process' },
          { id: 'config', icon: Settings, label: 'Site Content' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-jakdang-accent border-b-2 border-jakdang-accent' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === PROJECTS TAB === */}
        {activeTab === 'projects' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900/50 p-6 border border-neutral-800 h-fit">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Project</h3>
              <form onSubmit={handleAddProject} className="space-y-4">
                <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as any})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none">
                    <option value="Academic">Academic</option><option value="Competition">Competition</option><option value="Team">Team</option><option value="Personal">Personal</option>
                  </select>
                  <input placeholder="Year" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none" />
                </div>
                <input placeholder="Author" value={newProject.author} onChange={e => setNewProject({...newProject, author: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none" required />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-24" required />
                
                {/* Image Upload */}
                <div>
                   <label className="block text-xs text-neutral-500 mb-1">Cover Image</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewProject({...newProject, imageUrl: url}))} className="hidden" id="proj-img" />
                     <label htmlFor="proj-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors">
                       {newProject.imageUrl ? <img src={newProject.imageUrl} className="h-full w-full object-cover" alt="Preview"/> : <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Image</span></div>}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input 
                        placeholder="Or paste Image URL" 
                        value={newProject.imageUrl} 
                        onChange={e => setNewProject({...newProject, imageUrl: e.target.value})}
                        className="bg-transparent border-b border-neutral-800 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent"
                     />
                   </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors">ADD</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {projects.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900">
                  <div><h4 className="font-bold text-white">{p.title}</h4><p className="text-xs text-neutral-500">{p.year} | {p.category}</p></div>
                  <button onClick={() => deleteProject(p.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === MEMBERS TAB === */}
        {activeTab === 'members' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900/50 p-6 border border-neutral-800 h-fit">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Member</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none">
                    <option value="Leadership">Leadership</option><option value="Member">Member</option><option value="Alumni">Alumni</option>
                  </select>
                  <input placeholder="Cohort (e.g. 13th)" value={newMember.cohort} onChange={e => setNewMember({...newMember, cohort: e.target.value})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none" />
                </div>
                <input placeholder="Philosophy (One liner)" value={newMember.philosophy} onChange={e => setNewMember({...newMember, philosophy: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none" />
                
                {/* Image Upload */}
                <div>
                   <label className="block text-xs text-neutral-500 mb-1">Profile Image</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewMember({...newMember, imageUrl: url}))} className="hidden" id="mem-img" />
                     <label htmlFor="mem-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors">
                       {newMember.imageUrl ? <img src={newMember.imageUrl} className="h-full w-full object-cover" alt="Preview"/> : <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Image</span></div>}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input 
                        placeholder="Or paste Image URL" 
                        value={newMember.imageUrl} 
                        onChange={e => setNewMember({...newMember, imageUrl: e.target.value})}
                        className="bg-transparent border-b border-neutral-800 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent"
                     />
                   </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors">ADD</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900">
                  <div className="flex items-center gap-4">
                     {m.imageUrl && <img src={m.imageUrl} alt="" className="w-10 h-10 object-cover rounded-full bg-neutral-800" />}
                     <div><h4 className="font-bold text-white">{m.name}</h4><p className="text-xs text-neutral-500">{m.role} | {m.cohort}</p></div>
                  </div>
                  <button onClick={() => deleteMember(m.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === ACTIVITIES TAB === */}
        {activeTab === 'activities' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900/50 p-6 border border-neutral-800 h-fit">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Activity</h3>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <input placeholder="Title" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Date (YYYY.MM)" value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none" />
                  <select value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value as any})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none">
                    <option value="Workshop">Workshop</option><option value="Exhibition">Exhibition</option><option value="MT">MT</option><option value="Study">Study</option><option value="Field Trip">Field Trip</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-20" />
                
                {/* Image Upload */}
                <div>
                   <label className="block text-xs text-neutral-500 mb-1">Activity Image</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewActivity({...newActivity, imageUrl: url}))} className="hidden" id="act-img" />
                     <label htmlFor="act-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors">
                       {newActivity.imageUrl ? <img src={newActivity.imageUrl} className="h-full w-full object-cover" alt="Preview"/> : <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Image</span></div>}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input 
                        placeholder="Or paste Image URL" 
                        value={newActivity.imageUrl} 
                        onChange={e => setNewActivity({...newActivity, imageUrl: e.target.value})}
                        className="bg-transparent border-b border-neutral-800 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent"
                     />
                   </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors">ADD</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {activities.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900">
                  <div><h4 className="font-bold text-white">{a.title}</h4><p className="text-xs text-neutral-500">{a.date} | {a.type}</p></div>
                  <button onClick={() => deleteActivity(a.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === ARCHIVE TAB === */}
        {activeTab === 'archive' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900/50 p-6 border border-neutral-800 h-fit">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Entry</h3>
              <form onSubmit={handleAddArchive} className="space-y-4">
                <input placeholder="Title" value={newArchive.title} onChange={e => setNewArchive({...newArchive, title: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newArchive.type} onChange={e => setNewArchive({...newArchive, type: e.target.value as any})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none">
                    <option value="Award">Award</option><option value="Publication">Publication</option><option value="Exhibition">Exhibition</option>
                  </select>
                  <input placeholder="Year" value={newArchive.year} onChange={e => setNewArchive({...newArchive, year: e.target.value})} className="bg-black border border-neutral-800 text-white px-3 py-2 outline-none" />
                </div>
                <textarea placeholder="Description" value={newArchive.description} onChange={e => setNewArchive({...newArchive, description: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-20" />
                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors">ADD</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {archive.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900">
                  <div><h4 className="font-bold text-white">{a.title}</h4><p className="text-xs text-neutral-500">{a.year} | {a.type}</p></div>
                  <button onClick={() => deleteArchive(a.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* === PROCESS TAB === */}
        {activeTab === 'process' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900/50 p-6 border border-neutral-800 h-fit">
               <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Process Step</h3>
               <form onSubmit={handleAddProcess} className="space-y-4">
                 <input placeholder="Step Number (e.g. 01)" value={newProcess.stepNumber} onChange={e => setNewProcess({...newProcess, stepNumber: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                 <input placeholder="Title" value={newProcess.title} onChange={e => setNewProcess({...newProcess, title: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none" required />
                 <textarea placeholder="Description" value={newProcess.description} onChange={e => setNewProcess({...newProcess, description: e.target.value})} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-24" required />
                 <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors">ADD</button>
               </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
               {process.map(p => (
                 <div key={p.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900">
                    <div>
                      <span className="text-xs text-jakdang-accent font-bold">STEP {p.stepNumber}</span>
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-neutral-500 truncate max-w-xs">{p.description}</p>
                    </div>
                    <button onClick={() => deleteProcess(p.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                 </div>
               ))}
            </div>
          </>
        )}

        {/* === SITE CONFIG TAB === */}
        {activeTab === 'config' && (
          <div className="lg:col-span-3 bg-neutral-900/50 p-6 border border-neutral-800">
             <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
               <Settings size={20} /> Site Content Configuration
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Main Hero Section */}
               <div className="space-y-6 md:col-span-2 border-b border-neutral-800 pb-8">
                 <h4 className="text-jakdang-accent font-bold text-sm flex items-center gap-2">
                   <ImageIcon size={16} /> Home Hero Main Photo
                 </h4>
                 
                 <div className="grid md:grid-cols-2 gap-8 items-start">
                   {/* Image Uploader */}
                   <div>
                     <label className="block text-xs text-neutral-500 mb-2">Background Image</label>
                     <div className="relative group">
                       <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" id="hero-img" />
                       <label htmlFor="hero-img" className="flex items-center justify-center w-full aspect-video border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors bg-black/50 overflow-hidden relative">
                         {config.homeHeroImageUrl ? (
                           <>
                             <img src={config.homeHeroImageUrl} className="h-full w-full object-cover opacity-80" alt="Preview"/>
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="flex items-center gap-2 text-sm font-bold"><Upload size={16}/> Change Image</span>
                             </div>
                           </>
                         ) : (
                           <div className="flex flex-col items-center gap-2"><Upload size={24}/> <span className="text-xs">Upload Hero Image</span></div>
                         )}
                       </label>
                     </div>
                     <div className="mt-2 flex items-center gap-2">
                       <Link size={12} className="text-neutral-500" />
                       <input 
                          name="homeHeroImageUrl"
                          placeholder="Or paste Image URL directly" 
                          value={config.homeHeroImageUrl} 
                          onChange={handleConfigUpdate}
                          className="bg-transparent border-b border-neutral-800 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent"
                       />
                     </div>
                   </div>

                   {/* Hero Text */}
                   <div className="space-y-4">
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Title</label>
                       <input name="homeHeroTitle" value={config.homeHeroTitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Subtitle</label>
                       <input name="homeHeroSubtitle" value={config.homeHeroSubtitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Description</label>
                       <textarea name="homeHeroDescription" value={config.homeHeroDescription} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-24" />
                     </div>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-jakdang-accent font-bold text-sm border-b border-neutral-700 pb-2">About Page Text</h4>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Definition Text</label>
                   <textarea name="aboutDefinition" value={config.aboutDefinition} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-24" />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Description Text</label>
                   <textarea name="aboutDescription" value={config.aboutDescription} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-24" />
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-jakdang-accent font-bold text-sm border-b border-neutral-700 pb-2">Contact Page Text</h4>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Recruitment Text</label>
                   <textarea name="contactRecruitText" value={config.contactRecruitText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-20" />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Collaboration Text</label>
                   <textarea name="contactCollabText" value={config.contactCollabText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-800 px-3 py-2 text-white outline-none h-20" />
                 </div>
               </div>

             </div>
          </div>
        )}

      </div>
    </div>
  );
};