import { Search, Heart, Plus, Star, MapPin, ArrowUpRight, ChevronRight, Navigation, Compass } from 'lucide-react';
import { CATEGORIES_WITH_ALL, CATEGORIES } from '../data/categories';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { card as cardApi, auth as authApi } from '../lib/api';
import { distanceKm } from '../data/places';
import { useRef } from 'react';

declare const L: any;

interface HomePageProps {
  onSelectLocation: (id: number) => void;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onAddLocation: () => void;
}

export function HomePage({ onSelectLocation, onCategorySelect, onSearch, onAddLocation }: HomePageProps) {
  const [activeCat, setActiveCat] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, t, places: PLACES, user } = useStore();

  // real counts from loaded places
  const countFor = (id: string) => id === 'all' ? PLACES.length : PLACES.filter((p) => p.categoryId === id).length;
  const categories = CATEGORIES_WITH_ALL.map((c) => ({ id: c.id, name: c.name, icon: c.icon, tint: c.tint, fg: c.fg, count: String(countFor(c.id)) }));

  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLoc({ lat: 40.3777, lng: 49.892 }), // fallback: Baku
      { timeout: 8000 }
    );
  }, []);

  const tints = ['#fdeef2', '#fef4ea', '#e9f7ef'];
  // Popular = promoted (premium) listings first, then highest rated. No fake discounts.
  const places = [...PLACES]
    .sort((a, b) => (Number(b.premium) - Number(a.premium)) || (b.rating - a.rating) || ((b.reviews ?? 0) - (a.reviews ?? 0)))
    .slice(0, 3)
    .map((p, i) => ({ ...p, tint: tints[i % tints.length] }));
  // "Explore picks" — verified/promoted first; honest city label (no fake review counts)
  const recentReviews = [...PLACES]
    .sort((a, b) => (Number(b.premium) - Number(a.premium)) || (Number(b.verified) - Number(a.verified)))
    .slice(0, 3)
    .map((p) => ({ id: p.id, name: p.name, rating: p.rating, when: p.city, img: `${p.image}` }));

  // nearest real place to the user
  const ranked = userLoc ? [...PLACES].map((p) => ({ p, d: distanceKm(userLoc.lat, userLoc.lng, p.lat, p.lng) })).sort((a, b) => a.d - b.d) : [];
  const nearest = ranked[0];
  const fmtDist = (d: number) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`);

  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };

  // Wetigo membership card — derived deterministically from the user so it's
  // stable per account (the real number is issued by the backend on register).
  const cardNumber = (() => {
    const seed = (user.email || user.name || 'wetigo').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const grp = (n: number) => String(1000 + (n % 9000));
    return `${grp(seed)} ${grp(seed >> 3)} ${grp(seed >> 6)} ${grp(seed >> 9)}`;
  })();
  const cardExpiry = (() => { const d = new Date(); return `${String((d.getMonth() % 12) + 1).padStart(2, '0')}/${String((d.getFullYear() + 4) % 100)}`; })();

  // ---- PWA install (Android: native prompt · iOS: Add to Home Screen guide) ----
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [iosHelp, setIosHelp] = useState(false);
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone);
  useEffect(() => {
    const onBip = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', onBip);
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);
  const installApp = async () => {
    if (isStandalone) { flash('Wetigo is already installed ✓'); return; }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch { /* ignore */ }
      setDeferredPrompt(null);
      return;
    }
    if (isIOS) { setIosHelp(true); return; }
    flash('Open your browser menu → “Install app” to add Wetigo');
  };

  // Real Wetigo membership card from the backend (issued on register).
  const [realCard, setRealCard] = useState<{ number: string; holder: string } | null>(null);
  useEffect(() => {
    if (!authApi.getToken()) return;
    cardApi.get().then((c) => { if (c?.number) setRealCard({ number: c.number, holder: c.holder }); }).catch(() => {});
  }, []);
  const shownCardNumber = realCard?.number || cardNumber;
  const shownCardHolder = (realCard?.holder || user.name || 'Wetigo Member').toUpperCase();

  // real mini-map of nearby places
  const nbEl = useRef<HTMLDivElement | null>(null);
  const nbMap = useRef<any>(null);
  useEffect(() => {
    if (!nbEl.current || typeof L === 'undefined') return;
    const fallback = PLACES.find((p) => p.country === 'az') ?? PLACES[0] ?? { lat: 40.3713, lng: 49.8516 };
    const center = userLoc ?? { lat: fallback.lat, lng: fallback.lng };
    const t2 = setTimeout(() => {
      if (!nbMap.current) {
        nbMap.current = L.map(nbEl.current, { zoomControl: false, attributionControl: false, dragging: true, scrollWheelZoom: false }).setView([center.lat, center.lng], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(nbMap.current);
      } else {
        nbMap.current.setView([center.lat, center.lng], 12);
      }
      const map = nbMap.current;
      map._wetigoMarkers?.forEach((m: any) => map.removeLayer(m));
      map._wetigoMarkers = [];
      // user dot
      if (userLoc) {
        const u = L.circleMarker([userLoc.lat, userLoc.lng], { radius: 7, color: '#fff', weight: 3, fillColor: '#6200FF', fillOpacity: 1 }).addTo(map);
        map._wetigoMarkers.push(u);
      }
      // nearby place pins
      (ranked.length ? ranked.slice(0, 6).map((r) => r.p) : PLACES.slice(0, 6)).forEach((p) => {
        const icon = L.divIcon({ className: 'wetigo-pin', html: `<div style="transform:translate(-50%,-100%)"><div style="width:14px;height:14px;border-radius:50% 50% 50% 0;background:${p.premium ? '#6200FF' : '#f43f5e'};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div></div>` });
        const mk = L.marker([p.lat, p.lng], { icon }).addTo(map);
        mk.on('click', () => onSelectLocation(p.id));
        map._wetigoMarkers.push(mk);
      });
      map.invalidateSize();
    }, 120);
    return () => clearTimeout(t2);
  }, [userLoc, ranked.length, PLACES.length]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* ===== MAIN COLUMN ===== */}
        <div className="space-y-6 min-w-0">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#efe6ff] to-[#e3d4ff] p-7 sm:p-9 flex items-center justify-between gap-6">
            <div className="relative z-10 max-w-md">
              <span className="inline-flex items-center gap-1.5 bg-white/70 text-[#6200FF] text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Star size={12} className="fill-[#6200FF]" /> {t('home.badge')}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2521] leading-tight mb-2">{t('home.heroTitle')}</h2>
              <p className="text-sm text-[#6b6258] mb-5">{t('home.heroDesc')}</p>
              <div className="flex flex-wrap gap-2.5">
                <button onClick={() => onSearch('')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6200FF] text-white text-sm font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] transition-colors">
                  <Search size={16} /> {t('home.exploreNow')}
                </button>
                <button onClick={onAddLocation}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#2b2521] text-sm font-semibold border border-[#e3d4ff] hover:bg-[#faf7ff] transition-colors">
                  {t('home.listBusiness')}
                </button>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
              alt="Featured"
              className="block w-24 h-24 sm:w-44 sm:h-32 object-cover rounded-2xl shadow-xl rotate-3 shrink-0"
            />
          </div>

          {/* Categories — image carousel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#2b2521]">{t('home.browse')}</h3>
              <button onClick={() => onCategorySelect('all')} className="text-sm font-semibold text-[#6200FF] flex items-center gap-1">{t('home.seeAll')} <ChevronRight size={15} /></button>
            </div>
            <div className="flex gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                const n = countFor(cat.id);
                const featured = idx === 0;
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setActiveCat(cat.id); onCategorySelect(cat.id); }}
                    className="relative shrink-0 rounded-[24px] overflow-hidden text-left"
                    style={{ width: featured ? 168 : 138, height: featured ? 196 : 180, boxShadow: `0 ${featured ? 20 : 14}px ${featured ? 36 : 26}px -12px rgba(40,20,80,${featured ? 0.4 : 0.3})` }}
                  >
                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 32%, rgba(8,6,18,0.82))' }} />
                    <span className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.28)' }}>
                      <Icon size={17} />
                    </span>
                    {featured && <span className="absolute top-3 right-3 text-[9px] font-extrabold tracking-wide text-white px-2.5 py-1 rounded-full" style={{ background: '#6200FF' }}>HOT</span>}
                    <div className="absolute left-3.5 bottom-3.5 text-white">
                      <p className="font-bold leading-tight" style={{ fontSize: featured ? 17 : 15 }}>{cat.name}</p>
                      <p className="text-[11px] opacity-90 mt-0.5">{n} {t('common.places')}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Place cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#2b2521]">{t('home.popular')}</h3>
              <button onClick={() => onSearch('')} className="text-sm font-semibold text-[#6200FF] flex items-center gap-1">{t('home.viewAll')} <ChevronRight size={15} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {places.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-3xl p-4 border border-[#eee9e1]"
                  style={{ backgroundColor: p.tint }}
                >
                  <div className="flex items-start justify-between mb-2">
                    {p.premium ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#6200FF] bg-white/70 px-2.5 py-1 rounded-full"><Star size={11} className="fill-[#6200FF]" /> {t('common.promoted')}</span>
                    ) : p.verified ? (
                      <span className="text-xs font-semibold text-emerald-600 bg-white/70 px-2.5 py-1 rounded-full">{t('common.verified')}</span>
                    ) : <span />}
                    <button onClick={() => toggleFavorite(p.id)} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-rose-400 hover:text-rose-500" title="Save place">
                      <Heart size={15} className={isFavorite(p.id) ? 'fill-rose-500 text-rose-500' : ''} />
                    </button>
                  </div>
                  <button onClick={() => onSelectLocation(p.id)} className="block w-full">
                    <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-2xl mb-3" />
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-semibold text-[#2b2521] line-clamp-1 text-left">{p.name}</h4>
                      {p.rating > 0
                        ? <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 shrink-0"><Star size={12} className="fill-amber-500 text-amber-500" />{p.rating}</span>
                        : <span className="text-[10px] font-bold text-[#6200FF] bg-white/70 px-2 py-0.5 rounded-full shrink-0">New</span>}
                    </div>
                    <p className="text-xs text-[#8a8175] line-clamp-2 text-left mb-3 leading-relaxed">{p.category} · {p.city}</p>
                  </button>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-[#2b2521]">{p.price}</span>
                    <button onClick={() => onSelectLocation(p.id)} className="w-9 h-9 rounded-full bg-[#6200FF] text-white flex items-center justify-center shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* App download marketing banner */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: 'linear-gradient(120deg,#2b1a4d 0%,#4a00cc 55%,#6200FF 100%)' }}>
            <div className="pointer-events-none absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute right-24 -top-12 w-32 h-32 rounded-full bg-fuchsia-400/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-6">
              <div className="max-w-md">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">{t('app.title')}</h3>
                <p className="text-white/70 text-sm mb-4">{t('app.desc')}</p>
                {/* social proof */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                    <span className="text-white text-sm font-semibold ml-1">4.9</span>
                  </div>
                  <span className="text-white/60 text-xs">·  1M+ explorers</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* App Store badge → installs the PWA */}
                  <button onClick={installApp} className="flex items-center gap-2.5 bg-black text-white pl-3 pr-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.5 1.6c0 1.1-.4 2.1-1.2 2.9-.9.9-2 1.5-3.1 1.4-.1-1.1.4-2.2 1.1-2.9.8-.9 2.1-1.5 3.2-1.4ZM20.3 17c-.5 1.2-.8 1.7-1.5 2.8-1 1.5-2.4 3.4-4.1 3.4-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.2-2.8-4.3-3.1-9.3-1.4-12 1.2-1.9 3.1-3 4.9-3 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-3.9 2.2-3.3 7.8.3 9.6Z"/></svg>
                    <span className="text-left leading-none"><span className="block text-[9px] text-white/70">Download on the</span><span className="block text-sm font-semibold">App Store</span></span>
                  </button>
                  {/* Google Play badge → installs the PWA */}
                  <button onClick={installApp} className="flex items-center gap-2.5 bg-black text-white pl-3 pr-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                    <svg width="18" height="20" viewBox="0 0 24 24"><path fill="#34A853" d="M3.6 2.3 13.4 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Z"/><path fill="#4285F4" d="M16.9 8.5 13.4 12 3.9 2.1c.1 0 .3 0 .5.1l12.5 6.3Z"/><path fill="#FBBC04" d="m16.9 15.5-3.5-3.5 3.5-3.5 3.2 1.6c.9.5.9 1.8 0 2.3l-3.2 1.6Z"/><path fill="#EA4335" d="M3.9 21.9 13.4 12l3.5 3.5-12.5 6.3c-.2.1-.4.1-.5.1Z"/></svg>
                    <span className="text-left leading-none"><span className="block text-[9px] text-white/70">GET IT ON</span><span className="block text-sm font-semibold">Google Play</span></span>
                  </button>
                </div>
              </div>
              {/* Realistic phone */}
              <div className="hidden sm:block relative shrink-0">
                <div className="relative w-[150px] h-[300px] rounded-[2rem] bg-[#1a1130] p-2 shadow-2xl rotate-6 border border-white/10">
                  {/* screen */}
                  <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-[#f5f6f4]">
                    {/* notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1130] rounded-b-2xl z-20" />
                    {/* status bar */}
                    <div className="flex items-center justify-between px-3 pt-1.5 text-[7px] font-semibold text-[#2b2521]">
                      <span>9:41</span><span>📶 🔋</span>
                    </div>
                    {/* app header */}
                    <div className="px-3 pt-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black" style={{ color: '#6200FF' }}>Wetigo</span>
                        <span className="w-4 h-4 rounded-full bg-[#e7dcff]" />
                      </div>
                      <div className="mt-1.5 h-5 rounded-lg bg-white border border-slate-200 flex items-center px-2"><span className="text-[7px] text-slate-400">Search…</span></div>
                    </div>
                    {/* hero chip */}
                    <div className="mx-3 mt-2 rounded-xl p-2" style={{ background: 'linear-gradient(120deg,#efe6ff,#e3d4ff)' }}>
                      <div className="h-1.5 w-12 bg-[#6200FF]/60 rounded-full mb-1" />
                      <div className="h-1.5 w-8 bg-[#6200FF]/30 rounded-full" />
                    </div>
                    {/* place cards */}
                    <div className="px-3 mt-2 space-y-1.5">
                      {PLACES.slice(0, 2).map((p) => (
                        <div key={p.id} className="flex gap-1.5 bg-white rounded-lg p-1 shadow-sm">
                          <img src={p.image} alt="" className="w-8 h-8 rounded-md object-cover" />
                          <div className="flex-1 pt-0.5">
                            <div className="h-1.5 w-full bg-slate-200 rounded-full mb-1" />
                            <div className="h-1.5 w-2/3 bg-slate-100 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* bottom nav */}
                    <div className="absolute bottom-0 inset-x-0 h-7 bg-white border-t border-slate-100 flex items-center justify-around">
                      {[0,1,2,3].map((i) => <span key={i} className="w-3.5 h-3.5 rounded-md" style={{ background: i === 0 ? '#6200FF' : '#e2e8f0' }} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT RAIL ===== */}
        <div className="space-y-5">
          {/* Membership card */}
          <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #6200FF 0%, #8b3bff 100%)' }}>
            <div className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">Wetigo Card</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">◎</span>
            </div>
            <p className="font-display text-xl tracking-widest mb-6">{shownCardNumber}</p>
            <div className="flex items-end justify-between text-xs">
              <div>
                <p className="text-white/60 mb-0.5">Card Holder</p>
                <p className="font-semibold tracking-wide">{shownCardHolder}</p>
              </div>
              <div>
                <p className="text-white/60 mb-0.5">Expires</p>
                <p className="font-semibold">{cardExpiry}</p>
              </div>
              <div className="flex -space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-400" />
                <span className="w-6 h-6 rounded-full bg-amber-300/90" />
              </div>
            </div>
          </div>

          {/* Recent reviews */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-[#2b2521]">{t('home.recent')}</h4>
              <button onClick={() => onSearch('')} className="text-xs font-semibold text-[#6200FF] flex items-center gap-1">{t('home.viewAll')} <ArrowUpRight size={13} /></button>
            </div>
            <div className="space-y-1">
              {recentReviews.map((o) => (
                <button key={o.id} onClick={() => onSelectLocation(o.id)} className="w-full flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <img src={o.img} alt={o.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2b2521] line-clamp-1">{o.name}</p>
                    <p className="text-xs text-[#a89a8b]">{o.when}</p>
                  </div>
                  {o.rating > 0
                    ? <span className="flex items-center gap-0.5 text-sm font-semibold text-amber-600"><Star size={12} className="fill-amber-500 text-amber-500" />{o.rating}</span>
                    : <span className="text-[11px] font-bold text-[#6200FF] bg-[#f1ebff] px-2 py-0.5 rounded-full">New</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Real nearby mini-map */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-[#2b2521]">{t('home.nearby')}</h4>
              <button onClick={() => onSearch('')} className="flex items-center gap-1 text-xs font-semibold text-[#6200FF] hover:gap-1.5 transition-all">{t('home.openMap')} <ArrowUpRight size={14} /></button>
            </div>
            <div ref={nbEl} className="relative h-40 rounded-2xl overflow-hidden bg-[#eef1ee] z-0" />
          </div>

          {/* Nearest to you (real, geolocation-driven) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-[#2b2521]">{t('home.nearest')}</h4>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#6200FF]"><Compass size={13} /> {userLoc ? t('explore.located') : '…'}</span>
            </div>
            {nearest ? (
              <>
                <button onClick={() => onSelectLocation(nearest.p.id)} className="block w-full text-left">
                  <div className="relative h-28 rounded-2xl overflow-hidden mb-3">
                    <img src={nearest.p.image} alt={nearest.p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#6200FF' }}>{fmtDist(nearest.d)}</span>
                    {nearest.p.openingHours && (
                      <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={nearest.p.open ? { background: '#dff0e6', color: '#2f9461' } : { background: '#fdecec', color: '#c2603f' }}>{nearest.p.open ? t('common.open') : t('common.closed')}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-[#2b2521] text-sm line-clamp-1">{nearest.p.name}</p>
                    {nearest.p.rating > 0
                      ? <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600"><Star size={12} className="fill-amber-500 text-amber-500" />{nearest.p.rating}</span>
                      : <span className="text-[10px] font-bold text-[#6200FF] bg-[#f1ebff] px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  <p className="text-xs text-[#a89a8b] flex items-center gap-1 mb-3"><MapPin size={12} className="text-[#6200FF]" />{nearest.p.city}</p>
                </button>
                <div className="flex gap-2">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${nearest.p.lat},${nearest.p.lng}`} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#6200FF] text-white text-sm font-semibold hover:bg-[#5400dd] transition-colors">
                    <Navigation size={15} /> {t('explore.directions')}
                  </a>
                  <button onClick={() => onSearch('')} className="px-4 py-2.5 rounded-xl bg-[#f1ebff] text-[#6200FF] text-sm font-semibold hover:bg-[#e3d6ff] transition-colors">{t('home.openMap')}</button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-[#a89a8b]">
                <MapPin size={28} className="mx-auto mb-2 text-slate-300" />
                Allow location to see the nearest place to you.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#2b2521] text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS install instructions */}
      <AnimatePresence>
        {iosHelp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIosHelp(false)}
            className="fixed inset-0 z-[1200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#4a00cc] to-[#6200FF] p-5 text-center">
                <img src="/icons/icon-192.png" alt="Wetigo" className="w-16 h-16 rounded-2xl mx-auto shadow-lg" />
                <p className="text-white font-display font-bold text-lg mt-2">Install Wetigo</p>
              </div>
              <div className="p-5 space-y-3 text-sm text-[#2b2521]">
                <p className="text-[#6b6258]">Add Wetigo to your home screen — it opens full-screen like a real app.</p>
                <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#f1ebff] text-[#6200FF] flex items-center justify-center font-bold shrink-0">1</span> Tap the <b>Share</b> button <span className="text-[#6200FF]">⬆️</span> in Safari</div>
                <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#f1ebff] text-[#6200FF] flex items-center justify-center font-bold shrink-0">2</span> Choose <b>“Add to Home Screen”</b></div>
                <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-[#f1ebff] text-[#6200FF] flex items-center justify-center font-bold shrink-0">3</span> Tap <b>Add</b> — done! 🎉</div>
                <button onClick={() => setIosHelp(false)} className="w-full mt-2 py-3 rounded-2xl bg-[#6200FF] text-white font-semibold hover:bg-[#5400dd] transition-colors">Got it</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
