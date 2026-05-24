import { ArrowLeft, Send, MapPin, Calendar, Users, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ChatPageProps {
  onBack: () => void;
}

export function ChatPage({ onBack }: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Wedding Planning Network',
      lastMessage: 'Has anyone visited The Grand Ballroom?',
      time: '2m',
      unread: 3,
      avatar: '💒',
      participants: 12,
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 2,
      name: 'Fitness Enthusiasts',
      lastMessage: 'Morning workout session tomorrow at 6am?',
      time: '1h',
      unread: 0,
      avatar: '💪',
      participants: 8,
      color: 'from-emerald-500 to-green-600',
    },
    {
      id: 3,
      name: 'Food Lovers Community',
      lastMessage: 'Just tried La Cucina, absolutely amazing!',
      time: '3h',
      unread: 5,
      avatar: '🍕',
      participants: 24,
      color: 'from-orange-500 to-amber-600',
    },
  ];

  const messages = [
    {
      id: 1,
      user: 'Sarah Johnson',
      text: 'Has anyone visited The Grand Ballroom for events?',
      time: '10:30 AM',
      isOwn: false,
      avatar: '👰',
      read: true,
    },
    {
      id: 2,
      user: 'You',
      text: 'Yes! I had my wedding there last year. Absolutely stunning venue with great service!',
      time: '10:32 AM',
      isOwn: true,
      avatar: '😊',
      read: true,
    },
    {
      id: 3,
      user: 'Michael Chen',
      text: 'That sounds great! What was the pricing like?',
      time: '10:35 AM',
      isOwn: false,
      avatar: '🤵',
      read: true,
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent: ${message}`);
      setMessage('');
    }
  };

  if (selectedChat) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Chat Header */}
        <div className="bg-white px-5 py-4 flex items-center gap-3 border-b border-slate-200 pt-16 shadow-sm">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedChat(null)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </motion.button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xl shadow-lg shadow-rose-500/20">
            💒
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Wedding Planning Network</h2>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Users size={12} />
              <span>12 members active</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-lg shrink-0">
                {msg.avatar}
              </div>
              <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''} max-w-[75%]`}>
                {!msg.isOwn && (
                  <span className="text-xs text-slate-600 mb-1 px-2 font-medium">{msg.user}</span>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.isOwn
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-slate-900 rounded-tl-sm border border-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-2">
                  <span className="text-xs text-slate-500">{msg.time}</span>
                  {msg.isOwn && msg.read && (
                    <CheckCheck size={14} className="text-blue-600" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-blue-100 rounded-3xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <span className="font-semibold text-slate-900">Group Plan Created</span>
            </div>
            <p className="text-sm text-slate-700 mb-3 font-medium">
              Visit The Grand Ballroom • Saturday, 2:00 PM
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={14} />
              <span>123 Main Street, Downtown</span>
            </div>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="bg-white px-5 py-4 border-t border-slate-200 pb-28">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative bg-slate-100 rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl text-slate-900 mb-1">Messages</h1>
          <p className="text-slate-600">Connect with others and plan visits together</p>
        </motion.div>
      </div>

      {/* Chat List */}
      <div className="px-5 space-y-3 py-4">
        {chats.map((chat, idx) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedChat(chat.id)}
            className="w-full bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${chat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {chat.avatar}
                </div>
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg">
                    {chat.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900">{chat.name}</h3>
                  <span className="text-xs text-slate-500">{chat.time}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-1 mb-1">
                  {chat.lastMessage}
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Users size={12} />
                  <span>{chat.participants} members</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
