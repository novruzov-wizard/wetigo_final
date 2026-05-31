import { Search, MapPin, Star, X, LayoutGrid, Map as MapIcon, Clock, Navigation, Crosshair, Bookmark, BadgeCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PLACES, distanceKm, type Place } from '../data/places';

declare const L: any;

interface SearchPageProps {
  onSelectLocation: (id: number) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export function SearchPage({ onSelectLocation, initialQuery = '', initialCategory = 'all' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState(0);
  const [view, setView] = useState<'list' | 'map'>('map');
  const [openNow, setOpenNow] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [tracked, setTracked] = useState<number[]>([]);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => setSearchQuery(initialQuery), [initialQuery]);
  useEffect(() => setSelectedCategory(initialCategory), [initialCategory]);

  const categories = [
    { id: 'all', name: 'All' }, { id: 'wedding', name: 'Wedding' }, { id: 'restaurant', name: 'Dining' },
    { id: 'fashion', name: 'Fashion' }, { id: 'footwear', name: 'Footwear' }, { id: 'fitness', name: 'Fitness' }, { id: 'beauty', name: 'Beauty' },
  ];

  // ---- filter + premium-first sort ----
  let results: Place[] = PLACES.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesRating = p.rating >= minRating;
    const matchesOpen = !openNow || p.open;
    return matchesSearch && matchesCategory && matchesRating && matchesOpen;
  });
  results = [...results].sort((a, b) => {
    if (topRated) return b.rating - a.rating;
    if (a.premium !== b.premium) return a.premium ? -1 : 1; // promoted first
    return b.rating - a.rating;
  });

  const distOf = (p: Place) => (userLoc ? distanceKm(userLoc.lat, userLoc.lng, p.lat, p.lng) : null);
  const fmtDist = (d: number | null) => (d == null ? null : d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`);

  const toggleTrack = (id: number) => setTracked((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { setUserLoc({ lat: 39.5, lng: -98.35 }); setLocating(false); }, // fallback: US center
      { timeout: 8000 }
    );
  };

  const clearFilters = () => { setSelectedCategory('all'); setMinRating(0); setSearchQuery(''); setOpenNow(false); setTopRated(false); };
  const hasFilters = selectedCategory !== 'all' || minRating > 0 || searchQuery !== '' || openNow || topRated;

  // ---- Leaflet map ----
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (view !== 'map' || !mapEl.current || typeof L === 'undefined') return;
    if (!mapRef.current) {
      mapRef.current = L.map(mapEl.current, { zoomControl: false, attributionControl: false }).setView([39.5, -98.35], 4);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapRef.current);
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }
    const map = mapRef.current;
    setTimeout(() => map.invalidateSize(), 100);

    markersRef.current.forEach((m) => map.removeLayer(m.marker));
    markersRef.current = [];

    results.forEach((p) => {
      const isSel = selected === p.id;
      const bg = p.premium ? '#6200FF' : '#ffffff';
      const fg = p.premium ? '#ffffff' : '#2b2521';
      const icon = L.divIcon({
        className: 'wetigo-pin',
        html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;${isSel ? 'filter:drop-shadow(0 6px 10px rgba(98,0,255,.45));' : ''}">
          <div style="display:flex;align-items:center;gap:3px;background:${isSel ? '#6200FF' : bg};color:${isSel ? '#fff' : fg};padding:4px 8px;border-radius:999px;font:700 11px Inter,sans-serif;box-shadow:0 4px 10px rgba(0,0,0,.15);white-space:nowrap">
            ${p.premium ? '★ ' : ''}${p.rating}
          </div>
          <div style="width:10px;height:10px;background:${isSel ? '#6200FF' : bg};transform:rotate(45deg);margin-top:-5px;box-shadow:0 4px 6px rgba(0,0,0,.1)"></div>
        </div>`,
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      const dist = distOf(p);
      const distHtml = dist != null ? `<span style="color:#6200FF;font-weight:600"> · ${fmtDist(dist)}</span>` : '';
      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif">
           <div style="position:relative;height:104px"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover"/>
             ${p.premium ? '<span style="position:absolute;top:8px;left:8px;background:#6200FF;color:#fff;font:700 10px Inter;padding:3px 8px;border-radius:999px">★ Promoted</span>' : ''}
           </div>
           <div style="padding:10px 12px">
             <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
               <span style="font-weight:700;font-size:13px;color:#2b2521">${p.name}</span>
               <span style="font-weight:700;font-size:12px;color:#d97706">★ ${p.rating}</span>
             </div>
             <div style="font-size:11px;color:#8a7d72;margin-top:2px">${p.category}</div>
             <div style="font-size:11px;color:#a89a8b;margin-top:4px">📍 ${p.city}${distHtml}</div>
           </div>
         </div>`,
        { className: 'wetigo-popup', closeButton: false, offset: [0, -12] }
      );
      marker.on('mouseover', () => marker.openPopup());
      marker.on('click', () => { setSelected(p.id); onSelectLocation(p.id); });
      markersRef.current.push({ id: p.id, marker });
    });

    if (userLoc) {
      if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
      const uIcon = L.divIcon({ className: 'wetigo-pin', html: `<div style="transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:#6200FF;border:3px solid #fff;box-shadow:0 0 0 6px rgba(98,0,255,.2)"></div>` });
      userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng], { icon: uIcon }).addTo(map);
    }
  }, [view, results.map((r) => r.id).join(','), selected, userLoc]);

  // pan to selected / user + open its popup
  useEffect(() => {
    if (view === 'map' && mapRef.current && selected != null) {
      const p = results.find((r) => r.id === selected);
      if (p) mapRef.current.panTo([p.lat, p.lng], { animate: true });
      const entry = markersRef.current.find((m) => m.id === selected);
      if (entry) entry.marker.openPopup();
    }
  }, [selected]);
  useEffect(() => {
    if (view === 'map' && mapRef.current && userLoc) mapRef.current.flyTo([userLoc.lat, userLoc.lng], 11);
  }, [userLoc]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-6">
      {/* top controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search businesses, locations..." className="w-full pl-12 pr-4 py-3.5 bg-transparent text-[#2b2521] placeholder:text-slate-400 focus:outline-none rounded-2xl" />
        </div>
        <button onClick={useMyLocation} className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-[#2b2521] hover:border-[#6200FF] hover:text-[#6200FF] transition-colors shrink-0">
          <Crosshair size={17} className={locating ? 'animate-spin' : ''} /> {userLoc ? 'Located' : 'Use my location'}
        </button>
        <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-200 p-1 shadow-sm shrink-0">
          {([['map', MapIcon, 'Map'], ['list', LayoutGrid, 'List']] as const).map(([id, Icon, label]) => (
            <button key={id} onClick={() => setView(id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={view === id ? { backgroundColor: '#6200FF', color: '#fff' } : { color: '#8a7d72' }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* quick chips */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <button onClick={() => setOpenNow(!openNow)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors shrink-0" style={openNow ? { background: '#2b2521', color: '#fff', borderColor: '#2b2521' } : { background: '#fff', color: '#5c524a', borderColor: '#e5e7eb' }}><Clock size={15} /> Open now</button>
        <button onClick={() => setTopRated(!topRated)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors shrink-0" style={topRated ? { background: '#2b2521', color: '#fff', borderColor: '#2b2521' } : { background: '#fff', color: '#5c524a', borderColor: '#e5e7eb' }}><Star size={15} /> Top rated</button>
        {categories.slice(1).map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)} className="px-3.5 py-2 rounded-full text-sm font-medium border transition-colors shrink-0" style={selectedCategory === cat.id ? { background: '#6200FF', color: '#fff', borderColor: '#6200FF' } : { background: '#fff', color: '#5c524a', borderColor: '#e5e7eb' }}>{cat.name}</button>
        ))}
        {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-700 shrink-0"><X size={15} /> Clear</button>}
      </div>

      <p className="text-sm text-[#8a7d72] mb-4 font-medium">{results.length} {results.length === 1 ? 'place' : 'places'} found{userLoc ? ' · sorted by relevance' : ''}{tracked.length ? ` · ${tracked.length} tracked` : ''}</p>

      {view === 'map' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: cards grid */}
          <div className="grid sm:grid-cols-2 gap-4 content-start">
            {results.map((p) => (
              <motion.div
                key={p.id}
                layout
                onMouseEnter={() => setSelected(p.id)}
                onClick={() => setSelected(p.id)}
                className="cursor-pointer bg-white rounded-2xl border overflow-hidden transition-all"
                style={selected === p.id ? { borderColor: '#6200FF', boxShadow: '0 12px 28px -12px rgba(98,0,255,.35)' } : { borderColor: '#ececec' }}
              >
                <div className="relative h-32">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  {p.premium && <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white bg-[#6200FF] px-2 py-0.5 rounded-full shadow">★ Promoted</span>}
                  <button onClick={(e) => { e.stopPropagation(); toggleTrack(p.id); }} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                    <Bookmark size={14} className={tracked.includes(p.id) ? 'fill-[#6200FF] text-[#6200FF]' : 'text-[#6b6258]'} />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={p.open ? { background: '#dff0e6', color: '#2f9461' } : { background: '#fdecec', color: '#c2603f' }}>{p.open ? 'Open now' : 'Closed'}</span>
                </div>
                <div className="p-3.5" onClick={() => onSelectLocation(p.id)}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display font-semibold text-[#2b2521] text-sm leading-tight line-clamp-1 flex items-center gap-1">{p.name}{p.verified && <BadgeCheck size={13} className="text-[#6200FF] shrink-0" />}</h4>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 shrink-0"><Star size={11} className="fill-amber-500 text-amber-500" />{p.rating}</span>
                  </div>
                  <p className="text-xs text-[#8a7d72] line-clamp-1 mb-2.5">{p.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a89a8b] flex items-center gap-1 line-clamp-1"><MapPin size={11} className="text-[#6200FF]" />{p.city}</span>
                    <span className="font-display font-bold text-sm text-[#2b2521]">{p.price}{distOf(p) != null && <span className="text-[10px] font-medium text-[#6200FF] ml-1">{fmtDist(distOf(p))}</span>}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: sticky map (preview shows as a popup anchored to the pin) */}
          <div className="lg:sticky lg:top-4 h-[480px] lg:h-[640px] relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div ref={mapEl} className="absolute inset-0 z-0" />
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200"><p className="text-[#2b2521] font-medium mb-1">No results found</p><p className="text-sm text-[#8a7d72]">Try adjusting your filters.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-300 overflow-hidden group border border-[#efe6d9]">
              <button onClick={() => onSelectLocation(p.id)} className="block w-full text-left">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.premium && <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-[#6200FF] px-2.5 py-1 rounded-full shadow">★ Promoted</span>}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-lg"><Star size={13} className="text-amber-500 fill-amber-500" /><span className="text-sm font-bold">{p.rating}</span></div>
                </div>
              </button>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-display text-xl font-semibold text-[#2b2521] line-clamp-1 flex items-center gap-1">{p.name} {p.verified && <BadgeCheck size={16} className="text-[#6200FF]" />}</h3>
                  <button onClick={() => toggleTrack(p.id)} className="p-1.5 rounded-lg hover:bg-[#f1ebff] shrink-0"><Bookmark size={17} className={tracked.includes(p.id) ? 'fill-[#6200FF] text-[#6200FF]' : 'text-[#a89a8b]'} /></button>
                </div>
                <p className="text-sm text-[#8a7d72] mb-3">{p.category} · {p.price} · {p.reviews} reviews</p>
                <div className="flex items-center gap-1.5 text-sm text-[#a89a8b]"><MapPin size={15} className="text-[#6200FF]" /><span className="line-clamp-1">{p.city}</span>{distOf(p) != null && <span className="text-[#6200FF] font-semibold">· {fmtDist(distOf(p))}</span>}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
