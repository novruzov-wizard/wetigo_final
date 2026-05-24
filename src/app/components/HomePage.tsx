import { Search, MapPin, Star, TrendingUp, Plus, Building2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface HomePageProps {
  onSelectLocation: (id: number) => void;
  onCategorySelect: (category: string) => void;
  onAddLocation: () => void;
}

export function HomePage({ onSelectLocation, onCategorySelect, onAddLocation }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'wedding', name: 'Wedding Venues', icon: Building2, color: 'from-rose-500 to-pink-600' },
    { id: 'restaurant', name: 'Restaurants', icon: Building2, color: 'from-orange-500 to-amber-600' },
    { id: 'fashion', name: 'Fashion', icon: Building2, color: 'from-violet-500 to-purple-600' },
    { id: 'footwear', name: 'Footwear', icon: Building2, color: 'from-sky-500 to-blue-600' },
    { id: 'fitness', name: 'Fitness', icon: Building2, color: 'from-emerald-500 to-green-600' },
    { id: 'cafe', name: 'Cafes', icon: Building2, color: 'from-amber-500 to-yellow-600' },
    { id: 'beauty', name: 'Beauty & Spa', icon: Building2, color: 'from-pink-500 to-rose-600' },
    { id: 'entertainment', name: 'Entertainment', icon: Building2, color: 'from-indigo-500 to-blue-600' },
  ];

  const trending = [
    {
      id: 1,
      name: 'The Grand Ballroom',
      category: 'Wedding Venue',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c68b?w=400&h=300&fit=crop',
      location: 'Downtown, New York',
      verified: true,
    },
    {
      id: 2,
      name: 'Fitness Plus Gym',
      category: 'Fitness Center',
      rating: 4.6,
      reviews: 456,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      location: 'North Plaza, LA',
      verified: true,
    },
    {
      id: 3,
      name: 'La Cucina Italiana',
      category: 'Italian Restaurant',
      rating: 4.9,
      reviews: 789,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      location: 'City Center, Chicago',
      verified: true,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 px-5 pt-16 pb-8 rounded-b-[40px] shadow-xl shadow-blue-600/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl text-white mb-1">WeToGo</h1>
              <p className="text-blue-100 text-sm">Discover trusted local businesses</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onAddLocation}
              className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-lg hover:bg-white/30 transition-colors"
            >
              <Plus size={24} className="text-white" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search businesses, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="px-5 py-6">
        <h2 className="text-lg text-slate-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategorySelect(category.id)}
                className="group"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 mb-2 aspect-square flex items-center justify-center`}>
                  <Icon size={28} className="text-white" strokeWidth={2} />
                </div>
                <p className="text-xs text-slate-700 text-center leading-tight">{category.name}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Trending */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            <h2 className="text-lg text-slate-900">Trending Near You</h2>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
        </div>

        <div className="space-y-3">
          {trending.map((place, idx) => (
            <motion.button
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLocation(place.id)}
              className="w-full bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="flex gap-3 p-3">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {place.verified && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left py-1">
                  <h3 className="text-slate-900 font-semibold mb-1 line-clamp-1">{place.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{place.category}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs text-amber-700 font-semibold">{place.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">({place.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span className="line-clamp-1">{place.location}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
