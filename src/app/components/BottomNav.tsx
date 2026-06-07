import { Home, Compass, Heart, User, Plus } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (page: string) => void;
  onAdd: () => void;
}

/** Mobile-only floating bottom navigation with a centre Add button. */
export function BottomNav({ active, onNavigate, onAdd }: BottomNavProps) {
  const item = (page: string, Icon: any, label: string) => {
    const on = active === page;
    return (
      <button onClick={() => onNavigate(page)} className="flex-1 flex flex-col items-center gap-1 py-1" aria-label={label}>
        <Icon size={22} strokeWidth={2} style={{ color: on ? '#6200FF' : '#c0bacb' }} className={on && page === 'favorites' ? 'fill-[#6200FF]' : ''} />
        <span className="text-[10px] font-bold" style={{ color: on ? '#6200FF' : '#bdb7c9' }}>{label}</span>
      </button>
    );
  };
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-[800] h-[64px] bg-white rounded-[26px] flex items-center px-3"
      style={{ boxShadow: '0 16px 36px rgba(20,10,40,.18), 0 0 0 1px rgba(0,0,0,.03)' }}>
      {item('home', Home, 'Home')}
      {item('search', Compass, 'Explore')}
      <div className="flex-1 flex justify-center">
        <button onClick={onAdd} aria-label="Add place"
          className="w-14 h-14 rounded-full text-white flex items-center justify-center -mt-7"
          style={{ background: 'linear-gradient(135deg,#6200FF,#9a5bff)', boxShadow: '0 12px 24px rgba(98,0,255,.45)' }}>
          <Plus size={26} strokeWidth={2.4} />
        </button>
      </div>
      {item('favorites', Heart, 'Saved')}
      {item('profile', User, 'You')}
    </nav>
  );
}
