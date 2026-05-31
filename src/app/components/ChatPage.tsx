import { Search, Phone, MoreVertical, Paperclip, Mic, Send, Pin, CheckCheck, Eye, Play, Image as ImageIcon, Video, FileText, Music, Link2, Mic2, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ChatPageProps {
  onBack: () => void;
}

export function ChatPage({ onBack }: ChatPageProps) {
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

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
        <div className="w-[300px] shrink-0 border-r border-slate-100 flex flex-col">
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
                onClick={() => setActiveChat(i)}
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
        <div className="flex-1 min-w-0 flex flex-col bg-white">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2b2521]">Design chat</h2>
              <p className="text-sm text-[#a89a8b]">23 members, 10 online</p>
            </div>
            <div className="flex items-center gap-2 text-[#6b6258]">
              <button className="w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] flex items-center justify-center"><Search size={19} /></button>
              <button className="w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] flex items-center justify-center"><Phone size={19} /></button>
              <button onClick={() => setShowInfo(!showInfo)} className="w-10 h-10 rounded-full hover:bg-[#f1ebff] hover:text-[#6200FF] flex items-center justify-center"><MoreVertical size={19} /></button>
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
          </div>

          {/* input */}
          <div className="px-6 py-4 border-t border-slate-100">
            <div className="flex items-center gap-3 bg-[#f6f4f9] rounded-2xl px-4 py-2.5">
              <button className="text-[#a89a8b] hover:text-[#6200FF]"><Paperclip size={20} /></button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                className="flex-1 bg-transparent text-sm text-[#2b2521] placeholder:text-[#a89a8b] focus:outline-none"
              />
              <button className="text-[#a89a8b] hover:text-[#6200FF]"><Mic size={20} /></button>
              <button className="text-[#6200FF]"><Send size={20} /></button>
            </div>
          </div>
        </div>

        {/* ===== Group info ===== */}
        {showInfo && (
          <div className="w-[300px] shrink-0 border-l border-slate-100 flex flex-col bg-white overflow-y-auto">
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
    </div>
  );
}
