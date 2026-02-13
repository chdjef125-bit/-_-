import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { label: string; value: PageView }[] = [
    { label: 'Home', value: 'home' },
    // About page removed
    { label: 'Members', value: 'members' },
    { label: 'Works', value: 'works' },
    { label: 'Activity', value: 'activity' },
    { label: 'Archive', value: 'archive' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isHome = currentPage === 'home';

  return (
    <div className="min-h-screen flex flex-col font-sans text-white bg-black selection:bg-white selection:text-black">
      
      {/* Header - Absolute & Minimal with Blend Mode for visibility over images */}
      {/* Changed from 'fixed' to 'absolute' to stop it from following scroll */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
        {/* Logo - Pointer events re-enabled */}
        <div 
          className="cursor-pointer font-bold text-3xl tracking-tighter uppercase pointer-events-auto hover:opacity-70 transition-opacity" 
          onClick={() => handleNav('home')}
        >
          Jakdang
        </div>

        {/* Menu Toggle - Pointer events re-enabled */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-4 group pointer-events-auto"
        >
          <span className="text-sm font-bold tracking-widest uppercase hidden md:block group-hover:opacity-70 transition-opacity">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
          <div className={`w-12 h-12 flex items-center justify-center border rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-white text-black border-white' : 'border-white text-white hover:bg-white hover:text-black'}`}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </button>
      </header>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-4 md:space-y-6 text-center">
          {navItems.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => handleNav(item.value)}
              className={`text-5xl md:text-8xl font-bold tracking-tighter uppercase transition-transform duration-500 hover:text-jakdang-accent ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              } ${currentPage === item.value ? 'text-white' : 'text-neutral-700 hover:text-white'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
          
          <button 
             onClick={() => handleNav('admin')}
             className={`mt-12 text-sm font-mono text-neutral-500 hover:text-white uppercase tracking-widest transition-all duration-500 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
             }`}
             style={{ transitionDelay: '400ms' }}
          >
            System Admin
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className={`flex-grow w-full ${!isHome ? 'pt-32' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black text-neutral-600 py-12 md:py-24 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">JAKDANG</h3>
            <p className="text-sm max-w-md">
              Architectural Design Collective<br/>
              Busan, South Korea
            </p>
          </div>
          <div className="text-xs font-mono">
            &copy; {new Date().getFullYear()} JAKDANG. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};