import React, { useState } from 'react';
import { Member, ArchiveItem, ActivityLog, SiteConfig, PageView } from '../types';
import { FileText, MapPin, Mail, Instagram, ExternalLink, Calendar, BookOpen, Users, Send } from 'lucide-react';

/* --- ABOUT PAGE --- */
export const About: React.FC<{ config: SiteConfig }> = ({ config }) => (
  <div className="max-w-4xl mx-auto space-y-16">
    <div className="border-b border-white/20 pb-8 text-center">
      <div className="inline-block border border-jakdang-accent text-jakdang-accent px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6">
        Manifesto
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">About 작당모의</h1>
      <p className="text-lg font-mono text-jakdang-muted">Est. 2021 / Busan / Architectural Design Studio</p>
    </div>

    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white border-l-2 border-jakdang-accent pl-4">Definition</h3>
        <p className="leading-relaxed text-neutral-300">
          {config.aboutDefinition}
        </p>
        <p className="leading-relaxed text-neutral-300">
          {config.aboutDescription}
        </p>
      </div>
      <div className="bg-neutral-900 p-8 text-sm text-neutral-400 border border-neutral-800">
        <div className="border-b border-neutral-700 pb-2 mb-4 text-jakdang-accent font-bold uppercase text-xs tracking-wider">Operating Principles</div>
        <ul className="space-y-4 list-disc pl-4 marker:text-neutral-600">
          <li>All members must participate in at least one open critique per semester.</li>
          <li>Process documentation is mandatory, not optional.</li>
          <li>We share resources, knowledge, and caffeine.</li>
          <li>Design is never finished, only abandoned (at deadline).</li>
        </ul>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">History Timeline</h3>
      <div className="border-l border-neutral-800 pl-8 space-y-8 relative">
        {[
          { year: '2024', event: 'Expanded studio space to Gangnam' },
          { year: '2023', event: 'UAUS Exhibition Best Pavilion Award' },
          { year: '2019', event: 'Rebranded from "ArchStudy" to "JAKDANG"' },
          { year: '2012', event: 'Founded by 3 architecture students' }
        ].map((item, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-800"></span>
            <span className="font-mono text-jakdang-accent font-bold text-lg mr-4">{item.year}</span>
            <span className="text-neutral-300">{item.event}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* --- MEMBERS PAGE --- */

const MemberCard: React.FC<{ m: Member, gray?: boolean }> = ({ m, gray = false }) => (
  <div className="group relative">
    <div className={`aspect-square overflow-hidden mb-4 ${gray ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'} transition-all duration-500 bg-neutral-900`}>
      {m.imageUrl ? (
        <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">No Image</div>
      )}
    </div>
    <h4 className="text-lg font-bold text-white">{m.name}</h4>
    <p className="text-xs text-jakdang-accent font-mono uppercase mb-2">{m.cohort} | {m.role}</p>
    <p className="text-sm text-neutral-400 italic">"{m.philosophy}"</p>
  </div>
);

export const Members: React.FC<{ members: Member[] }> = ({ members }) => {
  const leadership = members.filter(m => m.role === 'Leadership');
  const regular = members.filter(m => m.role === 'Member');
  const alumni = members.filter(m => m.role === 'Alumni');

  return (
    <div className="space-y-20">
      <section>
        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">Leadership</h2>
        {leadership.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {leadership.map(m => <MemberCard key={m.id} m={m} />)}
          </div>
        ) : (
          <p className="text-neutral-500 font-mono italic">No leadership members listed.</p>
        )}
      </section>
      
      <section>
        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">Current Conspirators</h2>
        {regular.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {regular.map(m => <MemberCard key={m.id} m={m} />)}
          </div>
        ) : (
           <p className="text-neutral-500 font-mono italic">No members listed.</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">Alumni Network</h2>
        <p className="text-jakdang-muted mb-8">Our graduates are infiltrating top firms across the globe.</p>
        {alumni.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {alumni.map(m => <MemberCard key={m.id} m={m} gray />)}
          </div>
        ) : (
           <p className="text-neutral-500 font-mono italic">No alumni listed.</p>
        )}
      </section>
    </div>
  );
};

/* --- ARCHIVE PAGE --- */
export const Archive: React.FC<{ items: ArchiveItem[] }> = ({ items }) => (
  <div className="space-y-12">
    <div className="flex items-end justify-between border-b border-white/20 pb-4">
      <h1 className="text-4xl font-serif font-bold text-white">The Records</h1>
      <span className="font-mono text-sm text-jakdang-accent">Total Items: {items.length}</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs text-neutral-500 uppercase font-mono tracking-wider">
            <th className="py-4 font-normal">Year</th>
            <th className="py-4 font-normal">Type</th>
            <th className="py-4 font-normal">Title</th>
            <th className="py-4 font-normal">Description</th>
            <th className="py-4 font-normal text-right">Access</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {items.map(item => (
            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
              <td className="py-4 text-jakdang-muted font-mono">{item.year}</td>
              <td className="py-4">
                <span className={`px-2 py-1 text-[10px] uppercase rounded border ${
                  item.type === 'Award' ? 'border-yellow-900 text-yellow-500' :
                  item.type === 'Publication' ? 'border-blue-900 text-blue-400' : 'border-neutral-700 text-neutral-400'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="py-4 font-bold text-white group-hover:text-jakdang-accent transition-colors">{item.title}</td>
              <td className="py-4 text-neutral-400 max-w-md">{item.description}</td>
              <td className="py-4 text-right">
                <button className="text-neutral-500 hover:text-white transition-colors">
                  <ExternalLink size={16} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
             <tr>
               <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono">No records found.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* --- ACTIVITY PAGE --- */
export const Activity: React.FC<{ items: ActivityLog[] }> = ({ items }) => (
  <div className="space-y-12">
    <h1 className="text-4xl font-serif font-bold text-white mb-8">Field Operations</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       {items.map(item => (
        <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-6 hover:border-jakdang-accent transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-jakdang-accent font-bold"><Calendar size={18}/> {item.date}</div>
            <span className="text-xs font-mono bg-neutral-800 px-2 py-1 uppercase">{item.type}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-sm text-neutral-400 mb-4">{item.description}</p>
          <div className="aspect-video bg-neutral-800 grayscale group-hover:grayscale-0 transition-all overflow-hidden">
             {item.imageUrl ? (
               <img src={item.imageUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-80" alt={item.title} />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
             )}
          </div>
        </div>
       ))}
       {items.length === 0 && (
         <div className="col-span-2 text-center py-20 text-neutral-500 font-mono border border-dashed border-neutral-800">
           No activities logged.
         </div>
       )}
    </div>
  </div>
);


/* --- CONTACT PAGE --- */
export const Contact: React.FC<{ config: SiteConfig; onNavigate: (page: PageView) => void }> = ({ config, onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using Formspree for form handling
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xeeljnpe", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert("Transmission Successful. We will intercept your message shortly.");
        form.reset();
      } else {
        const data = await response.json();
        if ('errors' in data) {
          alert("Transmission Failed: " + data["errors"].map((error: any) => error["message"]).join(", "));
        } else {
          alert("Transmission Error. Please try again.");
        }
      }
    } catch (error) {
      alert("Network Error. Connection interrupted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-5xl font-serif font-bold text-white mb-12 text-center">Make Contact</h1>
      
      {/* Removed Recruitment and Collaboration Info Sections as requested */}

      <form 
        onSubmit={handleSubmit}
        className="space-y-6 bg-neutral-900 p-8 border border-neutral-800"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-neutral-500 mb-2">IDENTIFICATION (Name)</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-jakdang-accent outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-neutral-500 mb-2">RETURN ADDRESS (Email)</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-jakdang-accent outline-none" 
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-neutral-500 mb-2">PURPOSE OF CONTACT (Subject)</label>
          <select 
            name="subject"
            className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-jakdang-accent outline-none"
          >
            <option value="Recruitment Inquiry">Recruitment Inquiry</option>
            <option value="Project Collaboration">Project Collaboration</option>
            <option value="General Question">General Question</option>
            <option value="Site Data Report">Site Data Report</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-neutral-500 mb-2">MESSAGE ENCRYPTION (Body)</label>
          <textarea 
            name="message"
            required
            className="w-full bg-black border border-neutral-700 p-3 text-white focus:border-jakdang-accent outline-none h-32"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold py-4 hover:bg-jakdang-accent hover:text-white transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Transmitting...' : <><Send size={18} /> Transmit Message</>}
        </button>
      </form>
    </div>
  );
};