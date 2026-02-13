import React, { useState } from 'react';
import { Member, ArchiveItem, ActivityLog, SiteConfig, PageView } from '../types';
import { FileText, MapPin, Mail, Instagram, ExternalLink, Calendar, BookOpen, Users, Send } from 'lucide-react';

/* --- MEMBERS PAGE --- */

const MemberCard: React.FC<{ m: Member, gray?: boolean }> = ({ m, gray = false }) => (
  <div className="group relative">
    <div className={`aspect-[3/4] overflow-hidden mb-4 ${gray ? 'grayscale opacity-50 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'} transition-all duration-500 bg-neutral-900`}>
      {m.imageUrl ? (
        <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-700">No Image</div>
      )}
    </div>
    <div className="border-t border-neutral-900 pt-4">
      <h4 className="text-xl font-bold text-white">{m.name}</h4>
      <p className="text-xs text-neutral-500 font-mono uppercase mb-2">{m.cohort} | {m.role}</p>
      {m.philosophy && m.philosophy.trim() !== "" && (
        <p className="text-sm text-neutral-600 line-clamp-2">"{m.philosophy}"</p>
      )}
    </div>
  </div>
);

export const Members: React.FC<{ members: Member[] }> = ({ members }) => {
  const leadership = members.filter(m => m.role === 'Leadership');
  const regular = members.filter(m => m.role === 'Member');
  const alumni = members.filter(m => m.role === 'Alumni');

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 space-y-24">
      <section>
        <h2 className="text-6xl md:text-8xl font-bold text-neutral-800 mb-12 tracking-tighter">LEADERSHIP</h2>
        {leadership.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {leadership.map(m => <MemberCard key={m.id} m={m} />)}
          </div>
        ) : (
          <p className="text-neutral-600 font-mono">No leadership members listed.</p>
        )}
      </section>
      
      <section>
        <h2 className="text-6xl md:text-8xl font-bold text-neutral-800 mb-12 tracking-tighter">MEMBERS</h2>
        {regular.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-12">
            {regular.map(m => <MemberCard key={m.id} m={m} />)}
          </div>
        ) : (
           <p className="text-neutral-600 font-mono">No members listed.</p>
        )}
      </section>

      <section className="pb-24">
        <h2 className="text-6xl md:text-8xl font-bold text-neutral-900 mb-12 tracking-tighter">ALUMNI</h2>
        {alumni.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-12">
            {alumni.map(m => <MemberCard key={m.id} m={m} gray />)}
          </div>
        ) : (
           <p className="text-neutral-600 font-mono">No alumni listed.</p>
        )}
      </section>
    </div>
  );
};

