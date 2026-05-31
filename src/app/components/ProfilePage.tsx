import { Crown, MapPin, Star, Heart, Bell, LogOut, Plus, Globe, Languages } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ProfilePageProps {
  onShowSubscription: () => void;
  onAddLocation: () => void;
  onSignOut: () => void;
}

export function ProfilePage({ onShowSubscription, onAddLocation, onSignOut }: ProfilePageProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('us');

  const user = {
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    avatar: '👤',
    joinDate: 'January 2026',
    stats: {
      reviews: 24,
      favorites: 18,
      plans: 12,
    },
  };

  const recentActivity = [
    {
      id: 1,
      type: 'review',
      place: 'The Grand Ballroom',
      action: 'Left a 5-star review',
      time: '2 days ago',
      icon: Star,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: 2,
      type: 'favorite',
      place: 'Fitness Plus Gym',
      action: 'Saved to favorites',
      time: '5 days ago',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 3,
      type: 'plan',
      place: 'La Cucina Italiana',
      action: 'Created a visit plan',
      time: '1 week ago',
      icon: MapPin,
      color: 'from-[#6200FF] to-[#8b00ff]',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#4a00cc] to-[#6200FF] px-6 sm:px-8 pt-8 pb-8 rounded-3xl shadow-xl shadow-purple-600/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-4xl border-4 border-white/30 shadow-2xl">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-green-500 border-4 border-[#6200FF] shadow-lg"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl text-white mb-1">{user.name}</h1>
              <p className="text-purple-100 text-sm">{user.email}</p>
              <p className="text-purple-200 text-xs mt-1">Member since {user.joinDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Reviews', value: user.stats.reviews, icon: Star },
              { label: 'Saved', value: user.stats.favorites, icon: Heart },
              { label: 'Plans', value: user.stats.plans, icon: MapPin },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/30 shadow-lg"
                >
                  <Icon size={18} className="text-white mx-auto mb-1" />
                  <div className="text-2xl text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-purple-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAddLocation}
          className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#4a00cc] to-[#6200FF] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-600/20">
            <Plus size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-900 text-sm mb-1">Add Business</p>
            <p className="text-xs text-slate-600">List your location</p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onShowSubscription}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 shadow-amber-500/20"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-3 border border-white/30">
            <Crown size={24} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm mb-1">Go Premium</p>
            <p className="text-xs text-amber-100">Grow your business</p>
          </div>
        </motion.button>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-4 shadow-md border border-slate-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 mb-1">
                      {activity.action} at <span className="font-semibold">{activity.place}</span>
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="pb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Settings</h2>
        <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-200 divide-y divide-slate-100">
          {/* Notifications toggle */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-700" />
              <div>
                <span className="text-slate-900 font-medium block">Push notifications</span>
                <span className="text-xs text-slate-500">New reviews & replies near you</span>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6 cursor-pointer shrink-0">
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="sr-only peer" />
              <div className="w-12 h-6 bg-slate-200 peer-checked:bg-[#6200FF] rounded-full transition-all duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-md"></div>
            </label>
          </div>

          {/* Email updates toggle */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-700" />
              <div>
                <span className="text-slate-900 font-medium block">Email updates</span>
                <span className="text-xs text-slate-500">Weekly digest of trending places</span>
              </div>
            </div>
            <label className="relative inline-block w-12 h-6 cursor-pointer shrink-0">
              <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} className="sr-only peer" />
              <div className="w-12 h-6 bg-slate-200 peer-checked:bg-[#6200FF] rounded-full transition-all duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6 shadow-md"></div>
            </label>
          </div>

          {/* Country */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-slate-700" />
              <span className="text-slate-900 font-medium">Country</span>
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]"
            >
              <option value="us">🇺🇸 United States</option>
              <option value="uk">🇬🇧 United Kingdom</option>
              <option value="ca">🇨🇦 Canada</option>
              <option value="au">🇦🇺 Australia</option>
              <option value="de">🇩🇪 Germany</option>
              <option value="fr">🇫🇷 France</option>
              <option value="id">🇮🇩 Indonesia</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <Languages size={20} className="text-slate-700" />
              <span className="text-slate-900 font-medium">Language</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>

          {/* Sign out */}
          <button onClick={onSignOut} className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-600" />
              <span className="text-red-600 font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
