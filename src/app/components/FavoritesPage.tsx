import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FavoritesPageProps {
  onSelectLocation: (id: number) => void;
}

export function FavoritesPage({ onSelectLocation }: FavoritesPageProps) {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'The Grand Ballroom',
      category: 'Wedding Venue',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
      location: 'Downtown, New York',
      verified: true,
    },
    {
      id: 2,
      name: 'Fitness Plus Gym',
      category: 'Fitness Center',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      location: 'North Plaza, LA',
      verified: true,
    },
    {
      id: 3,
      name: 'Urban Boutique',
      category: 'Fashion Store',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      location: 'Fashion District, Miami',
      verified: false,
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Heart className="text-white fill-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl text-slate-900">Saved Places</h1>
              <p className="text-slate-600 text-sm">
                {favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Favorites List */}
      <div>
        <AnimatePresence>
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Heart size={48} className="text-slate-300" />
              </div>
              <p className="text-slate-700 mb-2 font-medium">No saved places yet</p>
              <p className="text-sm text-slate-500">
                Start exploring and save your favorite businesses!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((place, idx) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="flex gap-3 p-3">
                    <button
                      onClick={() => onSelectLocation(place.id)}
                      className="shrink-0"
                    >
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {place.verified && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#6200FF] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                    <div className="flex-1 min-w-0 py-1">
                      <button
                        onClick={() => onSelectLocation(place.id)}
                        className="text-left w-full"
                      >
                        <h3 className="font-semibold text-slate-900 line-clamp-1 mb-1">
                          {place.name}
                        </h3>
                        <p className="text-xs text-slate-600 mb-2">{place.category}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs text-amber-700 font-semibold">{place.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} />
                          <span className="line-clamp-1">{place.location}</span>
                        </div>
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFavorite(place.id)}
                      className="self-start p-3 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
