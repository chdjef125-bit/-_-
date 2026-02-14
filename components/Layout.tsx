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
    { label: 'Members', value: 'members' },
    { label: 'Works & Studies', value: 'works' },
    // Activity removed
    { label: 'Award', value: 'award' },
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
      
      {/* Header */}
      {/* Dynamic positioning: 'fixed' when menu is open to keep close button visible/accessible, 'absolute' otherwise */}
      <header 
        className={`${isMenuOpen ? 'fixed' : 'absolute'} top-0 left-0 w-full z-50 px-6 md:px-12 py-8 flex justify-between items-start mix-blend-difference text-white pointer-events-none transition-all duration-300`}
      >
        {/* Logo - Pointer events re-enabled */}
        <div 
          className="cursor-pointer pointer-events-auto hover:opacity-70 transition-opacity flex flex-col" 
          onClick={() => handleNav('home')}
        >
          {/* Main Title - Subtle Red */}
          <div className="font-bold text-3xl tracking-tighter uppercase leading-none text-red-500">
            Jakdang
          </div>
          {/* Subtitle - Subtle Red */}
          <div className="text-[0.6rem] font-bold tracking-[0.2em] text-red-500 uppercase leading-none mt-2">
            Architectural Student Club
          </div>
        </div>

        {/* Menu Toggle - Pointer events re-enabled */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center group pointer-events-auto pt-1"
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {/* Text label removed as requested */}
          <div className={`w-12 h-12 flex items-center justify-center border rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-white text-black border-white' : 'border-white text-white hover:bg-white hover:text-black'}`}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </button>
      </header>

      {/* Full Screen Menu Overlay - Fitted for 100vh */}
      <div 
        className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-2 md:space-y-4 text-center justify-center h-full max-h-screen pt-20 pb-10">
          {navItems.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => handleNav(item.value)}
              className={`text-4xl md:text-7xl font-bold tracking-tighter uppercase transition-transform duration-500 hover:text-jakdang-accent ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              } ${currentPage === item.value ? 'text-white' : 'text-neutral-700 hover:text-white'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
          
          <button 
             onClick={() => handleNav('admin')}
             className={`mt-8 text-xs font-mono text-neutral-500 hover:text-white uppercase tracking-widest transition-all duration-500 ${
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
              Architectural Student Club<br/>
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