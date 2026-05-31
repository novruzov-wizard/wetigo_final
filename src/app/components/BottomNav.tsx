import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  active: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Explore' },
    { id: 'favorites', icon: Heart, label: 'Saved' },
    { id: 'chat', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-5 z-50">
      <div className="mx-4">
        <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
          <div className="relative flex items-center justify-around px-2 py-2.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => onNavigate(item.id)}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl"
                      style={{ backgroundColor: '#f0e6ff' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon
                    size={21}
                    className="relative z-10 transition-all duration-300"
                    style={{ color: isActive ? '#6200FF' : '#94a3b8' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className="relative z-10 text-[9px] font-semibold transition-all duration-300"
                    style={{ color: isActive ? '#6200FF' : '#94a3b8' }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
