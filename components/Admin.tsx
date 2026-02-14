import React, { useState, useRef } from 'react';
import { Project, Member, AwardItem, SiteConfig } from '../types';
import { Trash2, Plus, Lock, LogOut, Layout, Users, Archive, FileText, Settings, Upload, Image as ImageIcon, Link, Download, Save, AlertTriangle, Code, Globe, FileJson, RefreshCw, Database, CloudLightning, Grid, X, ArrowUp, ArrowDown, ChevronRight, Edit2, RotateCcw } from 'lucide-react';
import { DataService } from '../services/store';

interface AdminProps {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  members: Member[];
  setMembers: (m: Member[]) => void;
  awards: AwardItem[];
  setAwards: (a: AwardItem[]) => void;
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;
  onLogout: () => void;
}

type TabType = 'projects' | 'members' | 'award' | 'config' | 'system';

export const Admin: React.FC<AdminProps> = ({ 
  projects, setProjects, 
  members, setMembers, 
  awards, setAwards, 
  config, setConfig,
  onLogout 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('config'); 
  const [isSaving, setIsSaving] = useState(false);
  
  // Forms State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: 'Academic', year: '2024', author: '', description: '', imageUrl: '', tags: []
  });
  
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '', role: 'YB', philosophy: '', imageUrl: '', order: 0
  });
  
  const [newAward, setNewAward] = useState<Partial<AwardItem>>({
    title: '', type: 'Award', year: '2024', description: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5758') setIsAuthenticated(true);
    else {
        setPassword('');
        alert('Access Denied');
    }
  };

  /* --- HANDLERS --- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File is too large (>20MB). Please pick a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reduced Max Width/Quality to prevent Storage Quota issues
          const MAX_WIDTH = 1920; 
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Quality reduced to 0.8
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setter(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const safeSave = async <T,>(saveFn: (data: T) => Promise<void>, data: T) => {
    setIsSaving(true);
    try {
      await saveFn(data);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        alert("Storage Quota Exceeded! Image too large. Use an external URL.");
      } else {
        console.error(e);
        alert("Failed to save data. " + (DataService.isConfigured ? "Check Firebase Console." : ""));
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const createDeleteHandler = <T extends { id: string }>(
    data: T[], 
    setter: (d: T[]) => void, 
    persister: (d: T[]) => Promise<void>
  ) => (id: string) => {
    if (confirm('Permanently delete record?')) {
      const updated = data.filter(item => item.id !== id);
      setter(updated);
      safeSave(persister, updated);
      
      if (activeTab === 'projects' && editingProjectId === id) {
        resetProjectForm();
      }
    }
  };

  const deleteProject = createDeleteHandler(projects, setProjects, DataService.saveProjects);
  const deleteMember = createDeleteHandler(members, setMembers, DataService.saveMembers);
  const deleteAward = createDeleteHandler(awards, setAwards, DataService.saveAwards);

  /* --- PROJECT SPECIFIC HANDLERS --- */
  
  const resetProjectForm = () => {
    setNewProject({ title: '', category: 'Academic', year: '2024', author: '', description: '', imageUrl: '', tags: [] });
    setEditingProjectId(null);
  };

  const handleEditProject = (project: Project) => {
    setNewProject({ ...project });
    setEditingProjectId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedProjects: Project[];
    
    if (editingProjectId) {
      updatedProjects = projects.map(p => 
        p.id === editingProjectId ? { ...newProject, id: editingProjectId } as Project : p
      );
    } else {
      const item: Project = { ...newProject as Project, id: DataService.generateId() };
      updatedProjects = [item, ...projects];
    }

    setProjects(updatedProjects);
    safeSave(DataService.saveProjects, updatedProjects);
    resetProjectForm();
  };

  /* --- OTHER HANDLERS --- */

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.order || 0)) : 0;
    const item: Member = { ...newMember as Member, id: DataService.generateId(), order: maxOrder + 1 };
    const updated = [item, ...members];
    setMembers(updated);
    safeSave(DataService.saveMembers, updated);
    setNewMember({ name: '', role: 'YB', philosophy: '', imageUrl: '', order: 0 });
  };

  const moveMember = (index: number, direction: -1 | 1) => {
    const sortedMembers = [...members].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (index + direction < 0 || index + direction >= sortedMembers.length) return;
    
    const temp = sortedMembers[index];
    sortedMembers[index] = sortedMembers[index + direction];
    sortedMembers[index + direction] = temp;
    
    const reorderedMembers = sortedMembers.map((m, i) => ({ ...m, order: i }));
    setMembers(reorderedMembers);
    safeSave(DataService.saveMembers, reorderedMembers);
  };

  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AwardItem = { ...newAward as AwardItem, id: DataService.generateId() };
    const updated = [item, ...awards];
    setAwards(updated);
    safeSave(DataService.saveAwards, updated);
    setNewAward({ title: '', type: 'Award', year: '2024', description: '' });
  };
  
  const handleConfigUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newConfig = { ...config, [e.target.name]: e.target.value };
    setConfig(newConfig);
    safeSave(DataService.saveSiteConfig, newConfig);
  };
  
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => {
      const newConfig = { ...config, homeHeroImageUrl: url };
      setConfig(newConfig);
      safeSave(DataService.saveSiteConfig, newConfig);
    });
  };

  const handleConfigImageUpload = (propertyName: keyof SiteConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => {
      const newConfig = { ...config, [propertyName]: url };
      setConfig(newConfig);
      safeSave(DataService.saveSiteConfig, newConfig);
    });
  };

  const handleAddGridImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Set saving state to show feedback during processing
    setIsSaving(true);

    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        if (file.size > 20 * 1024 * 1024) {
          console.warn(`File ${file.name} too large.`);
          resolve('');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 1920; 
            if (width > MAX_WIDTH) {
              height = (MAX_WIDTH / width) * height;
              width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compressing to 0.8 quality jpeg
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          };
          img.onerror = () => resolve('');
          img.src = event.target?.result as string;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    };

    try {
      const promises = Array.from(files).map(processFile);
      const results = await Promise.all(promises);
      const validResults = results.filter(url => url.length > 0);

      if (validResults.length > 0) {
        const currentImages = config.homeGridImages || [];
        const newConfig = { ...config, homeGridImages: [...validResults, ...currentImages] };
        setConfig(newConfig);
        
        // Save to DB
        try {
           await DataService.saveSiteConfig(newConfig);
        } catch (e: any) {
           if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
             alert("Storage Quota Exceeded! Images might not persist locally.");
           } else {
             console.error(e);
             alert("Failed to save data to database.");
           }
        }
      }
    } catch (error) {
       console.error("Error processing images:", error);
       alert("Error processing images.");
    } finally {
       setIsSaving(false);
       e.target.value = '';
    }
  };

  const removeGridImage = (index: number) => {
    const currentImages = config.homeGridImages || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    const newConfig = { ...config, homeGridImages: newImages };
    setConfig(newConfig);
    safeSave(DataService.saveSiteConfig, newConfig);
  };

  const handleMigrateToCloud = async () => {
    if (!DataService.isConfigured) {
      alert("Database is not configured yet. Please update services/store.ts first.");
      return;
    }
    
    if (confirm("This will overwrite Cloud Data with current Local Data. Continue?")) {
      try {
        await DataService.migrateToCloud();
        alert("✅ Migration Successful! All local data is now in Firebase.");
      } catch (e) {
        alert("Migration failed. Check console.");
        console.error(e);
      }
    }
  };

  /* --- RENDERERS --- */

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white selection:bg-white selection:text-black">
        <div className="w-full max-w-sm px-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-12">
            <div className="text-center space-y-2">
               <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">System Access</h2>
            </div>
            
            <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-800 py-4 text-center text-xl tracking-[0.5em] text-white outline-none focus:border-white transition-colors placeholder:text-neutral-800 placeholder:tracking-normal placeholder:text-sm font-mono"
                  placeholder="PASSCODE"
                  autoFocus
                />
            </div>

            <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="text-neutral-600 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">Enter</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const displayMembers = [...members].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8 relative bg-black min-h-screen p-4 md:p-0">
      {isSaving && (
        <div className="fixed top-4 right-4 z-[100] bg-jakdang-accent text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-pulse">
           <RefreshCw size={16} className="animate-spin" /> Saving to Server...
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center border-b border-neutral-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Generator</h1>
          <div className="flex items-center gap-2">
             <p className="font-mono text-neutral-500 text-sm">System Status:</p>
             {DataService.isConfigured ? (
               <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center gap-1"><CloudLightning size={12}/> Dynamic Mode (Firebase)</span>
             ) : (
               <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded flex items-center gap-1"><Database size={12}/> Static Mode (Local Only)</span>
             )}
          </div>
        </div>
        <button onClick={() => { setIsAuthenticated(false); onLogout(); }} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white">
          <LogOut size={16} /> EXIT
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-neutral-800">
        {[
          { id: 'config', icon: Settings, label: 'Site Content' },
          { id: 'projects', icon: Layout, label: 'Projects' },
          { id: 'members', icon: Users, label: 'Members' },
          { id: 'award', icon: Archive, label: 'Awards' },
          { id: 'system', icon: Database, label: 'Database' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-jakdang-accent border-b-2 border-jakdang-accent bg-neutral-900' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {!DataService.isConfigured && activeTab !== 'system' && (
        <div className="bg-yellow-900/10 border-l-4 border-yellow-700 p-4 flex justify-between items-center shadow-sm">
          <div className="text-sm text-yellow-500">
            <strong className="block mb-1">⚠️ Running in Static Mode</strong>
            Changes are only visible on this device. To enable global updates, connect a database.
          </div>
          <button onClick={() => setActiveTab('system')} className="text-xs bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-400 px-3 py-2 transition-colors uppercase font-bold border border-yellow-800">
            Setup Database
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900 p-6 border border-neutral-800 h-fit shadow-sm sticky top-4">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    {editingProjectId ? <><Edit2 size={16} className="text-jakdang-accent"/> Edit Project</> : <><Plus size={16}/> New Project</>}
                  </h3>
                  {editingProjectId && (
                    <button 
                      onClick={resetProjectForm} 
                      className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 border border-neutral-800 px-2 py-1"
                    >
                      <RotateCcw size={12}/> Cancel
                    </button>
                  )}
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as any})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none">
                    <option value="Academic">Academic</option>
                    <option value="Competition">Competition</option>
                    <option value="Team">Team</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                  </select>
                  <input placeholder="Year" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none" />
                </div>
                <input placeholder="Author" value={newProject.author} onChange={e => setNewProject({...newProject, author: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" required />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-24" required />
                <div>
                   <label className="block text-xs text-neutral-500 mb-1">Cover Image</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewProject({...newProject, imageUrl: url}))} className="hidden" id="proj-img" />
                     <label htmlFor="proj-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors bg-black">
                       {newProject.imageUrl ? <img src={newProject.imageUrl} className="h-full w-full object-cover" alt="Preview"/> : <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Image (High Quality)</span></div>}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input placeholder="Or paste Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} className="bg-transparent border-b border-neutral-700 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent" />
                   </div>
                </div>
                <button type="submit" className={`w-full font-bold py-2 transition-colors shadow-lg ${editingProjectId ? 'bg-jakdang-accent text-white' : 'bg-white text-black hover:bg-jakdang-accent hover:text-white'}`}>
                  {editingProjectId ? 'UPDATE PROJECT' : 'ADD TO DATABASE'}
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4">Existing Projects ({projects.length})</h4>
              {projects.map(p => (
                <div key={p.id} className={`flex justify-between items-center p-4 border transition-all ${editingProjectId === p.id ? 'border-jakdang-accent bg-neutral-900/80' : 'border-neutral-800 bg-neutral-900 hover:shadow-md'}`}>
                  <div className="flex items-center gap-4">
                    {p.imageUrl && <img src={p.imageUrl} alt="" className="w-12 h-12 object-cover bg-neutral-800"/>}
                    <div>
                        <h4 className={`font-bold ${editingProjectId === p.id ? 'text-jakdang-accent' : 'text-white'}`}>{p.title}</h4>
                        <p className="text-xs text-neutral-500">{p.year} | {p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditProject(p)} 
                      className="text-neutral-600 hover:text-white p-2 border border-transparent hover:border-neutral-800 transition-colors"
                      title="Edit"
                    >
                        <Edit2 size={18}/>
                    </button>
                    <button 
                      onClick={() => deleteProject(p.id)} 
                      className="text-neutral-600 hover:text-red-500 p-2 border border-transparent hover:border-neutral-800 transition-colors"
                      title="Delete"
                    >
                        <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Members Tab */}
        {activeTab === 'members' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900 p-6 border border-neutral-800 h-fit shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Member</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-1 gap-2">
                  <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none">
                    <option value="YB">YB (Active)</option><option value="OB">OB (Alumni)</option>
                  </select>
                </div>
                <input placeholder="Philosophy (One liner) - Optional" value={newMember.philosophy} onChange={e => setNewMember({...newMember, philosophy: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" />
                <div>
                   <label className="block text-xs text-neutral-500 mb-1">Profile Image</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewMember({...newMember, imageUrl: url}))} className="hidden" id="mem-img" />
                     <label htmlFor="mem-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors bg-black">
                       {newMember.imageUrl ? <img src={newMember.imageUrl} className="h-full w-full object-cover" alt="Preview"/> : <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Image (High Quality)</span></div>}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input placeholder="Or paste Image URL" value={newMember.imageUrl} onChange={e => setNewMember({...newMember, imageUrl: e.target.value})} className="bg-transparent border-b border-neutral-700 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent" />
                   </div>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors shadow-lg">ADD TO DATABASE</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <div className="bg-neutral-800/30 p-2 mb-2 text-xs text-neutral-500 text-center">Use arrows to reorder members</div>
              {displayMembers.map((m, index) => (
                <div key={m.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col gap-1 mr-2">
                       <button 
                         onClick={() => moveMember(index, -1)} 
                         disabled={index === 0}
                         className="p-1 hover:bg-neutral-800 text-neutral-500 disabled:opacity-20 transition-colors"
                       >
                         <ArrowUp size={14} />
                       </button>
                       <button 
                         onClick={() => moveMember(index, 1)}
                         disabled={index === displayMembers.length - 1} 
                         className="p-1 hover:bg-neutral-800 text-neutral-500 disabled:opacity-20 transition-colors"
                       >
                         <ArrowDown size={14} />
                       </button>
                     </div>

                     {m.imageUrl && <img src={m.imageUrl} alt="" className="w-10 h-10 object-cover rounded-full bg-neutral-800" />}
                     <div><h4 className="font-bold text-white">{m.name}</h4><p className="text-xs text-neutral-500">{m.role}</p></div>
                  </div>
                  <button onClick={() => deleteMember(m.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Awards Tab */}
        {activeTab === 'award' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900 p-6 border border-neutral-800 h-fit shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Award</h3>
              <form onSubmit={handleAddAward} className="space-y-4">
                <input placeholder="Title" value={newAward.title} onChange={e => setNewAward({...newAward, title: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none focus:border-jakdang-accent" required />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newAward.type} onChange={e => setNewAward({...newAward, type: e.target.value as any})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none">
                    <option value="Award">Award</option><option value="Publication">Publication</option><option value="Exhibition">Exhibition</option>
                  </select>
                  <input placeholder="Year" value={newAward.year} onChange={e => setNewAward({...newAward, year: e.target.value})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none" />
                </div>
                <textarea placeholder="Description" value={newAward.description} onChange={e => setNewAward({...newAward, description: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-20" />
                <button type="submit" className="w-full bg-white text-black font-bold py-2 hover:bg-jakdang-accent hover:text-white transition-colors shadow-lg">ADD TO DATABASE</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              {awards.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900 hover:shadow-md transition-shadow">
                  <div><h4 className="font-bold text-white">{a.title}</h4><p className="text-xs text-neutral-500">{a.year} | {a.type}</p></div>
                  <button onClick={() => deleteAward(a.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* === SITE CONFIG TAB === */}
        {activeTab === 'config' && (
          <div className="lg:col-span-3 bg-neutral-900 p-6 border border-neutral-800 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings size={20} /> Site Content Configuration
                </h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* 1. HOME GRID GALLERY MANAGER */}
               <div className="space-y-6 md:col-span-2 border-b border-neutral-800 pb-8">
                 <h4 className="text-jakdang-accent font-bold text-sm flex items-center gap-2">
                   <Grid size={16} /> Home Grid Gallery (Dense Photo Wall)
                 </h4>
                 <div className="bg-black/50 p-4 border border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-4">
                      These images will be displayed in a dense grid pattern on the Home page background. 
                      Add multiple images to create a rich wall of work.
                    </p>
                    
                    {/* Image List */}
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
                      {config.homeGridImages && config.homeGridImages.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                           <img src={img} className="w-full h-full object-cover border border-neutral-800" />
                           <button 
                             onClick={() => removeGridImage(idx)}
                             className="absolute inset-0 bg-red-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Trash2 size={16} className="text-white" />
                           </button>
                        </div>
                      ))}
                      {/* Add Button */}
                      <div className="aspect-square relative">
                        <input type="file" accept="image/*" multiple onChange={handleAddGridImage} className="hidden" id="grid-add" />
                        <label htmlFor="grid-add" className="flex flex-col items-center justify-center w-full h-full border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors bg-black">
                          <Plus size={20} />
                          <span className="text-[10px] mt-1">Add (Multi)</span>
                        </label>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Main Hero Section Text */}
               <div className="space-y-6 md:col-span-2 border-b border-neutral-800 pb-8">
                 <h4 className="text-jakdang-accent font-bold text-sm flex items-center gap-2">
                   <FileText size={16} /> Home Hero Text
                 </h4>
                 
                 <div className="grid md:grid-cols-2 gap-8 items-start">
                   {/* Hero Text */}
                   <div className="space-y-4 w-full">
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Title</label>
                       <input name="homeHeroTitle" value={config.homeHeroTitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Subtitle</label>
                       <input name="homeHeroSubtitle" value={config.homeHeroSubtitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs text-neutral-500 mb-1">Hero Description</label>
                       <textarea name="homeHeroDescription" value={config.homeHeroDescription} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-24" />
                     </div>
                   </div>
                 </div>
               </div>

               {/* Process Section Images REMOVED */}

               {/* Text Configs */}
               <div className="space-y-4">
                 <h4 className="text-jakdang-accent font-bold text-sm border-b border-neutral-800 pb-2">About Page Text</h4>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Manifesto Title (e.g. Conspire)</label>
                   <input name="homeManifestoTitle" value={config.homeManifestoTitle || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" />
                 </div>
                 {/* NEW: Manifesto Image Uploader */}
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Manifesto Image (Sketch)</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={handleConfigImageUpload('homeManifestoImageUrl')} className="hidden" id="manifesto-img" />
                     <label htmlFor="manifesto-img" className="flex items-center justify-center w-full h-32 border border-dashed border-neutral-700 hover:border-jakdang-accent cursor-pointer text-neutral-500 hover:text-white transition-colors bg-black overflow-hidden relative">
                       {config.homeManifestoImageUrl ? (
                         <>
                           <img src={config.homeManifestoImageUrl} className="h-full w-full object-contain opacity-80" alt="Preview"/>
                           <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                             <Upload size={16} className="text-white"/>
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center"><Upload size={20}/> <span className="text-xs mt-1">Upload Sketch</span></div>
                       )}
                     </label>
                   </div>
                   <div className="mt-2 flex items-center gap-2">
                     <Link size={12} className="text-neutral-500" />
                     <input placeholder="Or paste Image URL" name="homeManifestoImageUrl" value={config.homeManifestoImageUrl || ''} onChange={handleConfigUpdate} className="bg-transparent border-b border-neutral-700 text-xs w-full py-1 text-white outline-none focus:border-jakdang-accent" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Definition Text</label>
                   <textarea name="aboutDefinition" value={config.aboutDefinition} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-24" />
                 </div>
                 {/* Description Text REMOVED */}
               </div>

               <div className="space-y-4">
                 <h4 className="text-jakdang-accent font-bold text-sm border-b border-neutral-800 pb-2">Contact Page Text</h4>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Recruitment Text</label>
                   <textarea name="contactRecruitText" value={config.contactRecruitText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-20" />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Collaboration Text</label>
                   <textarea name="contactCollabText" value={config.contactCollabText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-20" />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Studio Address (Use Enter for line breaks)</label>
                   <textarea name="contactAddress" value={config.contactAddress || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-20" placeholder="e.g. 123 Street..." />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Instagram</label>
                   <input name="contactInstagram" value={config.contactInstagram || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" placeholder="e.g. instagram.com/..." />
                 </div>
                 <div>
                   <label className="block text-xs text-neutral-500 mb-1">Email</label>
                   <input name="contactEmail" value={config.contactEmail || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" placeholder="e.g. hello@..." />
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* === DATABASE TAB (Existing) === */}
        {activeTab === 'system' && (
          <div className="lg:col-span-3 bg-neutral-900/50 p-8 border border-neutral-800">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800">
               <Database size={24} className="text-jakdang-accent" />
               <h3 className="text-2xl font-bold text-white">Database Connection</h3>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
               {/* Instructions */}
               <div className="space-y-6 text-sm text-neutral-400">
                 <p className="leading-relaxed">
                   To make this website <strong>dynamic</strong> (so changes are visible to everyone), you need to connect it to <strong>Google Firebase</strong>.
                 </p>
                 
                 <div className="bg-neutral-800/50 p-4 border-l-2 border-jakdang-accent space-y-2">
                   <strong className="text-white block">Setup Instructions:</strong>
                   <ol className="list-decimal pl-4 space-y-2">
                     <li>Go to <a href="https://console.firebase.google.com" target="_blank" className="text-jakdang-accent underline">Firebase Console</a> and create a project.</li>
                     <li>Register a Web App (<code>&lt;/&gt;</code> icon) to get your <code>firebaseConfig</code>.</li>
                     <li>Create a <strong>Firestore Database</strong> in the "Build" menu.</li>
                     <li>Set Security Rules to <strong>Test Mode</strong> (or allow read/write).</li>
                     <li>Open your project file <code>services/store.ts</code>.</li>
                     <li>Paste the config keys into the <code>firebaseConfig</code> object.</li>
                   </ol>
                 </div>
               </div>

               {/* Migration Actions */}
               <div className="space-y-6">
                 <div className="bg-black/50 p-6 border border-neutral-800">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <CloudLightning size={18} className={DataService.isConfigured ? "text-green-500" : "text-neutral-600"} />
                      Connection Status
                    </h4>
                    {DataService.isConfigured ? (
                      <div className="text-green-400 text-sm mb-6">
                        ✅ Connected to Firebase. All changes are synced globally.
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm mb-6">
                        ❌ Not Configured. Running in Local Mode.
                      </div>
                    )}
                    
                    <h4 className="text-white font-bold mb-4">Data Migration</h4>
                    <p className="text-xs text-neutral-500 mb-4">
                       If you have data in Local Storage that you want to push to the Cloud Database, click below.
                       (Only works if Firebase is connected).
                    </p>
                    <button 
                      onClick={handleMigrateToCloud}
                      disabled={!DataService.isConfigured}
                      className="w-full bg-white text-black py-3 font-bold hover:bg-jakdang-accent hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                      Migrate Local Data to Cloud
                    </button>
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};