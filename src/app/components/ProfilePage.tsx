import { Crown, MapPin, Star, Heart, Bell, LogOut, Plus, Globe, Languages, Pencil, Camera, X, Check } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { profile as profileApi, auth as authApi } from '../lib/api';
import { LANGUAGES, type Lang } from '../i18n';
import { COUNTRIES } from '../data/places';

interface ProfilePageProps {
  onShowSubscription: () => void;
  onAddLocation: () => void;
  onSignOut: () => void;
  onSelectLocation?: (id: number) => void;
  onManage?: () => void;
  onOpenFavorites?: () => void;
  plan?: string;
}

export function ProfilePage({ onShowSubscription, onAddLocation, onSignOut, onSelectLocation, onManage, onOpenFavorites, plan = 'free' }: ProfilePageProps) {
  const { user, updateUser, favorites, lang, setLang, t, country, setCountry } = useStore();
  const [notifications, setNotifications] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };

  const changeCountry = (c: string) => { setCountry(c); flash(t('toast.country')); };
  const changeLang = (l: Lang) => { setLang(l); flash(t('toast.langChanged')); };

  const persistNotif = (v: boolean) => { if (authApi.getToken()) profileApi.updateSettings({ notifications: v }).catch(() => {}); };
  const togglePush = async () => {
    if (notifications) { setNotifications(false); persistNotif(false); flash(t('toast.pushOff')); return; }
    if (typeof Notification === 'undefined') { setNotifications(true); persistNotif(true); flash(t('toast.pushOn')); return; }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') { setNotifications(true); persistNotif(true); flash(t('toast.pushOn')); try { new Notification(t('notif.enabledTitle'), { body: t('notif.enabledBody'), icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' }); } catch { /* ignore */ } }
      else { flash(t('toast.pushBlocked')); }
    } catch { setNotifications(true); persistNotif(true); flash(t('toast.pushOn')); }
  };

  // edit-profile modal
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const openEdit = () => { setDraft(user); setEditing(true); };
  const saveEdit = () => {
    updateUser(draft);                 // optimistic local update
    setEditing(false);
    if (authApi.getToken()) {
      profileApi.update({ name: draft.name, email: draft.email, bio: draft.bio, avatar: draft.avatar }).catch(() => {});
    }
  };

  // On mount, if logged in, refresh profile from the server so edits survive reloads.
  useEffect(() => {
    if (!authApi.getToken()) return;
    authApi.me().then((u: any) => {
      if (u) {
        updateUser({ name: u.name ?? draft.name, email: u.email ?? draft.email, bio: u.bio ?? '', avatar: u.avatar ?? draft.avatar });
        if (typeof u.notifications === 'boolean') setNotifications(u.notifications);
        if (typeof u.emailUpdates === 'boolean') setEmailUpdates(u.emailUpdates);
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setDraft((d) => ({ ...d, avatar: URL.createObjectURL(f) }));
  };

  const isPremium = plan !== 'free';

  // Real stats + activity from the backend (fall back to what we know locally).
  const [stats, setStats] = useState({ reviews: 0, favorites: favorites.length, plans: 0 });
  const [recentActivity, setRecentActivity] = useState<{ id: number; type: string; place: string; action: string; time: string; rating?: number; createdAt?: number; placeId?: number }[]>([]);
  const [activityLoaded, setActivityLoaded] = useState(false);
  useEffect(() => {
    setStats((s) => ({ ...s, favorites: favorites.length }));
  }, [favorites.length]);
  useEffect(() => {
    if (!authApi.getToken()) { setActivityLoaded(true); return; }
    profileApi.stats().then((s: any) => { if (s) setStats({ reviews: s.reviews ?? 0, favorites: s.favorites ?? favorites.length, plans: s.plans ?? 0 }); }).catch(() => {});
    profileApi.activity().then((a: any) => { if (Array.isArray(a)) setRecentActivity(a); }).catch(() => {}).finally(() => setActivityLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Localize the action text + relative time on the client (backend sends rating + createdAt).
  const actText = (a: any) => (a.type === 'review' && a.rating != null) ? t('prof.actReview').replace('{n}', String(a.rating)) : (a.action || '');
  const relTime = (a: any): string => {
    const ms = a.createdAt; if (!ms) return a.time || '';
    try {
      const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
      const diff = ms - Date.now(); const day = 86400000;
      const days = Math.round(diff / day);
      if (Math.abs(days) >= 1) return rtf.format(days, 'day');
      const hours = Math.round(diff / 3600000);
      if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour');
      return rtf.format(Math.round(diff / 60000), 'minute');
    } catch { return a.time || ''; }
  };
  const activityIcon = (type: string) => type === 'favorite' ? Heart : type === 'plan' ? MapPin : Star;
  const activityColor = (type: string) => type === 'favorite' ? 'from-rose-500 to-pink-600' : type === 'plan' ? 'from-[#6200FF] to-[#8b00ff]' : 'from-amber-500 to-yellow-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#4a00cc] to-[#6200FF] px-6 sm:px-8 pt-8 pb-8 rounded-3xl shadow-xl shadow-purple-600/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-3xl object-cover border-4 border-white/30 shadow-2xl" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-green-500 border-4 border-[#6200FF] shadow-lg"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-white truncate">{user.name}</h1>
                {isPremium && <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"><Crown size={11} /> {plan === 'business' ? 'Business' : 'Pro'}</span>}
              </div>
              <p className="text-purple-100 text-sm truncate">{user.email}</p>
              <p className="text-purple-200 text-xs mt-1 line-clamp-1">{user.bio}</p>
            </div>
            <button onClick={openEdit} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/30 transition-colors shrink-0">
              <Pencil size={15} /> <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('prof.reviews'), value: stats.reviews, icon: Star, onClick: undefined as undefined | (() => void) },
              { label: t('prof.saved'), value: stats.favorites, icon: Heart, onClick: onOpenFavorites },
              { label: t('prof.plans'), value: stats.plans, icon: MapPin, onClick: undefined as undefined | (() => void) },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={stat.onClick}
                  className={`bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/30 shadow-lg ${stat.onClick ? 'cursor-pointer hover:bg-white/30 transition-colors' : ''}`}
                >
                  <Icon size={18} className="text-white mx-auto mb-1" />
                  <div className="text-2xl text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-purple-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAddLocation}
          className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#4a00cc] to-[#6200FF] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-600/20">
            <Plus size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-900 text-sm mb-1">{t('settings.addBusiness')}</p>
            <p className="text-xs text-slate-600">{t('settings.listLocation')}</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onManage?.()}
          className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <MapPin size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-900 text-sm mb-1">{t('prof.manage')}</p>
            <p className="text-xs text-slate-600">{t('prof.manageDesc')}</p>
          </div>
        </motion.button>

        <div
          className="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-4 shadow-lg shadow-amber-500/20 opacity-90"
        >
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide bg-white/25 text-white px-2 py-0.5 rounded-md">{t('common.soon')}</span>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-3 border border-white/30">
            <Crown size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm mb-1">{t('premium.go')}</p>
            <p className="text-xs text-amber-100">{t('prof.grow')}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">{t('settings.recent')}</h2>
        <div className="space-y-3">
          {recentActivity.length === 0 && activityLoaded && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3"><Star size={22} className="text-slate-300" /></div>
              <p className="text-sm font-medium text-slate-700 mb-1">{t('prof.noActivity')}</p>
              <p className="text-xs text-slate-500">{t('prof.noActivityDesc')}</p>
            </div>
          )}
          {recentActivity.map((activity, idx) => {
            const Icon = activityIcon(activity.type);
            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { const pid = (activity as any).placeId; if (pid && onSelectLocation) onSelectLocation(pid); }}
                className="w-full text-left bg-white rounded-3xl p-4 shadow-md border border-slate-200 hover:border-[#6200FF]/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activityColor(activity.type)} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 mb-1">
                      {actText(activity)} · <span className="font-semibold">{activity.place}</span>
                    </p>
                    <p className="text-xs text-slate-500">{relTime(activity)}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="pb-6">
        <h2 className="font-semibold text-slate-900 mb-4">{t('settings.title')}</h2>
        <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-200 divide-y divide-slate-100">
          {/* Push notifications */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-700" />
              <div>
                <span className="text-slate-900 font-medium block">{t('settings.push')}</span>
                <span className="text-xs text-slate-500">{t('settings.pushDesc')}</span>
              </div>
            </div>
            <button onClick={togglePush} className="relative inline-block w-12 h-6 shrink-0" aria-label="toggle notifications">
              <div className="w-12 h-6 rounded-full transition-all duration-300" style={{ background: notifications ? '#6200FF' : '#e2e8f0' }}></div>
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md" style={{ left: notifications ? 28 : 4 }}></div>
            </button>
          </div>

          {/* Email updates */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-700" />
              <div>
                <span className="text-slate-900 font-medium block">{t('settings.email')}</span>
                <span className="text-xs text-slate-500">{t('settings.emailDesc')}</span>
              </div>
            </div>
            <button onClick={() => { const v = !emailUpdates; setEmailUpdates(v); if (authApi.getToken()) profileApi.updateSettings({ emailUpdates: v }).catch(() => {}); }} className="relative inline-block w-12 h-6 shrink-0" aria-label="toggle email">
              <div className="w-12 h-6 rounded-full transition-all duration-300" style={{ background: emailUpdates ? '#6200FF' : '#e2e8f0' }}></div>
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md" style={{ left: emailUpdates ? 28 : 4 }}></div>
            </button>
          </div>

          {/* Country */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3"><Globe size={20} className="text-slate-700" /><span className="text-slate-900 font-medium">{t('settings.country')}</span></div>
            <select value={country} onChange={(e) => changeCountry(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]">
              {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3"><Languages size={20} className="text-slate-700" /><span className="text-slate-900 font-medium">{t('settings.language')}</span></div>
            <select value={lang} onChange={(e) => changeLang(e.target.value as Lang)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
          </div>

          {/* Sign out */}
          <button onClick={onSignOut} className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3"><LogOut size={20} className="text-red-600" /><span className="text-red-600 font-medium">{t('settings.signout')}</span></div>
          </button>
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1100] bg-[#2b2521] text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit profile modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(false)}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h3 className="font-display text-xl font-bold text-[#2b2521]">{t('prof.editProfile')}</h3>
                <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={draft.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    <button onClick={() => avatarRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#6200FF] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <Camera size={15} />
                    </button>
                    <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                  </div>
                  <p className="text-sm text-slate-500">{t('prof.avatarHint')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.fullname')}</label>
                  <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.email')}</label>
                  <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('prof.bio')}</label>
                  <textarea rows={2} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF] resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50">{t('prof.cancel')}</button>
                  <button onClick={saveEdit} disabled={!draft.name.trim() || !draft.email.trim()} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6200FF] text-white font-semibold hover:bg-[#5400dd] disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"><Check size={17} /> {t('prof.save')}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
