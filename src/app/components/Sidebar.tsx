import { Home, ShoppingBag, Heart, MessageCircle, Clock, Bell, Receipt, Store, Car, Settings, ChevronDown, Crown } from 'lucide-react';
import wetigoLogo from './figma/logo.png';

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
  onAddLocation: () => void;
  onGoPremium: () => void;
}

export function Sidebar({ active, onNavigate, onAddLocation, onGoPremium }: SidebarProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: ShoppingBag, label: 'Explore Places' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'chat', icon: MessageCircle, label: 'Messages' },
    { id: 'history', icon: Clock, label: 'Order History' },
    { id: 'notification', icon: Bell, label: 'Notification' },
    { id: 'bill', icon: Receipt, label: 'Bill' },
    { id: 'restaurant', icon: Store, label: 'Restaurant', chevron: true },
    { id: 'drivers', icon: Car, label: 'Drivers', chevron: true },
    { id: 'profile', icon: Settings, label: 'Setting' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-100 px-4 py-6">
      {/* Logo */}
      <button onClick={() => onNavigate('home')} className="flex items-center px-2 mb-8">
        <img src={wetigoLogo} alt="Wetigo" className="h-16 w-auto object-contain" />
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left group"
              style={{
                backgroundColor: isActive ? '#f1ebff' : 'transparent',
                color: isActive ? '#6200FF' : '#6b7280',
              }}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[#6200FF]" />}
              <Icon size={19} strokeWidth={2} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.chevron && <ChevronDown size={15} className="opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Premium upsell */}
      <div className="mt-4 rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(150deg,#6200FF,#8b3bff)' }}>
        <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-1"><Crown size={16} className="text-amber-300" /><span className="font-semibold text-sm">Own a business?</span></div>
          <p className="text-white/80 text-xs leading-relaxed mb-3">Get promoted to the top of search &amp; categories and reach more customers.</p>
          <button onClick={onGoPremium} className="w-full py-2.5 rounded-xl bg-white text-[#6200FF] text-sm font-bold hover:bg-white/90 transition-colors">
            Go Premium
          </button>
          <button onClick={onAddLocation} className="w-full mt-2 py-2 rounded-xl bg-white/15 text-white text-xs font-semibold hover:bg-white/25 transition-colors">
            + Add your place free
          </button>
        </div>
      </div>
    </aside>
  );
}
