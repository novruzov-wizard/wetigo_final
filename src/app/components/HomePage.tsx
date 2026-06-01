import { ShoppingCart, Heart, Plus, Star, MapPin, ArrowUpRight, Pizza, Coffee, ChevronRight, Compass, Building2, Dumbbell, ShoppingBag, Footprints, Sparkles, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { distanceKm } from '../data/places';
import { useRef } from 'react';

declare const L: any;

interface HomePageProps {
  onSelectLocation: (id: number) => void;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onAddLocation: () => void;
}

export function HomePage({ onSelectLocation, onCategorySelect, onAddLocation }: HomePageProps) {
  const [activeCat, setActiveCat] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, t, places: PLACES } = useStore();

  // real counts from loaded places
  const countFor = (id: string) => id === 'all' ? PLACES.length : PLACES.filter((p) => p.categoryId === id).length;
  const categories = [
    { id: 'all', name: 'All', icon: Compass, tint: '#f1ebff', fg: '#6200FF' },
    { id: 'restaurant', name: 'Dining', icon: Pizza, tint: '#fef0e3', fg: '#c2853f' },
    { id: 'cafe', name: 'Cafes', icon: Coffee, tint: '#f6efd9', fg: '#b0902f' },
    { id: 'fashion', name: 'Fashion', icon: ShoppingBag, tint: '#ece4f7', fg: '#7a3fc2' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, tint: '#e4f5ec', fg: '#2f9461' },
    { id: 'beauty', name: 'Beauty', icon: Sparkles, tint: '#fbe7f0', fg: '#c23f96' },
    { id: 'footwear', name: 'Footwear', icon: Footprints, tint: '#e2ecf7', fg: '#3f6fc2' },
    { id: 'entertainment', name: 'Fun', icon: Building2, tint: '#fdeaf0', fg: '#c23f78' },
  ].map((c) => ({ ...c, count: String(countFor(c.id)) }));

  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLoc({ lat: 40.3777, lng: 49.892 }), // fallback: Baku
      { timeout: 8000 }
    );
  }, []);

  const offers = ['15% Off', '12% Off', '18% Off'];
  const tints = ['#fdeef2', '#fef4ea', '#e9f7ef'];
  const places = PLACES.slice(0, 3).map((p, i) => ({ ...p, off: offers[i], tint: tints[i] }));
  const recentReviews = PLACES.slice(0, 3).map((p, i) => ({ id: p.id, name: p.name, rating: p.rating, when: `${i + 2}d ago`, img: `${p.image}` }));

  // nearest real place to the user
  const ranked = userLoc ? [...PLACES].map((p) => ({ p, d: distanceKm(userLoc.lat, userLoc.lng, p.lat, p.lng) })).sort((a, b) => a.d - b.d) : [];
  const nearest = ranked[0];
  const fmtDist = (d: number) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`);

  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };

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
                  {t('home.exploreNow')} <ShoppingCart size={16} />
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

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#2b2521]">{t('home.browse')}</h3>
              <button onClick={() => onCategorySelect('all')} className="text-sm font-semibold text-[#6200FF] flex items-center gap-1">{t('home.seeAll')} <ChevronRight size={15} /></button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCat === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ y: -3 }}
                    onClick={() => { setActiveCat(cat.id); onCategorySelect(cat.id); }}
                    className="shrink-0 w-[112px] rounded-2xl border p-3.5 flex flex-col items-start gap-2.5 transition-all"
                    style={isActive
                      ? { backgroundColor: '#fff', borderColor: '#6200FF', boxShadow: '0 10px 24px -10px rgba(98,0,255,0.4)' }
                      : { backgroundColor: '#fff', borderColor: '#eceae6' }}
                  >
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.tint }}>
                      <Icon size={20} style={{ color: cat.fg }} />
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: isActive ? '#6200FF' : '#2b2521' }}>{cat.name}</p>
                      <p className="text-xs text-[#a89a8b]">{cat.count} {t('common.places')}</p>
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
                    <span className="text-xs font-semibold text-[#6200FF] bg-white/70 px-2.5 py-1 rounded-full">{p.off}</span>
                    <button onClick={() => toggleFavorite(p.id)} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-rose-400 hover:text-rose-500" title="Save place">
                      <Heart size={15} className={isFavorite(p.id) ? 'fill-rose-500 text-rose-500' : ''} />
                    </button>
                  </div>
                  <button onClick={() => onSelectLocation(p.id)} className="block w-full">
                    <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-2xl mb-3" />
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-semibold text-[#2b2521] line-clamp-1 text-left">{p.name}</h4>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 shrink-0"><Star size={12} className="fill-amber-500 text-amber-500" />{p.rating}</span>
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
                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">{t('app.soon')}</span>
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
                  {/* App Store badge */}
                  <span className="flex items-center gap-2.5 bg-black text-white pl-3 pr-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.5 1.6c0 1.1-.4 2.1-1.2 2.9-.9.9-2 1.5-3.1 1.4-.1-1.1.4-2.2 1.1-2.9.8-.9 2.1-1.5 3.2-1.4ZM20.3 17c-.5 1.2-.8 1.7-1.5 2.8-1 1.5-2.4 3.4-4.1 3.4-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.2-2.8-4.3-3.1-9.3-1.4-12 1.2-1.9 3.1-3 4.9-3 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-3.9 2.2-3.3 7.8.3 9.6Z"/></svg>
                    <span className="text-left leading-none"><span className="block text-[9px] text-white/70">Download on the</span><span className="block text-sm font-semibold">App Store</span></span>
                  </span>
                  {/* Google Play badge */}
                  <span className="flex items-center gap-2.5 bg-black text-white pl-3 pr-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                    <svg width="18" height="20" viewBox="0 0 24 24"><path fill="#34A853" d="M3.6 2.3 13.4 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Z"/><path fill="#4285F4" d="M16.9 8.5 13.4 12 3.9 2.1c.1 0 .3 0 .5.1l12.5 6.3Z"/><path fill="#FBBC04" d="m16.9 15.5-3.5-3.5 3.5-3.5 3.2 1.6c.9.5.9 1.8 0 2.3l-3.2 1.6Z"/><path fill="#EA4335" d="M3.9 21.9 13.4 12l3.5 3.5-12.5 6.3c-.2.1-.4.1-.5.1Z"/></svg>
                    <span className="text-left leading-none"><span className="block text-[9px] text-white/70">GET IT ON</span><span className="block text-sm font-semibold">Google Play</span></span>
                  </span>
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
            <p className="font-display text-xl tracking-widest mb-6">8763 2736 9873 0329</p>
            <div className="flex items-end justify-between text-xs">
              <div>
                <p className="text-white/60 mb-0.5">Card Holder</p>
                <p className="font-semibold tracking-wide">JHON SMITH</p>
              </div>
              <div>
                <p className="text-white/60 mb-0.5">Expires</p>
                <p className="font-semibold">10/28</p>
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
                  <span className="flex items-center gap-0.5 text-sm font-semibold text-amber-600"><Star size={12} className="fill-amber-500 text-amber-500" />{o.rating}</span>
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
                    <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={nearest.p.open ? { background: '#dff0e6', color: '#2f9461' } : { background: '#fdecec', color: '#c2603f' }}>{nearest.p.open ? t('common.open') : t('common.closed')}</span>
                  </div>
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-[#2b2521] text-sm line-clamp-1">{nearest.p.name}</p>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600"><Star size={12} className="fill-amber-500 text-amber-500" />{nearest.p.rating}</span>
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
    </div>
  );
}
