import { Search, Phone, MoreVertical, Paperclip, Mic, Send, Pin, CheckCheck, Eye, Play, Image as ImageIcon, Video, FileText, Music, Link2, Mic2, ChevronDown, X, CalendarPlus, MapPin, Calendar, Clock, Users, PhoneOff, MicOff, Video as VideoIcon, Check, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPageProps {
  onBack: () => void;
}

interface SentText { kind: 'text'; id: number; text: string; time: string; }
interface SentEvent { kind: 'event'; id: number; title: string; place: string; date: string; time: string; going: number; rsvp: 'none' | 'going' | 'maybe'; }
type Sent = SentText | SentEvent;

export function ChatPage({ onBack }: ChatPageProps) {
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [sent, setSent] = useState<Sent[]>([]);
  const [callOpen, setCallOpen] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [evt, setEvt] = useState({ title: '', place: '', date: '', time: '' });

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = () => {
    if (!message.trim()) return;
    setSent((s) => [...s, { kind: 'text', id: Date.now(), text: message.trim(), time: now() }]);
    setMessage('');
  };

  const createEvent = () => {
    if (!evt.title.trim() || !evt.date || !evt.time) return;
    setSent((s) => [...s, { kind: 'event', id: Date.now(), title: evt.title.trim(), place: evt.place.trim() || 'TBD', date: evt.date, time: evt.time, going: 1, rsvp: 'going' }]);
    setEvt({ title: '', place: '', date: '', time: '' });
    setEventOpen(false);
  };

  const setRsvp = (id: number, rsvp: 'going' | 'maybe') => setSent((s) => s.map((m) => m.kind === 'event' && m.id === id ? { ...m, rsvp, going: m.going + (rsvp === 'going' && m.rsvp !== 'going' ? 1 : rsvp !== 'going' && m.rsvp === 'going' ? -1 : 0) } : m));

  useEffect(() => {
    if (!callOpen) { setCallSecs(0); return; }
    const t = setInterval(() => setCallSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callOpen]);
  const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const chats = [
    { name: 'Design chat', time: '4m', preview: 'Jessie Rollins sent…', avatar: 'DC', dark: true, unread: 1, pinned: true },
    { name: 'Osman Campos', time: '20m', preview: 'You: Hey! We are read…', img: 'https://i.pravatar.cc/80?img=12', sent: true },
    { name: 'Jayden Church', time: '1h', preview: 'I prepared some varia…', img: 'https://i.pravatar.cc/80?img=14', sent: true },
    { name: 'Jacob Mcleod', time: '10m', preview: 'And send me the proto…', img: 'https://i.pravatar.cc/80?img=33', unread: 3 },
    { name: 'Jasmin Lowery', time: '20m', preview: "You: Ok! Let's discuss it on th…", img: 'https://i.pravatar.cc/80?img=45', read: true },
    { name: 'Zaid Myers', time: '45m', preview: 'You: Hey! We are ready to in…', img: 'https://i.pravatar.cc/80?img=15', read: true },
    { name: 'Anthony Cordanes', time: '1d', preview: 'What do you think?', img: 'https://i.pravatar.cc/80?img=8' },
    { name: 'Conner Garcia', time: '2d', preview: 'You: I think it would be perfe…', img: 'https://i.pravatar.cc/80?img=11', read: true },
    { name: 'Vanessa Cox', time: '2d', preview: 'Voice message', img: 'https://i.pravatar.cc/80?img=9', read: true, voice: true },
  ];

  const members = [
    { name: 'Tanisha Combs', role: 'admin', img: 'https://i.pravatar.cc/64?img=44' },
    { name: 'Alex Hunt', img: 'https://i.pravatar.cc/64?img=13' },
    { name: 'Jasmin Lowery', img: 'https://i.pravatar.cc/64?img=45' },
    { name: 'Max Padilla', img: 'https://i.pravatar.cc/64?img=51' },
    { name: 'Jessie Rollins', img: 'https://i.pravatar.cc/64?img=27' },
    { name: 'Lukas Mcgowan', img: 'https://i.pravatar.cc/64?img=52' },
  ];

  const files = [
    { icon: Video, label: '13 videos' },
    { icon: FileText, label: '378 files' },
    { icon: Music, label: '21 audio files' },
    { icon: Link2, label: '45 shared links' },
    { icon: Mic2, label: '2 589 voice messages' },
  ];

  const Ticks = () => <CheckCheck size={15} className="text-[#6200FF]" />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm" style={{ height: 'calc(100vh - 110px)' }}>
        {/* ===== Chat list ===== */}
        <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-[260px] lg:w-[300px] shrink-0 border-r border-slate-100 flex-col`}>
          <div className="p-4">
            <div className="relative bg-[#f1ebff] rounded-xl">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6200FF]" />
              <input placeholder="Search" className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-[#2b2521] placeholder:text-[#9d93c4] focus:outline-none rounded-xl" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {chats.map((c, i) => (
              <button
                key={i}
                onClick={() => { setActiveChat(i); setMobileView('chat'); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl transition-colors text-left"
                style={{ backgroundColor: activeChat === i ? '#f1ebff' : 'transparent' }}
              >
                {c.dark ? (
                  <span className="w-12 h-12 rounded-2xl bg-[#2b2333] text-white font-bold flex items-center justify-center shrink-0">{c.avatar}</span>
                ) : (
                  <img src={c.img} alt={c.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#2b2521] truncate">{c.name}</span>
                    <span className="text-xs text-[#a89a8b] shrink-0">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className={`text-xs truncate ${c.voice || c.preview.startsWith('Jessie') ? 'text-[#6200FF] font-medium' : 'text-[#8a8175]'}`}>{c.preview}</span>
                    <span className="shrink-0 flex items-center">
                      {c.unread ? (
                        <span className="w-5 h-5 rounded-full bg-[#ff6a3d] text-white text-[10px] font-bold flex items-center justify-center">{c.unread}</span>
                      ) : c.read ? <Ticks /> : c.sent ? <Pin size={14} className="text-[#6200FF] fill-[#6200FF]" /> : null}
                    </span>
                  </div>
                </div>
                {c.pinned && <Pin size={14} className="text-[#6200FF] fill-[#6200FF] shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Conversation ===== */}
        <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 min-w-0 flex-col bg-white`}>
          {/* header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileView('list')} className="md:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600 shrink-0"><ArrowLeft size={20} /></button>
              {chats[activeChat].dark
                ? <span className="w-10 h-10 rounded-xl bg-[#2b2333] text-white text-sm font-bold flex items-center justify-center shrink-0">{chats[activeChat].avatar}</span>
                : <img src={chats[activeChat].img} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />}
              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-2xl font-bold text-[#2b2521] truncate">{chats[activeChat].name}</h2>
                <p className="text-xs sm:text-sm text-[#a89a8b]">{(chats[activeChat] as any).participants ? `${(chats[activeChat] as any).participants} members, 10 online` : 'online'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-[#6b6258] shrink-0">
              <button onClick={() => setEventOpen(true)} title="Create event" className="w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] flex items-center justify-center"><CalendarPlus size={19} /></button>
              <button onClick={() => setCallOpen(true)} title="Start call" className="w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] flex items-center justify-center"><Phone size={19} /></button>
              <button onClick={() => setShowInfo(!showInfo)} className="hidden xl:flex w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] items-center justify-center"><MoreVertical size={19} /></button>
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* incoming */}
            <div className="flex gap-3 max-w-[78%]">
              <img src="https://i.pravatar.cc/64?img=45" className="w-9 h-9 rounded-full object-cover mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#6200FF] mb-1">Jasmin Lowery</p>
                <div className="bg-[#f1ebff] rounded-2xl rounded-tl-md px-4 py-3">
                  <p className="text-sm text-[#2b2521] leading-relaxed">I added new flows to our design system. Now you can use them for your projects!</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs">👍 4</span>
                    <span className="flex items-center gap-1 text-xs text-[#a89a8b]"><Eye size={13} /> 23 · 09:20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* incoming text */}
            <div className="flex gap-3 max-w-[78%]">
              <img src="https://i.pravatar.cc/64?img=13" className="w-9 h-9 rounded-full object-cover mt-1 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#6200FF] mb-1">Alex Hunt</p>
                <div className="bg-[#f1ebff] rounded-2xl rounded-tl-md px-4 py-3 inline-block">
                  <p className="text-sm text-[#2b2521]">Hey guys! Important news!</p>
                  <div className="flex justify-end mt-1"><span className="flex items-center gap-1 text-xs text-[#a89a8b]"><Eye size={13} /> 16 · 09:24</span></div>
                </div>
                <div className="bg-[#f1ebff] rounded-2xl rounded-tl-md px-4 py-3 mt-2">
                  <p className="text-sm text-[#2b2521] leading-relaxed">Our intern <span className="text-[#6200FF] font-medium">@jchurch</span> has successfully completed his probationary period and is now part of our team!</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <span className="bg-white px-2 py-0.5 rounded-full text-xs">🔥 5</span>
                      <span className="bg-white px-2 py-0.5 rounded-full text-xs">⚡ 4</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#a89a8b]"><Eye size={13} /> 16 · 09:24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* outgoing */}
            <div className="flex gap-3 justify-end">
              <div className="max-w-[70%]">
                <div className="bg-[#6200FF] text-white rounded-2xl rounded-tr-md px-4 py-3">
                  <p className="text-sm leading-relaxed">Jaden, my congratulations! I will be glad to work with you on a new project 😉</p>
                  <div className="flex justify-end mt-1"><span className="flex items-center gap-1 text-xs text-white/70"><Eye size={13} /> 10 · 09:27</span></div>
                </div>
              </div>
              <img src="https://i.pravatar.cc/64?img=44" className="w-9 h-9 rounded-full object-cover mt-1 shrink-0" />
            </div>

            {/* image message */}
            <div className="flex justify-center">
              <div className="relative rounded-2xl overflow-hidden max-w-sm shadow-sm">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop" alt="meeting" className="w-full object-cover" />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white bg-black/40 px-2 py-0.5 rounded-full"><Eye size={12} /> 10 · 09:30</span>
              </div>
            </div>

            {/* voice message */}
            <div className="flex gap-3 max-w-[78%]">
              <img src="https://i.pravatar.cc/64?img=27" className="w-9 h-9 rounded-full object-cover mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#6200FF] mb-1">Jessie Rollins</p>
                <div className="bg-[#f1ebff] rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button className="w-9 h-9 rounded-full bg-[#6200FF] text-white flex items-center justify-center shrink-0"><Play size={16} className="fill-white ml-0.5" /></button>
                    <div className="flex items-end gap-0.5 h-7">
                      {[6,10,14,8,16,20,12,18,22,14,10,16,8,12,18,10,14,20,12,8,14,18,10,6].map((h, i) => (
                        <span key={i} className="w-0.5 rounded-full bg-[#6200FF]/50" style={{ height: h }} />
                      ))}
                    </div>
                    <span className="text-xs text-[#a89a8b] shrink-0">0:15</span>
                  </div>
                  <div className="flex justify-end mt-1"><span className="flex items-center gap-1 text-xs text-[#a89a8b]"><Eye size={13} /> 10 · 09:30</span></div>
                </div>
              </div>
            </div>

            {/* dynamic sent items */}
            {sent.map((m) => m.kind === 'text' ? (
              <div key={m.id} className="flex gap-3 justify-end">
                <div className="max-w-[70%]">
                  <div className="bg-[#6200FF] text-white rounded-2xl rounded-tr-md px-4 py-3">
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    <div className="flex justify-end mt-1"><span className="flex items-center gap-1 text-xs text-white/70"><CheckCheck size={13} /> {m.time}</span></div>
                  </div>
                </div>
                <img src="https://i.pravatar.cc/64?img=12" className="w-9 h-9 rounded-full object-cover mt-1 shrink-0" />
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[78%] w-80 bg-white border-2 border-[#e7dcff] rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-[#6200FF] to-[#8b3bff] px-4 py-3 text-white">
                    <div className="flex items-center gap-2 text-xs font-semibold opacity-90 mb-1"><Calendar size={13} /> EVENT</div>
                    <p className="font-display font-bold text-lg leading-tight">{m.title}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#2b2521]"><Calendar size={15} className="text-[#6200FF]" /> {m.date} · <Clock size={14} className="text-[#6200FF]" /> {m.time}</div>
                    <div className="flex items-center gap-2 text-sm text-[#6b6258]"><MapPin size={15} className="text-[#6200FF]" /> {m.place}</div>
                    <div className="flex items-center gap-2 text-sm text-[#6b6258]"><Users size={15} className="text-[#6200FF]" /> {m.going} going</div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setRsvp(m.id, 'going')} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors" style={m.rsvp === 'going' ? { background: '#6200FF', color: '#fff' } : { background: '#f1ebff', color: '#6200FF' }}>{m.rsvp === 'going' ? '✓ Going' : 'Going'}</button>
                      <button onClick={() => setRsvp(m.id, 'maybe')} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors" style={m.rsvp === 'maybe' ? { background: '#2b2521', color: '#fff' } : { background: '#f1f5f9', color: '#64748b' }}>Maybe</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* input */}
          <div className="px-6 py-4 border-t border-slate-100">
            <div className="flex items-center gap-3 bg-[#f6f4f9] rounded-2xl px-4 py-2.5">
              <button onClick={() => setEventOpen(true)} title="Create event" className="text-[#a89a8b] hover:text-[#6200FF]"><CalendarPlus size={20} /></button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Your message"
                className="flex-1 bg-transparent text-sm text-[#2b2521] placeholder:text-[#a89a8b] focus:outline-none"
              />
              <button className="text-[#a89a8b] hover:text-[#6200FF]"><Mic size={20} /></button>
              <button onClick={sendMessage} className="text-[#6200FF]"><Send size={20} /></button>
            </div>
          </div>
        </div>

        {/* ===== Group info ===== */}
        {showInfo && (
          <div className="hidden xl:flex w-[300px] shrink-0 border-l border-slate-100 flex-col bg-white overflow-y-auto">
            <div className="p-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#2b2521]">Group Info</h3>
              <button onClick={() => setShowInfo(false)} className="text-[#a89a8b] hover:text-[#2b2521]"><X size={20} /></button>
            </div>

            <div className="px-5">
              <p className="text-sm font-semibold text-[#8a8175] mb-3">Files</p>
              <button className="w-full flex items-center justify-between mb-3">
                <span className="flex items-center gap-2.5 text-sm font-medium text-[#2b2521]"><ImageIcon size={18} className="text-[#6200FF]" /> 265 photos</span>
                <ChevronDown size={16} className="text-[#a89a8b]" />
              </button>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop" className="w-full h-24 object-cover rounded-xl" />
                <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=200&h=200&fit=crop" className="w-full h-24 object-cover rounded-xl" />
              </div>
              <div className="space-y-3 pb-4 border-b border-slate-100">
                {files.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <button key={i} className="w-full flex items-center justify-between">
                      <span className="flex items-center gap-2.5 text-sm font-medium text-[#2b2521]"><Icon size={18} className="text-[#6200FF]" /> {f.label}</span>
                      <ChevronDown size={16} className="text-[#a89a8b]" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#2b2521]">23 members</h4>
              </div>
              <div className="space-y-3.5">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={m.img} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#2b2521] flex-1">{m.name}</span>
                    {m.role && <span className="text-xs text-[#a89a8b]">{m.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Call modal ===== */}
      <AnimatePresence>
        {callOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden text-center text-white p-8" style={{ background: 'linear-gradient(160deg,#3a00b0,#6200FF)' }}>
              <div className="relative w-28 h-28 mx-auto mb-5">
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <span className="relative w-28 h-28 rounded-2xl bg-[#2b2333] flex items-center justify-center text-3xl font-bold">DC</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-1">Design chat</h3>
              <p className="text-white/70 mb-8">{callSecs === 0 ? 'Calling…' : mmss(callSecs)}</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setMuted(!muted)} className="w-14 h-14 rounded-full flex items-center justify-center transition-colors" style={{ background: muted ? '#fff' : 'rgba(255,255,255,.2)', color: muted ? '#6200FF' : '#fff' }}>
                  {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button onClick={() => { setCallOpen(false); setMuted(false); }} className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-600">
                  <PhoneOff size={26} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"><VideoIcon size={22} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Create event modal ===== */}
      <AnimatePresence>
        {eventOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEventOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#6200FF] to-[#8b3bff] px-6 py-5 text-white flex items-center justify-between">
                <h3 className="font-display text-xl font-bold flex items-center gap-2"><CalendarPlus size={20} /> Create event</h3>
                <button onClick={() => setEventOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Event title</label>
                  <input value={evt.title} onChange={(e) => setEvt({ ...evt, title: e.target.value })} placeholder="Dinner at La Cucina" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Place</label>
                  <input value={evt.place} onChange={(e) => setEvt({ ...evt, place: e.target.value })} placeholder="La Cucina Italiana, Chicago" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Date</label>
                    <input type="date" value={evt.date} onChange={(e) => setEvt({ ...evt, date: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Time</label>
                    <input type="time" value={evt.time} onChange={(e) => setEvt({ ...evt, time: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                  </div>
                </div>
                <button onClick={createEvent} disabled={!evt.title.trim() || !evt.date || !evt.time}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors">
                  <Check size={18} /> Share event with group
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