/* --- ARCHIVE PAGE --- */
export const Archive: React.FC<{ items: ArchiveItem[] }> = ({ items }) => (
  <div className="max-w-[1920px] mx-auto px-6 md:px-12">
    <div className="flex items-end justify-between border-b border-neutral-800 pb-8 mb-8">
      <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">ARCHIVE</h1>
      <span className="font-mono text-sm text-neutral-500 font-bold mb-4">{items.length} RECORDS</span>
    </div>

    <div className="overflow-x-auto pb-24">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase font-mono tracking-wider">
            <th className="py-4 font-normal w-24">Year</th>
            <th className="py-4 font-normal w-32">Type</th>
            <th className="py-4 font-normal">Title</th>
            <th className="py-4 font-normal hidden md:table-cell">Description</th>
            <th className="py-4 font-normal text-right w-24">Link</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {items.map(item => (
            <tr key={item.id} className="border-b border-neutral-900 hover:bg-neutral-900 transition-colors group">
              <td className="py-6 text-neutral-500 font-mono">{item.year}</td>
              <td className="py-6">
                <span className={`px-2 py-1 text-[10px] uppercase border font-bold ${
                  item.type === 'Award' ? 'border-white text-white' : 'border-neutral-800 text-neutral-500'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="py-6 text-xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">{item.title}</td>
              <td className="py-6 text-neutral-500 max-w-md hidden md:table-cell">{item.description}</td>
              <td className="py-6 text-right">
                <button className="text-neutral-600 hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
             <tr>
               <td colSpan={5} className="py-32 text-center text-neutral-700 font-mono uppercase tracking-widest">No records found</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

/* --- ACTIVITY PAGE --- */
export const Activity: React.FC<{ items: ActivityLog[] }> = ({ items }) => (
  <div className="max-w-[1920px] mx-auto px-6 md:px-12">
    <h1 className="text-6xl md:text-8xl font-bold text-white mb-12 tracking-tighter">ACTIVITIES</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 pb-24">
       {items.map(item => (
        <div key={item.id} className="bg-black p-8 md:p-12 hover:bg-neutral-900 transition-colors group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-white font-mono text-xl">{item.date}</div>
            <span className="text-xs font-mono border border-neutral-800 text-neutral-500 px-2 py-1 uppercase">{item.type}</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-neutral-500 mb-8 max-w-md">{item.description}</p>
          <div className="aspect-video bg-neutral-900 grayscale group-hover:grayscale-0 transition-all overflow-hidden">
             {item.imageUrl ? (
               <img src={item.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.title} />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-neutral-800">NO VISUAL DATA</div>
             )}
          </div>
        </div>
       ))}
       {items.length === 0 && (
         <div className="col-span-2 text-center py-32 text-neutral-700 font-mono bg-black">
           NO ACTIVITIES LOGGED
         </div>
       )}
    </div>
  </div>
);


/* --- CONTACT PAGE --- */
export const Contact: React.FC<{ config: SiteConfig; onNavigate: (page: PageView) => void }> = ({ config, onNavigate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xzdaewyk", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert("Transmission Successful.");
        form.reset();
      } else {
        alert("Transmission Failed. Please check your inputs and try again.");
      }
    } catch (error) {
      alert("Network Error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-24">
      <h1 className="text-6xl md:text-8xl font-bold text-white mb-12 tracking-tighter text-center md:text-left">CONTACT</h1>
      
      <div className="grid md:grid-cols-2 gap-12 md:gap-24">
        <div>
           <p className="text-xl md:text-2xl text-white leading-relaxed mb-12">
             We are constantly looking for new conspirators, collaborators, and complex problems to solve.
           </p>
           <div className="space-y-8 font-mono text-sm text-neutral-400">
             <div>
               <strong className="block text-white mb-2 uppercase tracking-widest">Studio Address</strong>
               {/* Use pre-wrap to respect newlines from the admin text area */}
               <p className="whitespace-pre-wrap">{config.contactAddress || "123 Design District, Busan\nSouth Korea 48000"}</p>
             </div>
             <div>
               <strong className="block text-white mb-2 uppercase tracking-widest">Digital Channels</strong>
               <p>{config.contactInstagram || "instagram.com/jakdang_studio"}</p>
               <p>{config.contactEmail || "hello@jakdang.com"}</p>
             </div>
           </div>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="space-y-0 border-t border-neutral-800"
        >
          <div className="group">
            <input 
              type="text" 
              name="name"
              placeholder="YOUR NAME"
              required
              className="w-full bg-black border-b border-neutral-800 py-6 text-xl text-white outline-none focus:border-white transition-colors placeholder:text-neutral-800" 
            />
          </div>
          <div className="group">
            <input 
              type="email" 
              name="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full bg-black border-b border-neutral-800 py-6 text-xl text-white outline-none focus:border-white transition-colors placeholder:text-neutral-800" 
            />
          </div>
          <div className="group">
            <select 
              name="subject"
              required
              defaultValue=""
              className="w-full bg-black border-b border-neutral-800 py-6 text-xl text-white outline-none focus:border-white transition-colors text-neutral-500"
            >
              <option value="" disabled>SELECT SUBJECT</option>
              <option value="Recruitment">RECRUITMENT</option>
              <option value="Collaboration">COLLABORATION</option>
              <option value="Inquiry">GENERAL INQUIRY</option>
            </select>
          </div>
          <div className="group">
            <textarea 
              name="message"
              placeholder="MESSAGE"
              required
              className="w-full bg-black border-b border-neutral-800 py-6 text-xl text-white outline-none h-40 focus:border-white transition-colors placeholder:text-neutral-800 resize-none"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-12 bg-white text-black font-bold py-6 hover:bg-neutral-200 transition-colors uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT'}
          </button>
        </form>
      </div>
    </div>
  );
};