import { Search, Bell, Mail, Menu, Star, MessageCircle, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { notifications as notifApi, auth as authApi } from '../lib/api';

interface TopbarProps {
  title: string;
  emoji?: string;
  query: string;
  onQuery: (v: string) => void;
  onSubmit: () => void;
  onMenu: () => void;
  onNavigate: (page: string) => void;
}

interface Notif { id?: number; icon: any; color: string; title?: string; text: string; time: string; read?: boolean; link?: string; }

const ICONS: Record<string, any> = { review: Star, star: Star, message: MessageCircle, place: MapPin, check: MapPin, info: Bell, bell: Bell };

function relTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso).getTime();
  if (isNaN(d)) return '';
  const diff = Math.round((d - Date.now()) / 1000);
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}

export function Topbar({ title, emoji, query, onQuery, onSubmit, onMenu, onNavigate }: TopbarProps) {
  const { user, t } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2000); };

  const [notifs, setNotifs] = useState<Notif[]>([]);

  const load = () => {
    if (!authApi.getToken()) return;
    notifApi.list().then((data: any) => {
      if (Array.isArray(data)) {
        setNotifs(data.map((n: any) => ({
          id: n.id,
          icon: ICONS[n.icon] ?? Bell,
          color: '#6200FF',
          title: n.title,
          text: n.text,
          time: relTime(n.createdAt),
          read: n.read,
          link: n.link,
        })));
      }
    }).catch(() => { /* ignore */ });
  };

  // load real notifications when logged in, and poll periodically
  useEffect(() => {
    load();
    const id = window.setInterval(load, 60000);
    window.addEventListener('wetigo:notifications', load);
    return () => { window.clearInterval(id); window.removeEventListener('wetigo:notifications', load); };
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const openNotifs = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen && authApi.getToken() && unread > 0) {
      notifApi.markAllRead().catch(() => {});
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

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
              placeholder={t('topbar.search')}
              className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm text-[#2b2521] placeholder:text-slate-400 focus:outline-none rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto shrink-0">
          {/* Messages — Soon */}
          <button onClick={() => flash(`${t('nav.messages')} — ${t('common.soon')}`)} title={`${t('nav.messages')} · ${t('common.soon')}`}
            className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 cursor-not-allowed">
            <Mail size={17} />
            <span className="absolute -top-1 -right-1 text-[8px] font-bold uppercase bg-slate-200 text-slate-500 px-1 rounded">soon</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={openNotifs} className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#6200FF] transition-colors">
              <Bell size={17} />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#6200FF] text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 font-display font-bold text-[#2b2521]">{t('nav.notification')}</div>
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {notifs.length === 0 && <div className="px-4 py-8 text-sm text-slate-400 text-center">{t('notif.empty')}</div>}
                      {notifs.map((n, i) => {
                        const Icon = n.icon;
                        return (
                          <button key={n.id ?? i} onClick={() => { setNotifOpen(false); if (n.link) window.location.href = n.link; }} className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left ${n.read ? '' : 'bg-[#6200FF]/[0.04]'}`}>
                            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${n.color}1a` }}>
                              <Icon size={15} style={{ color: n.color }} />
                            </span>
                            <div className="min-w-0 flex-1">
                              {n.title && <p className="text-sm font-semibold text-[#2b2521] leading-snug">{n.title}</p>}
                              <p className="text-sm text-slate-600 leading-snug">{n.text}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => onNavigate('profile')} className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#6200FF] transition-colors">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm font-semibold text-[#2b2521]">{user.name}</p>
              <p className="text-xs text-slate-400">User</p>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] bg-[#2b2521] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
