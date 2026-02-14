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

  /* --- UTILS --- */

  // Improved Image Compression Logic
  // Firestore Document limit is 1MB. We target < 800KB safe zone.
  const compressImage = (file: File, maxWidth: number, quality: number, maxChars: number): Promise<string> => {
    return new Promise((resolve) => {
        if (file.size > 20 * 1024 * 1024) { // 20MB hard limit input
           alert("File is too massive (>20MB). Please use a smaller file.");
           resolve("");
           return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;
                
                // 1. Resize (Maintain Aspect Ratio)
                if (w > h) {
                    if (w > maxWidth) {
                        h = Math.round(h * (maxWidth / w));
                        w = maxWidth;
                    }
                } else {
                    if (h > maxWidth) {
                        w = Math.round(w * (maxWidth / h));
                        h = maxWidth;
                    }
                }
                
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, w, h);
                
                // 2. Compress
                let data = canvas.toDataURL('image/jpeg', quality);
                
                // 3. Check Size & Retry if needed
                if (data.length > maxChars) {
                    // Retry with 30% lower quality
                    const retryQuality = quality * 0.7;
                    data = canvas.toDataURL('image/jpeg', retryQuality);
                    
                    if (data.length > maxChars) {
                        // Retry with half dimensions
                        const canvas2 = document.createElement('canvas');
                        const w2 = Math.floor(w * 0.7);
                        const h2 = Math.floor(h * 0.7);
                        canvas2.width = w2;
                        canvas2.height = h2;
                        const ctx2 = canvas2.getContext('2d');
                        ctx2?.drawImage(canvas, 0, 0, w2, h2);
                        data = canvas2.toDataURL('image/jpeg', retryQuality);
                    }
                }

                // Final Check
                if (data.length > 1040000) { // Approx 1MB limit check
                    alert("Image is still too large for the database. Please use a smaller image.");
                    resolve("");
                } else {
                    resolve(data);
                }
            };
            img.onerror = () => {
                alert("Invalid image file.");
                resolve("");
            }
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const safeSave = async <T,>(saveFn: (data: T) => Promise<void>, data: T) => {
    setIsSaving(true);
    try {
      await saveFn(data);
    } catch (e: any) {
      console.error("Save failed:", e);
      let msg = "Failed to save data. Check Firebase Console.";
      
      // Detailed Error Handling
      if (e.code === 'invalid-argument' && e.message?.includes('size')) {
          msg = "Data Too Large: The image or content exceeds the database limit (1MB). Please try a smaller image.";
      } else if (e.name === 'QuotaExceededError') {
          msg = "Browser Storage Full: Clear cache or switch to Firebase mode.";
      }

      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  /* --- HANDLERS --- */

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        // For main images: Max 800px, 0.6 quality, target ~700KB (950k chars)
        const compressed = await compressImage(file, 800, 0.6, 950000);
        if (compressed) setter(compressed);
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
    setIsSaving(true);

    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
        // Grid images: Smaller (400px), Lower Quality (0.5), Target ~200KB (280k chars)
        const url = await compressImage(files[i], 400, 0.5, 280000);
        if (url) newImages.push(url);
    }

    if (newImages.length > 0) {
        const currentImages = config.homeGridImages || [];
        const newConfig = { ...config, homeGridImages: [...newImages, ...currentImages] };
        setConfig(newConfig);
        try {
            await DataService.saveSiteConfig(newConfig);
        } catch (e: any) {
            alert("Failed to save. Total grid images might be too large. Try adding fewer at a time.");
            console.error(e);
        }
    }
    setIsSaving(false);
    e.target.value = '';
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
           <RefreshCw size={16} className="animate-spin" /> Saving...
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
                   <label className="block text-xs text-neutral-500 mb-1">Cover Image (Auto-compressed)</label>
                   <div className="relative">
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNewProject({...newProject, imageUrl: url}))} className="hidden" id="proj-img" />
                     <label htmlFor="proj-img" className="flex items-center justify-center w-full h-24 border border-dashed border-neutral-700 hover:border-white cursor-pointer transition-colors">
                        {newProject.imageUrl ? (
                          <img src={newProject.imageUrl} className="h-full object-contain" alt="Preview"/>
                        ) : (
                          <div className="text-neutral-500 flex flex-col items-center gap-1">
                            <Upload size={20} />
                            <span className="text-xs">Upload Image</span>
                          </div>
                        )}
                     </label>
                   </div>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-3 hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs">
                  {editingProjectId ? 'Update Project' : 'Add Project'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {projects.length === 0 && <p className="text-neutral-500 italic">No projects added yet.</p>}
              {projects.map(p => (
                <div key={p.id} className={`flex gap-4 p-4 bg-neutral-900/50 border ${editingProjectId === p.id ? 'border-jakdang-accent' : 'border-neutral-800'}`}>
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="w-20 h-20 object-cover bg-neutral-800" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProject(p)} className="p-1 hover:text-jakdang-accent transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteProject(p.id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mt-1">{p.category} | {p.year} | {p.author}</p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <>
             <div className="lg:col-span-1 bg-neutral-900 p-6 border border-neutral-800 h-fit sticky top-4">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Member</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <input placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" required />
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="w-full bg-black border border-neutral-700 text-white px-3 py-2 outline-none">
                  <option value="OB">OB (Alumni)</option>
                  <option value="YB">YB (Active)</option>
                </select>
                <button type="submit" className="w-full bg-white text-black font-bold py-3 hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs">
                  Add Member
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-6">
               <div className="flex justify-between items-center bg-neutral-900 p-4 border border-neutral-800">
                  <span className="text-sm text-neutral-400">Drag/Move logic is simplified to Up/Down buttons for mobile compatibility.</span>
               </div>
               
               {displayMembers.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-4 p-4 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex flex-col gap-1 text-neutral-500">
                    <button onClick={() => moveMember(idx, -1)} disabled={idx === 0} className="hover:text-white disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button onClick={() => moveMember(idx, 1)} disabled={idx === members.length - 1} className="hover:text-white disabled:opacity-30"><ArrowDown size={16} /></button>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{m.name}</h4>
                    <p className="text-xs text-neutral-500 font-mono">{m.role}</p>
                  </div>
                  <button onClick={() => deleteMember(m.id)} className="text-neutral-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Awards Tab */}
        {activeTab === 'award' && (
          <>
            <div className="lg:col-span-1 bg-neutral-900 p-6 border border-neutral-800 h-fit sticky top-4">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2"><Plus size={16}/> New Record</h3>
              <form onSubmit={handleAddAward} className="space-y-4">
                <input placeholder="Title" value={newAward.title} onChange={e => setNewAward({...newAward, title: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none" required />
                <div className="grid grid-cols-2 gap-2">
                   <select value={newAward.type} onChange={e => setNewAward({...newAward, type: e.target.value as any})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none">
                    <option value="Award">Award</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Publication">Publication</option>
                  </select>
                  <input placeholder="Year" value={newAward.year} onChange={e => setNewAward({...newAward, year: e.target.value})} className="bg-black border border-neutral-700 text-white px-3 py-2 outline-none" required/>
                </div>
                <textarea placeholder="Description (Prize name, details...)" value={newAward.description} onChange={e => setNewAward({...newAward, description: e.target.value})} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white outline-none h-24" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs">
                  Add Record
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
               <div className="overflow-hidden border border-neutral-800 rounded">
                <table className="w-full text-left text-sm text-neutral-400">
                  <thead className="bg-neutral-900 text-xs uppercase font-mono text-neutral-500">
                    <tr>
                      <th className="p-3">Year</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Desc</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {awards.map(a => (
                      <tr key={a.id} className="hover:bg-neutral-900/50">
                        <td className="p-3 font-mono">{a.year}</td>
                        <td className="p-3 text-white font-bold">{a.title}</td>
                        <td className="p-3">{a.description}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => deleteAward(a.id)} className="hover:text-red-500"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Config Tab */}
        {activeTab === 'config' && (
           <div className="lg:col-span-3 space-y-8 pb-12">
             
             {/* Section 1: Hero */}
             <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-2">Home: Hero Section</h3>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Main Title</label>
                        <input name="homeHeroTitle" value={config.homeHeroTitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Subtitle</label>
                        <input name="homeHeroSubtitle" value={config.homeHeroSubtitle} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Description</label>
                        <textarea name="homeHeroDescription" value={config.homeHeroDescription} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white h-24" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                         <label className="text-xs text-neutral-500 uppercase block mb-1">Hero Image (Fallback)</label>
                         <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200"/>
                         {config.homeHeroImageUrl && <img src={config.homeHeroImageUrl} className="mt-2 h-32 object-cover border border-neutral-700" alt="Hero" />}
                      </div>
                      <div>
                         <label className="text-xs text-neutral-500 uppercase block mb-1">Grid Background Images</label>
                         <p className="text-[10px] text-neutral-500 mb-2">Upload multiple images for the animated grid. They will be auto-compressed.</p>
                         <input type="file" accept="image/*" multiple onChange={handleAddGridImage} className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"/>
                         
                         <div className="grid grid-cols-6 gap-2 mt-4 max-h-40 overflow-y-auto p-2 bg-black border border-neutral-800">
                            {config.homeGridImages?.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img src={img} className="w-full h-full object-cover" alt="" />
                                <button onClick={() => removeGridImage(idx)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 2: Manifesto & About */}
             <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-2">Home: Manifesto</h3>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Manifesto Title</label>
                        <input name="homeManifestoTitle" value={config.homeManifestoTitle || ''} onChange={handleConfigUpdate} placeholder="e.g. Conspire" className="w-full bg-black border border-neutral-700 px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Definition Text</label>
                        <textarea name="aboutDefinition" value={config.aboutDefinition} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white h-32" />
                      </div>
                   </div>
                   <div>
                       <label className="text-xs text-neutral-500 uppercase block mb-1">Manifesto Image (Sketch)</label>
                       <input type="file" accept="image/*" onChange={handleConfigImageUpload('homeManifestoImageUrl')} className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200"/>
                       {config.homeManifestoImageUrl && <img src={config.homeManifestoImageUrl} className="mt-2 h-48 object-contain bg-black border border-neutral-700" alt="Manifesto" />}
                   </div>
                </div>
             </div>

             {/* Section 3: Contact Info */}
             <div className="bg-neutral-900 border border-neutral-800 p-6">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-2">Contact Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Recruit Text</label>
                        <textarea name="contactRecruitText" value={config.contactRecruitText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white h-20" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Collab Text</label>
                        <textarea name="contactCollabText" value={config.contactCollabText} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white h-20" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs text-neutral-500 uppercase block mb-1">Studio Address</label>
                        <textarea name="contactAddress" value={config.contactAddress || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white h-20" placeholder="123 Street..."/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-neutral-500 uppercase block mb-1">Email</label>
                          <input name="contactEmail" value={config.contactEmail || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white" />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500 uppercase block mb-1">Instagram</label>
                          <input name="contactInstagram" value={config.contactInstagram || ''} onChange={handleConfigUpdate} className="w-full bg-black border border-neutral-700 px-3 py-2 text-white" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
           <div className="lg:col-span-3">
             <div className="max-w-xl mx-auto space-y-8">
                <div className="bg-neutral-900 p-8 border border-neutral-800">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database size={20} className="text-jakdang-accent" /> 
                    Database Connection
                  </h3>
                  <div className="space-y-4 text-sm text-neutral-400">
                     <p>
                       To enable dynamic updates for all users, you must connect this site to a Firebase Firestore database.
                     </p>
                     <ol className="list-decimal list-inside space-y-2 ml-2">
                       <li>Create a project at <a href="https://console.firebase.google.com" target="_blank" className="text-white underline">firebase.console.com</a></li>
                       <li>Enable <strong>Firestore Database</strong> (Start in Test Mode).</li>
                       <li>Copy the configuration object from Project Settings.</li>
                       <li>Paste the config into <code>services/store.ts</code> in your source code.</li>
                       <li>Redeploy the site.</li>
                     </ol>
                  </div>
                  
                  {DataService.isConfigured && (
                    <div className="mt-8 pt-8 border-t border-neutral-800">
                      <h4 className="text-white font-bold mb-2">Data Migration</h4>
                      <p className="text-xs text-neutral-500 mb-4">
                        Upload your current Local Storage data (projects, members, config) to the Cloud Database. 
                        <br/><strong>Warning:</strong> This will overwrite existing cloud data with local data.
                      </p>
                      <button 
                        onClick={handleMigrateToCloud}
                        className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200"
                      >
                        Push Local Data to Cloud
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-900 p-8 border border-neutral-800">
                   <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileJson size={20} className="text-neutral-500" /> 
                    Raw Data Export
                  </h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Download a JSON backup of your current content.
                  </p>
                  <button 
                    onClick={() => {
                       const backup = { projects, members, awards, config };
                       const blob = new Blob([JSON.stringify(backup, null, 2)], {type : 'application/json'});
                       const url = URL.createObjectURL(blob);
                       const a = document.createElement('a');
                       a.href = url;
                       a.download = `jakdang_backup_${new Date().toISOString().split('T')[0]}.json`;
                       a.click();
                    }}
                    className="border border-white text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Download Backup JSON
                  </button>
                </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};