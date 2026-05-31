import { Search, Bell, Mail, Menu } from 'lucide-react';
import { useStore } from '../store';

interface TopbarProps {
  title: string;
  emoji?: string;
  query: string;
  onQuery: (v: string) => void;
  onSubmit: () => void;
  onMenu: () => void;
}

export function Topbar({ title, emoji, query, onQuery, onSubmit, onMenu }: TopbarProps) {
  const { user } = useStore();
  return (
    <header className="sticky top-0 z-30 bg-[#f5f6f4]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenu} className="lg:hidden p-2 rounded-xl hover:bg-white text-slate-600">
          <Menu size={22} />
        </button>

        <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2b2521] shrink-0">
          {title} {emoji && <span>{emoji}</span>}
        </h1>

        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative bg-white rounded-full border border-slate-200">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              placeholder="Search places, cuisines..."
              className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm text-[#2b2521] placeholder:text-slate-400 focus:outline-none rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto shrink-0">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#6200FF] transition-colors">
            <Mail size={17} />
          </button>
          <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#6200FF] transition-colors">
            <Bell size={17} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#6200FF] text-white text-[9px] font-bold flex items-center justify-center">2</span>
          </button>
          <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-slate-200">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-[#2b2521]">{user.name}</p>
              <p className="text-xs text-slate-400">User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
