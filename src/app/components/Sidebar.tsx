import { Home, ShoppingBag, Heart, MessageCircle, Clock, Bell, Receipt, Store, Car, Settings, Crown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import wetigoLogo from './figma/logo.png';
import { useStore } from '../store';

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
  onAddLocation: () => void;
  onGoPremium: () => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ active, onNavigate, onAddLocation, onGoPremium, open, onClose }: SidebarProps) {
  const { t } = useStore();

  const items = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'search', icon: ShoppingBag, label: t('nav.explore') },
    { id: 'favorites', icon: Heart, label: t('nav.favorites') },
    { id: 'chat', icon: MessageCircle, label: t('nav.messages') },
    { id: 'history', icon: Clock, label: t('nav.history'), soon: true },
    { id: 'notification', icon: Bell, label: t('nav.notification'), soon: true },
    { id: 'bill', icon: Receipt, label: t('nav.bill'), soon: true },
    { id: 'restaurant', icon: Store, label: t('nav.restaurant'), soon: true },
    { id: 'drivers', icon: Car, label: t('nav.drivers'), soon: true },
    { id: 'profile', icon: Settings, label: t('nav.settings') },
  ];

  const go = (id: string) => { onNavigate(id); onClose(); };

  const content = (closable: boolean) => (
    <>
      <div className="flex items-center justify-between px-2 mb-8">
        <button onClick={() => go('home')} className="flex items-center">
          <img src={wetigoLogo} alt="Wetigo" className="h-16 w-auto object-contain" />
        </button>
        {closable && <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700"><X size={22} /></button>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          if (item.soon) {
            return (
              <div key={item.id} title="Coming soon" className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 cursor-not-allowed select-none">
                <Icon size={19} strokeWidth={2} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">{t('common.soon')}</span>
              </div>
            );
          }
          return (
            <button key={item.id} onClick={() => go(item.id)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
              style={{ backgroundColor: isActive ? '#f1ebff' : 'transparent', color: isActive ? '#6200FF' : '#6b7280' }}>
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#6200FF]" />}
              <Icon size={19} strokeWidth={2} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(150deg,#6200FF,#8b3bff)' }}>
        <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-1"><Crown size={16} className="text-amber-300" /><span className="font-semibold text-sm">{t('premium.q')}</span></div>
          <p className="text-white/80 text-xs leading-relaxed mb-3">{t('premium.desc')}</p>
          <button onClick={() => { onGoPremium(); onClose(); }} className="w-full py-2.5 rounded-xl bg-white text-[#6200FF] text-sm font-bold hover:bg-white/90 transition-colors">{t('premium.go')}</button>
          <button onClick={() => { onAddLocation(); onClose(); }} className="w-full mt-2 py-2 rounded-xl bg-white/15 text-white text-xs font-semibold hover:bg-white/25 transition-colors">{t('premium.addFree')}</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-100 px-4 py-6">
        {content(false)}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
              className="lg:hidden fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[950] w-72 bg-white px-4 py-6 flex flex-col shadow-2xl">
              {content(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
