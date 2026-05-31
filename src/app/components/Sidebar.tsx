import { Home, ShoppingBag, Heart, MessageCircle, Clock, Bell, Receipt, Store, Car, Settings, ChevronDown } from 'lucide-react';
import wetigoLogo from './figma/logo.png';

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
  onAddLocation: () => void;
}

export function Sidebar({ active, onNavigate, onAddLocation }: SidebarProps) {
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
      <button onClick={() => onNavigate('home')} className="flex items-center px-3 mb-8">
        <img src={wetigoLogo} alt="Wetigo" className="h-12 w-auto object-contain" />
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

      {/* Promo card */}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#f1ebff] to-[#e7dbff] p-4 text-center">
        <p className="font-display font-semibold text-[#2b2521] text-sm leading-tight mb-3">Share your own<br />favorite spot</p>
        <button
          onClick={onAddLocation}
          className="w-full py-2.5 rounded-xl bg-[#6200FF] text-white text-sm font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] transition-colors"
        >
          Add Place
        </button>
      </div>
    </aside>
  );
}
