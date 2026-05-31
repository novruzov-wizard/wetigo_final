import { ShoppingCart, Heart, Plus, Star, MapPin, ArrowUpRight, Phone, Clock, Pizza, Coffee, ChevronRight, Compass, Building2, Dumbbell, ShoppingBag, Footprints, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';

interface HomePageProps {
  onSelectLocation: (id: number) => void;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onAddLocation: () => void;
}

export function HomePage({ onSelectLocation, onCategorySelect, onAddLocation }: HomePageProps) {
  const [activeCat, setActiveCat] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useStore();

  const categories = [
    { id: 'all', name: 'All', icon: Compass, tint: '#f1ebff', fg: '#6200FF', count: '3.2k' },
    { id: 'restaurant', name: 'Dining', icon: Pizza, tint: '#fef0e3', fg: '#c2853f', count: '1.2k' },
    { id: 'wedding', name: 'Wedding', icon: Building2, tint: '#fdeaf0', fg: '#c23f78', count: '320' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, tint: '#e4f5ec', fg: '#2f9461', count: '430' },
    { id: 'cafe', name: 'Cafes', icon: Coffee, tint: '#f6efd9', fg: '#b0902f', count: '880' },
    { id: 'beauty', name: 'Beauty', icon: Sparkles, tint: '#fbe7f0', fg: '#c23f96', count: '360' },
    { id: 'fashion', name: 'Fashion', icon: ShoppingBag, tint: '#ece4f7', fg: '#7a3fc2', count: '540' },
    { id: 'footwear', name: 'Footwear', icon: Footprints, tint: '#e2ecf7', fg: '#3f6fc2', count: '210' },
  ];

  const places = [
    { id: 1, name: 'The Grand Ballroom', cuisine: 'Elegant venue, fine dining & events', price: '$29', off: '15% Off', tint: '#fdeef2', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', rating: 4.8 },
    { id: 3, name: 'La Cucina Italiana', cuisine: 'Authentic pasta, wood-fired pizza', price: '$20', off: '12% Off', tint: '#fef4ea', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', rating: 4.9 },
    { id: 2, name: 'Fitness Plus Cafe', cuisine: 'Healthy bowls, smoothies & juices', price: '$35', off: '18% Off', tint: '#e9f7ef', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', rating: 4.6 },
  ];

  const recentReviews = [
    { id: 1, name: 'The Grand Ballroom', rating: 4.8, when: '2d ago', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=80&h=80&fit=crop' },
    { id: 3, name: 'La Cucina Italiana', rating: 4.9, when: '3d ago', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop' },
    { id: 2, name: 'Fitness Plus Gym', rating: 4.6, when: '5d ago', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop' },
  ];

  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* ===== MAIN COLUMN ===== */}
        <div className="space-y-6 min-w-0">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#efe6ff] to-[#e3d4ff] p-7 sm:p-9 flex items-center justify-between gap-6">
            <div className="relative z-10 max-w-sm">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b2521] leading-tight mb-2">All best places in one place</h2>
              <p className="text-sm text-[#6b6258] mb-5">Discover, review and share your favorite local spots.</p>
              <button
                onClick={() => onSearch('')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6200FF] text-white text-sm font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] transition-colors"
              >
                Explore now <ShoppingCart size={16} />
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
              alt="Featured"
              className="hidden sm:block w-44 h-32 object-cover rounded-2xl shadow-xl rotate-3"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#2b2521]">Browse by category</h3>
              <button onClick={() => onCategorySelect('all')} className="text-sm font-semibold text-[#6200FF] flex items-center gap-1">See all <ChevronRight size={15} /></button>
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
                      <p className="text-xs text-[#a89a8b]">{cat.count} places</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Place cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#2b2521]">Popular places</h3>
              <button onClick={() => onSearch('')} className="text-sm font-semibold text-[#6200FF] flex items-center gap-1">View all <ChevronRight size={15} /></button>
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
                    <p className="text-xs text-[#8a8175] line-clamp-2 text-left mb-3 leading-relaxed">{p.cuisine}</p>
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
              <h4 className="font-display font-bold text-[#2b2521]">Recent Reviews</h4>
              <button onClick={() => onSearch('')} className="text-xs font-semibold text-[#6200FF] flex items-center gap-1">View All <ArrowUpRight size={13} /></button>
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

          {/* Nearby map → opens Explore */}
          <button onClick={() => onSearch('')} className="w-full bg-white rounded-3xl border border-slate-100 p-5 text-left hover:shadow-lg transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-[#2b2521]">Nearby</h4>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#6200FF]">Open map <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
            </div>
            <div className="relative h-32 rounded-2xl overflow-hidden bg-[#eef1ee]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 130" preserveAspectRatio="none">
                <path d="M-10 40 Q 120 10 200 70 T 340 80" fill="none" stroke="#fff" strokeWidth="8" />
                <path d="M60 -10 Q 90 70 50 140" fill="none" stroke="#fff" strokeWidth="6" />
                <rect x="200" y="70" width="90" height="50" rx="8" fill="#dbe7da" />
              </svg>
              <span className="absolute left-[30%] top-[40%] w-3 h-3 rounded-full bg-[#6200FF] border-2 border-white shadow" />
              <span className="absolute left-[62%] top-[55%] w-3 h-3 rounded-full bg-rose-400 border-2 border-white shadow" />
              <span className="absolute left-[45%] top-[68%] w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow" />
              <span className="absolute inset-0 bg-[#6200FF]/0 group-hover:bg-[#6200FF]/5 transition-colors" />
            </div>
          </button>

          {/* Local guide */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/64?img=33" alt="Guide" className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-[#2b2521] text-sm">Robert Fox</p>
                <p className="text-xs text-[#a89a8b]">Local Guide</p>
              </div>
              <button onClick={() => flash('Calling Robert Fox…')} title="Call guide" className="w-9 h-9 rounded-full bg-[#f1ebff] flex items-center justify-center text-[#6200FF] hover:bg-[#e3d6ff] transition-colors">
                <Phone size={16} />
              </button>
              <button onClick={() => flash('Message sent to Robert Fox')} title="Message guide" className="w-9 h-9 rounded-full bg-[#f1ebff] flex items-center justify-center text-[#6200FF] hover:bg-[#e3d6ff] transition-colors">
                <MessageCircle size={16} />
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-[#6b6258]"><Clock size={15} className="text-[#6200FF]" /> <span className="font-medium text-[#2b2521]">30 Minutes</span> away</div>
              <div className="flex items-center gap-2 text-[#6b6258]"><MapPin size={15} className="text-[#6200FF]" /> 123 Main Street, Downtown</div>
            </div>
            <button onClick={onAddLocation} className="w-full mt-4 py-2.5 rounded-xl bg-[#6200FF] text-white text-sm font-semibold hover:bg-[#5400dd] transition-colors">
              Add a Place
            </button>
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
