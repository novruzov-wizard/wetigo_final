import { Heart, MapPin, Star, Trash2, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PLACES } from '../data/places';
import { useStore } from '../store';

interface FavoritesPageProps {
  onSelectLocation: (id: number) => void;
}

export function FavoritesPage({ onSelectLocation }: FavoritesPageProps) {
  const { favorites, toggleFavorite } = useStore();
  const saved = PLACES.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Heart className="text-white fill-white" size={24} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#2b2521]">Saved Places</h1>
            <p className="text-slate-500 text-sm">{saved.length} {saved.length === 1 ? 'place' : 'places'} saved</p>
          </div>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Heart size={48} className="text-slate-300" />
          </div>
          <p className="text-slate-700 mb-2 font-medium">No saved places yet</p>
          <p className="text-sm text-slate-500">Tap the bookmark on any place to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {saved.map((place, idx) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-slate-100"
              >
                <button onClick={() => onSelectLocation(place.id)} className="block w-full text-left">
                  <div className="relative h-40 overflow-hidden">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {place.premium && <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-[#6200FF] px-2.5 py-1 rounded-full shadow">★ Promoted</span>}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-lg">
                      <Star size={13} className="text-amber-500 fill-amber-500" /><span className="text-sm font-bold">{place.rating}</span>
                    </div>
                  </div>
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-[#2b2521] line-clamp-1 flex items-center gap-1">{place.name}{place.verified && <BadgeCheck size={15} className="text-[#6200FF] shrink-0" />}</h3>
                    <button onClick={() => toggleFavorite(place.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 shrink-0" title="Remove from saved">
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{place.category}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={12} className="text-[#6200FF]" /><span className="line-clamp-1">{place.city}</span></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
