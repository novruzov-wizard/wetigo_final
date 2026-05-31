import { ShoppingCart, Heart, Plus, Star, MapPin, ArrowUpRight, Phone, Clock, UtensilsCrossed, Pizza, Coffee, Sandwich, Salad, IceCream, Soup, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface HomePageProps {
  onSelectLocation: (id: number) => void;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onAddLocation: () => void;
}

export function HomePage({ onSelectLocation, onCategorySelect, onAddLocation }: HomePageProps) {
  const [activeCat, setActiveCat] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: UtensilsCrossed },
    { id: 'fries', name: 'Fries', icon: Soup },
    { id: 'dining', name: 'Dining', icon: Pizza },
    { id: 'cafe', name: 'Cafes', icon: Coffee },
    { id: 'sushi', name: 'Sushi', icon: Salad },
    { id: 'dessert', name: 'Dessert', icon: IceCream },
    { id: 'sandwich', name: 'Brunch', icon: Sandwich },
  ];

  const places = [
    { id: 1, name: 'The Grand Ballroom', cuisine: 'Elegant venue, fine dining & events', price: '$29', off: '15% Off', tint: '#fdeef2', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', rating: 4.8 },
    { id: 3, name: 'La Cucina Italiana', cuisine: 'Authentic pasta, wood-fired pizza', price: '$20', off: '12% Off', tint: '#fef4ea', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', rating: 4.9 },
    { id: 2, name: 'Fitness Plus Cafe', cuisine: 'Healthy bowls, smoothies & juices', price: '$35', off: '18% Off', tint: '#e9f7ef', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', rating: 4.6 },
  ];

  const orderMenu = [
    { name: 'The Grand Ballroom', price: '$3.49', qty: 'x3', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=80&h=80&fit=crop' },
    { name: 'La Cucina Italiana', price: '$7.49', qty: 'x2', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop' },
    { name: 'Fitness Plus Cafe', price: '$5.49', qty: 'x1', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop' },
  ];

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
            <h3 className="font-display text-lg font-bold text-[#2b2521] mb-4">Categories</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); onCategorySelect(cat.id); }}
                    className="shrink-0 w-[88px] rounded-2xl border p-3 flex flex-col items-center gap-2 transition-all"
                    style={isActive
                      ? { backgroundColor: '#fff', borderColor: '#6200FF', boxShadow: '0 8px 20px -8px rgba(98,0,255,0.35)' }
                      : { backgroundColor: '#fff', borderColor: '#ede9e2' }}
                  >
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: isActive ? '#f1ebff' : '#f6f4ef' }}>
                      <Icon size={20} style={{ color: isActive ? '#6200FF' : '#9b9287' }} />
                    </span>
                    <span className="text-xs font-medium" style={{ color: isActive ? '#6200FF' : '#6b6258' }}>{cat.name}</span>
                  </button>
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
                    <button className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-rose-400 hover:text-rose-500">
                      <Heart size={15} />
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

          {/* Order menu */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-[#2b2521]">Recent Reviews</h4>
              <button className="text-xs font-semibold text-[#6200FF] flex items-center gap-1">View All <ArrowUpRight size={13} /></button>
            </div>
            <div className="space-y-4">
              {orderMenu.map((o, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={o.img} alt={o.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2b2521] line-clamp-1">{o.name}</p>
                    <p className="text-xs text-[#a89a8b]">{o.price}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#6b6258]">{o.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-[#2b2521]">Nearby</h4>
              <ArrowUpRight size={15} className="text-[#6200FF]" />
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
            </div>
          </div>

          {/* Delivery person */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/64?img=33" alt="Guide" className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-[#2b2521] text-sm">Robert Fox</p>
                <p className="text-xs text-[#a89a8b]">Local Guide</p>
              </div>
              <button className="w-9 h-9 rounded-full bg-[#f1ebff] flex items-center justify-center text-[#6200FF]">
                <Phone size={16} />
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-[#6b6258]">
                <Clock size={15} className="text-[#6200FF]" /> <span className="font-medium text-[#2b2521]">30 Minutes</span> away
              </div>
              <div className="flex items-center gap-2 text-[#6b6258]">
                <MapPin size={15} className="text-[#6200FF]" /> 123 Main Street, Downtown
              </div>
            </div>
            <button onClick={onAddLocation} className="w-full mt-4 py-2.5 rounded-xl bg-[#6200FF] text-white text-sm font-semibold hover:bg-[#5400dd] transition-colors">
              Add a Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
