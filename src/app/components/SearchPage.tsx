import { Search, MapPin, Star, SlidersHorizontal, X, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchPageProps {
  onSelectLocation: (id: number) => void;
}

export function SearchPage({ onSelectLocation }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'restaurant', name: 'Dining' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'beauty', name: 'Beauty' },
  ];

  const countries = [
    { id: 'all', name: 'All Countries', flag: '🌍' },
    { id: 'us', name: 'United States', flag: '🇺🇸' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'ca', name: 'Canada', flag: '🇨🇦' },
    { id: 'au', name: 'Australia', flag: '🇦🇺' },
  ];

  const results = [
    {
      id: 1,
      name: 'The Grand Ballroom',
      category: 'Wedding Venue',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c68b?w=400&h=300&fit=crop',
      location: 'New York, USA',
      price: '$$$',
      verified: true,
    },
    {
      id: 2,
      name: 'Fitness Plus Gym',
      category: 'Fitness Center',
      rating: 4.6,
      reviews: 456,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
      location: 'Los Angeles, USA',
      price: '$$',
      verified: true,
    },
    {
      id: 3,
      name: 'La Cucina Italiana',
      category: 'Italian Restaurant',
      rating: 4.9,
      reviews: 789,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      location: 'Chicago, USA',
      price: '$$$',
      verified: true,
    },
    {
      id: 4,
      name: 'Urban Boutique',
      category: 'Fashion Store',
      rating: 4.7,
      reviews: 321,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      location: 'Miami, USA',
      price: '$$',
      verified: false,
    },
    {
      id: 5,
      name: 'Sneaker Palace',
      category: 'Footwear Store',
      rating: 4.5,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
      location: 'Boston, USA',
      price: '$$',
      verified: true,
    },
  ];

  const filteredResults = results.filter((result) => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || result.category.toLowerCase().includes(selectedCategory);
    const matchesRating = result.rating >= minRating;
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 py-4 pt-16 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search Bar */}
          <div className="relative bg-slate-100 rounded-2xl overflow-hidden mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search businesses, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shrink-0 text-sm font-medium shadow-sm"
            >
              <Filter size={16} />
              Filters
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl shrink-0 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 overflow-hidden"
          >
            <div className="bg-white rounded-3xl border border-slate-200 p-5 mb-4 mt-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Filter Options</h3>
                <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2 font-medium">Country/Region</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2 font-medium">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="px-5 py-4">
        <p className="text-sm text-slate-600 mb-4 font-medium">
          {filteredResults.length} {filteredResults.length === 1 ? 'Business' : 'Businesses'} Found
        </p>
        <div className="space-y-3">
          {filteredResults.map((place, idx) => (
            <motion.button
              key={place.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
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
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1 pr-2">{place.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs text-amber-700 font-semibold">{place.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{place.category}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-lg text-slate-600 font-medium">
                      {place.price}
                    </span>
                    <span className="text-xs text-slate-500">({place.reviews} reviews)</span>
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
