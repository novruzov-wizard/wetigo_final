import { Home, Search, Heart, MessageCircle, User, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import wetigoLogo from './figma/logo.png';

interface TopNavProps {
  active: string;
  onNavigate: (page: string) => void;
  onAddLocation: () => void;
}

export function TopNav({ active, onNavigate, onAddLocation }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Explore' },
    { id: 'favorites', icon: Heart, label: 'Saved' },
    { id: 'chat', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const go = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--cream)]/85 backdrop-blur-xl border-b border-[#e7dccd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center shrink-0">
            <img src={wetigoLogo} alt="Wetigo — Where To Go?" className="h-20 w-auto object-contain -my-2" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
                  style={{ color: isActive ? '#6200FF' : '#64748b' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: '#f0e6ff' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="relative z-10 text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAddLocation}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-purple-600/20 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#6200FF' }}
            >
              <Plus size={18} />
              Add Business
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                    style={{
                      color: isActive ? '#6200FF' : '#475569',
                      backgroundColor: isActive ? '#f0e6ff' : 'transparent',
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => { onAddLocation(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold mt-2"
                style={{ backgroundColor: '#6200FF' }}
              >
                <Plus size={20} />
                Add Business
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
