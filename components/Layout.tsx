import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Mail, ChevronRight } from 'lucide-react';
import { PageView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems: { label: string; value: PageView }[] = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Members', value: 'members' },
    { label: 'Works', value: 'works' },
    // Process page removed
    { label: 'Activity', value: 'activity' },
    { label: 'Archive', value: 'archive' },
    { label: 'Contact', value: 'contact' },
  ];

  const isHome = currentPage === 'home';

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-jakdang-text bg-jakdang-black relative selection:bg-jakdang-accent selection:text-white">
      {/* Grid Background - Only visible on non-home pages or when scrolled down */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-20 border-jakdang-gray/30" 
           style={{ backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Navigation */}
      <nav 
        className={`z-50 w-full transition-all duration-300 border-b ${
          isHome 
            ? scrolled 
              ? 'fixed top-0 bg-jakdang-black/90 backdrop-blur-md border-white/10' 
              : 'fixed top-0 bg-transparent border-transparent'
            : 'sticky top-0 bg-jakdang-black/90 backdrop-blur-md border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Minimal Logo */}
            <div className="flex-shrink-0 cursor-pointer group" onClick={() => handleNav('home')}>
              <span className="font-bold text-2xl tracking-tighter text-white drop-shadow-md">
                작당모의
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNav(item.value)}
                  className={`text-sm font-medium hover:text-jakdang-accent transition-colors duration-200 shadow-sm ${
                    currentPage === item.value 
                      ? 'text-jakdang-accent' 
                      : isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-neutral-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => handleNav('admin')} className={`text-xs pt-0.5 hover:text-white ${isHome && !scrolled ? 'text-white/60' : 'text-neutral-600'}`}>ADMIN</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-jakdang-accent p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-jakdang-black/95 border-b border-white/10 backdrop-blur-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNav(item.value)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium border-l-2 ${
                    currentPage === item.value
                      ? 'border-jakdang-accent text-white bg-white/5'
                      : 'border-transparent text-jakdang-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
               <button onClick={() => handleNav('admin')} className="block w-full text-left px-3 py-3 text-xs text-jakdang-gray">Admin Access</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      {/* Dynamic container width based on page type */}
      <main className={`flex-grow z-10 relative w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black z-10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-white">
              작당모의
            </h3>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              Architecture, Conspired.<br/>
              Est. 2021 / Busan PKNU
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-jakdang-muted">
              <li className="flex items-center gap-2 hover:text-jakdang-accent cursor-pointer"><Mail size={16} /> chdjef125@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Recruit</h4>
            <button onClick={() => handleNav('contact')} className="text-sm border border-neutral-800 px-4 py-2 hover:bg-white hover:text-black transition-all flex items-center gap-2 text-neutral-300">
              Apply Now <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-700">
          &copy; {new Date().getFullYear()} JAKDANG. All rights reserved.
        </div>
      </footer>
    </div>
  );
};