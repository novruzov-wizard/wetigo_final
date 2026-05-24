import { ArrowLeft, Star, MapPin, Phone, Clock, Heart, Share2, MessageCircle, Globe, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LocationDetailProps {
  locationId: number;
  onBack: () => void;
  onStartChat: () => void;
}

export function LocationDetail({ onBack, onStartChat }: LocationDetailProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  const location = {
    name: 'The Grand Ballroom',
    category: 'Wedding Venue',
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c68b?w=800&h=600&fit=crop',
    address: '123 Main Street, Downtown',
    phone: '+1 234 567 8900',
    hours: 'Mon-Sun: 9:00 AM - 11:00 PM',
    website: 'www.grandballroom.com',
    description: 'Elegant wedding venue with stunning architecture and world-class service. Perfect for your special day with capacity for up to 300 guests.',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f29da8c68b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    ],
  };

  const reviews = [
    {
      id: 1,
      user: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely stunning venue! Our wedding was perfect here. The staff was professional and accommodating.',
      date: '2 weeks ago',
      avatar: '👰',
    },
    {
      id: 2,
      user: 'Michael Chen',
      rating: 4,
      comment: 'Great service and beautiful location. Highly recommended for special events!',
      date: '1 month ago',
      avatar: '🤵',
    },
    {
      id: 3,
      user: 'Emma Williams',
      rating: 5,
      comment: 'The team was amazing and very accommodating. Every detail was perfect. Worth every penny!',
      date: '2 months ago',
      avatar: '💁',
    },
  ];

  const handleSubmitReview = () => {
    if (userRating > 0 && comment.trim()) {
      alert('Review submitted successfully! Thank you for your feedback.');
      setUserRating(0);
      setComment('');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 pb-6">
      {/* Header Image */}
      <div className="relative h-80">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-16 left-5 bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-900" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-16 right-5 bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl hover:bg-white transition-colors"
        >
          <Heart
            size={24}
            className={`transition-all duration-300 ${isFavorited ? 'text-rose-500 fill-rose-500' : 'text-slate-900'}`}
          />
        </motion.button>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl text-white">{location.name}</h1>
                {location.verified && (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    <CheckCircle size={16} className="text-white fill-white" />
                  </div>
                )}
              </div>
              <p className="text-slate-200 text-sm">{location.category}</p>
            </div>
            <div className="bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/50 flex items-center gap-2 shadow-xl shrink-0">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span className="text-xl text-slate-900 font-semibold">{location.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 -mt-4 mb-6 relative z-10">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onStartChat}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 shadow-lg font-semibold"
          >
            <MessageCircle size={20} />
            Join Community
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="bg-white text-slate-700 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 shadow-lg border border-slate-200"
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-md flex gap-1">
          {(['about', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 py-2.5 rounded-xl transition-all duration-300"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 font-semibold transition-colors ${
                activeTab === tab ? 'text-white' : 'text-slate-600'
              }`}>
                {tab === 'about' ? 'About' : `Reviews (${location.reviewCount})`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-5 space-y-4"
          >
            {/* Description */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
              <h3 className="font-semibold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-700 leading-relaxed">{location.description}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
              <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Address</p>
                  <p className="text-slate-900 font-medium">{location.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="text-slate-900 font-medium">{location.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Clock size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Hours</p>
                  <p className="text-slate-900 font-medium">{location.hours}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Globe size={18} className="text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Website</p>
                  <p className="text-cyan-600 font-medium">{location.website}</p>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {location.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Location</h3>
              <div className="bg-white rounded-3xl h-56 flex items-center justify-center border border-slate-200 shadow-md">
                <div className="text-center">
                  <MapPin size={48} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Interactive map view</p>
                  <p className="text-sm text-slate-400">Maps integration coming soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-5 space-y-4"
          >
            {/* Add Review */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
              <h3 className="font-semibold text-slate-900 mb-4">Write a Review</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-700 font-medium">Your Rating:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={26}
                        className={
                          star <= userRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 resize-none"
                rows={3}
              />
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitReview}
                disabled={userRating === 0 || !comment.trim()}
                className="w-full bg-blue-600 text-white py-3.5 rounded-2xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-md font-semibold"
              >
                Submit Review
              </motion.button>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl text-2xl">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{review.user}</span>
                        <span className="text-xs text-slate-500">{review.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-amber-500 fill-amber-500"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
