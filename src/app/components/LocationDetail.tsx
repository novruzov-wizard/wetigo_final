import { ArrowLeft, Star, MapPin, Clock, Share2, MessageCircle, CheckCircle, ThumbsUp, ImagePlus, Send, CornerDownRight, X, ChevronLeft, ChevronRight, Flag, Inbox, MessageSquare, Navigation, Phone, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PLACES } from '../data/places';
import { useStore } from '../store';
import { reviews as reviewsApi, auth as authApi, places as placesApi } from '../lib/api';

declare const L: any;

interface Reply { id: number; user: string; avatar: string; text: string; date: string; }
interface Review { id: number; user: string; avatar: string; rating: number; comment: string; date: string; photos: string[]; likes: number; liked: boolean; replies: Reply[]; }

interface LocationDetailProps {
  locationId: number;
  onBack: () => void;
  onStartChat: () => void;
}

export function LocationDetail({ locationId, onBack, onStartChat }: LocationDetailProps) {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewSort, setReviewSort] = useState<'recent' | 'high' | 'low' | 'liked'>('recent');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { places: storePlaces, t, refreshPlaces } = useStore();
  const place = storePlaces.find((p) => p.id === locationId) ?? PLACES.find((p) => p.id === locationId) ?? PLACES[0];

  const heroImg = place.image || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop';
  const location = {
    name: place.name,
    category: place.category,
    rating: place.rating,
    reviewCount: place.reviews ?? 0,
    image: heroImg,
    address: place.city,
    price: place.price || '$$',
    open: place.open,
    phone: place.phone,
    website: place.website,
    hours: place.openingHours,
    description: `${place.name} is a ${place.category.toLowerCase()} in ${place.city}. Browse real photos, ratings and reviews shared by the Wetigo community, then get directions or save it to your favorites.`,
    verified: place.verified,
  };
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };
  const nextImg = () => setGalleryIdx((i) => (i + 1) % Math.max(galleryImages.length, 1));
  const prevImg = () => setGalleryIdx((i) => (i - 1 + galleryImages.length) % Math.max(galleryImages.length, 1));

  // mini map
  const miniEl = useRef<HTMLDivElement | null>(null);
  const miniRef = useRef<any>(null);
  useEffect(() => {
    if (activeTab !== 'about' || !miniEl.current || typeof L === 'undefined') return;
    const t = setTimeout(() => {
      if (!miniRef.current) {
        miniRef.current = L.map(miniEl.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: false }).setView([place.lat, place.lng], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(miniRef.current);
        const icon = L.divIcon({ className: 'wetigo-pin', html: `<div style="transform:translate(-50%,-100%)"><div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#6200FF;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(98,0,255,.4);border:3px solid #fff"></div></div>` });
        L.marker([place.lat, place.lng], { icon }).addTo(miniRef.current);
        L.control.zoom({ position: 'bottomright' }).addTo(miniRef.current);
      }
      miniRef.current.invalidateSize();
    }, 120);
    return () => clearTimeout(t);
  }, [activeTab, place.lat, place.lng]);

  const [reviews, setReviews] = useState<Review[]>([]);

  // map a backend review row to our view model
  const mapReview = (r: any): Review => ({
    id: r.id, user: r.user ?? 'User', avatar: r.avatar ?? 'https://i.pravatar.cc/64?img=12',
    rating: r.rating, comment: r.comment, date: r.date ? new Date(r.date).toLocaleDateString() : 'Just now',
    photos: r.photos ?? [], likes: r.likes ?? 0, liked: r.liked ?? false,
    replies: (r.replies ?? []).map((p: any) => ({ id: p.id, user: p.user ?? 'User', avatar: p.avatar ?? 'https://i.pravatar.cc/64?img=12', text: p.text, date: p.date ? new Date(p.date).toLocaleDateString() : 'Just now' })),
  });

  // load real reviews for this place
  useEffect(() => {
    let alive = true;
    reviewsApi.list(locationId, reviewSort)
      .then((data) => { if (alive && Array.isArray(data)) setReviews(data.map(mapReview)); })
      .catch(() => { /* none */ });
    return () => { alive = false; };
  }, [locationId, reviewSort]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).slice(0, 4 - photos.length);
    setPhotos([...photos, ...picked.map((f) => URL.createObjectURL(f))]);
    setPhotoFiles([...photoFiles, ...picked]);
    e.target.value = '';
  };

  // Real gallery = place photo + all photos shared in reviews (deduped). No stock fillers.
  const galleryImages = Array.from(new Set([heroImg, ...reviews.flatMap((r) => r.photos)])).filter(Boolean);

  // Share via the native share sheet, falling back to clipboard.
  const handleShare = async () => {
    const url = window.location.href;
    const data = { title: location.name, text: `${location.name} — ${location.category} on Wetigo`, url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url);
      flash(t('det.tCopied'));
    } catch { flash(t('det.tShareFail')); }
  };

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));
  // Live header rating: prefer freshly-loaded reviews, fall back to the place's stored rating.
  const liveRating = reviews.length ? avg : location.rating;
  const liveCount = reviews.length ? reviews.length : location.reviewCount;

  const handleSubmitReview = async () => {
    if (userRating === 0 || !comment.trim()) return;
    const body = { rating: userRating, comment: comment.trim() };
    const localPhotos = photos; const files = photoFiles;
    setUserRating(0); setComment(''); setPhotos([]); setPhotoFiles([]);
    if (authApi.getToken()) {
      try {
        const saved: any = await reviewsApi.create(locationId, body);
        // upload each photo as bytes; collect served URLs
        const urls: string[] = [];
        for (const f of files) {
          try { const r = await reviewsApi.uploadReviewPhoto(saved.id, f); if (r?.url) urls.push(r.url); } catch { /* skip */ }
        }
        const view = mapReview(saved); view.photos = urls;
        setReviews((rs) => [view, ...rs]);
        refreshPlaces();   // update rating/count on cards across the app
        return;
      } catch { /* fall through to offline */ }
    }
    // optimistic / offline fallback (object URLs, not persisted)
    setReviews((rs) => [{ id: Date.now(), user: 'You', avatar: 'https://i.pravatar.cc/64?img=12', rating: body.rating, comment: body.comment, date: 'Just now', photos: localPhotos, likes: 0, liked: false, replies: [] }, ...rs]);
  };

  const toggleLike = (id: number) => {
    setReviews((rs) => rs.map((r) => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
    if (authApi.getToken()) reviewsApi.like(id).catch(() => {});
  };

  // search + sort comments
  const shownReviews = reviews
    .filter((r) => {
      const q = reviewSearch.toLowerCase().trim();
      if (!q) return true;
      return r.comment.toLowerCase().includes(q) || r.user.toLowerCase().includes(q) || r.replies.some((rp) => rp.text.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (reviewSort === 'high') return b.rating - a.rating;
      if (reviewSort === 'low') return a.rating - b.rating;
      if (reviewSort === 'liked') return b.likes - a.likes;
      return 0; // recent = current order (newest first)
    });

  const addReply = (id: number) => {
    if (!replyText.trim()) return;
    const text = replyText.trim();
    setReviews((rs) => rs.map((r) => r.id === id ? { ...r, replies: [...r.replies, { id: Date.now(), user: 'You', avatar: 'https://i.pravatar.cc/64?img=12', text, date: 'Just now' }] } : r));
    setReplyText(''); setReplyOpen(null);
    if (authApi.getToken()) reviewsApi.reply(id, text).catch(() => {});
  };

  return (
    <div className="pb-12">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#2b2521] text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Image */}
      <div className="relative h-80 sm:h-[420px]">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-6 left-5 bg-white/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-900" />
        </motion.button>

        <div className="absolute bottom-8 inset-x-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold border border-white/25">{location.category}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold border border-white/25">{location.price}</span>
                {location.hours && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg" style={location.open ? { background: '#16a34a', color: '#fff' } : { background: '#e11d48', color: '#fff' }}>{location.open ? 'Open now' : 'Closed'}</span>
                )}
                {location.verified && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6200FF] text-white text-xs font-semibold shadow-lg">
                    <CheckCircle size={13} className="fill-white text-[#6200FF]" /> Verified
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight drop-shadow-sm">{location.name}</h1>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl shrink-0">
              {liveRating > 0 ? (
                <>
                  <Star size={20} className="text-amber-500 fill-amber-500" />
                  <span className="font-display text-xl text-slate-900 font-bold">{liveRating.toFixed(1)}</span>
                </>
              ) : (
                <span className="font-display text-sm text-[#6200FF] font-bold">New</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => flash(t('det.tCommunity'))}
            className="flex-1 min-w-[180px] bg-[#6200FF] text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#5400dd] transition-colors shadow-lg shadow-[#6200FF]/25 font-semibold"
          >
            <MessageCircle size={20} />
            {t('det.join')}
            <span className="text-[10px] font-bold uppercase tracking-wide bg-white/25 px-1.5 py-0.5 rounded">Soon</span>
          </motion.button>
          {[
            { key: 'comment', icon: MessageSquare, label: t('det.reviewsTab'), on: () => setActiveTab('reviews'), active: false },
            { key: 'inbox', icon: Inbox, label: t('det.message'), on: () => flash(t('det.tMsg')), active: false },
            { key: 'share', icon: Share2, label: t('det.share'), on: handleShare, active: false },
            { key: 'report', icon: Flag, label: t('det.report'), on: () => { if (authApi.getToken()) reviewsApi.report(locationId, 'place').catch(() => {}); flash(t('det.tReport')); }, active: false },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <motion.button key={b.key} whileTap={{ scale: 0.95 }} onClick={b.on}
                className="flex items-center gap-2 px-4 py-4 rounded-2xl border transition-colors font-semibold text-sm"
                style={b.active ? { background: '#f1ebff', borderColor: '#6200FF', color: '#6200FF' } : { background: '#fff', borderColor: '#e5e7eb', color: '#4b5563' }}>
                <Icon size={18} className={b.active ? 'fill-[#6200FF]' : ''} />
                <span className="hidden sm:inline">{b.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
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
                  className="absolute inset-0 bg-[#6200FF] rounded-xl shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={`relative z-10 font-semibold transition-colors ${
                activeTab === tab ? 'text-white' : 'text-slate-600'
              }`}>
                {tab === 'about' ? t('det.about') : `${t('det.reviewsTab')} (${location.reviewCount})`}
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
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
          >
            {/* Description */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
              <h3 className="font-semibold text-slate-900 mb-3">{t('det.description')}</h3>
              <p className="text-slate-700 leading-relaxed">{location.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
              <h3 className="font-semibold text-slate-900 mb-3">{t('det.details')}</h3>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <MapPin size={18} className="text-[#6200FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">{t('det.location')}</p>
                  <p className="text-slate-900 font-medium">{location.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star size={18} className="text-amber-600 fill-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">{t('det.rating')}</p>
                  <p className="text-slate-900 font-medium">{liveRating > 0 ? `${liveRating.toFixed(1)} · ${liveCount.toLocaleString()} reviews` : t('det.beFirst')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Clock size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">{t('det.status')}</p>
                  <p className="font-medium" style={{ color: location.open ? '#16a34a' : '#e11d48' }}>{location.open ? 'Open now' : 'Closed'} <span className="text-slate-400">·</span> <span className="text-slate-900">{location.price}</span></p>
                </div>
              </div>
              {location.hours && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Clock size={18} className="text-blue-600" /></div>
                  <div className="flex-1"><p className="text-xs text-slate-500 mb-0.5">{t('det.hours')}</p><p className="text-slate-900 font-medium">{location.hours}</p></div>
                </div>
              )}
              {location.phone && (
                <a href={`tel:${location.phone}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Phone size={18} className="text-green-600" /></div>
                  <div className="flex-1"><p className="text-xs text-slate-500 mb-0.5">{t('det.phone')}</p><p className="text-slate-900 font-medium group-hover:underline">{location.phone}</p></div>
                </a>
              )}
              {location.website && (
                <a href={location.website.startsWith('http') ? location.website : `https://${location.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Globe size={18} className="text-[#6200FF]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-xs text-slate-500 mb-0.5">{t('det.website')}</p><p className="text-[#6200FF] font-medium group-hover:underline truncate">{location.website.replace(/^https?:\/\//, '')}</p></div>
                </a>
              )}
              <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Navigation size={18} className="text-[#6200FF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Directions</p>
                  <p className="text-[#6200FF] font-medium group-hover:underline">{t('det.openMaps')}</p>
                </div>
              </a>
              <button
                onClick={() => {
                  if (!authApi.getToken()) { flash(t('det.tSignIn')); return; }
                  placesApi.claim(locationId)
                    .then(() => flash(t('det.tClaimSent')))
                    .catch((e: any) => flash(e?.message || 'Could not submit claim'));
                }}
                className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#6200FF]/30 bg-[#f7f3ff] text-[#6200FF] text-sm font-semibold hover:bg-[#efe6ff] transition-colors">
                <CheckCircle size={16} /> {t('det.claim')}
              </button>
            </div>

            {/* Photo Gallery — real photos only (place + community photos) */}
            {galleryImages.length > 1 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">{t('det.gallery')}</h3>
              <div className="relative rounded-3xl overflow-hidden shadow-md group">
                <div className="relative h-64 sm:h-80 bg-slate-100 cursor-zoom-in" onClick={() => setLightbox({ imgs: galleryImages, idx: galleryIdx })}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={galleryIdx}
                      src={galleryImages[galleryIdx]}
                      alt={`${location.name} photo ${galleryIdx + 1}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  {/* arrows */}
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-800 hover:bg-white"><ChevronLeft size={20} /></button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-slate-800 hover:bg-white"><ChevronRight size={20} /></button>
                  {/* counter */}
                  <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-black/50 px-2.5 py-1 rounded-full">{galleryIdx + 1} / {galleryImages.length}</span>
                  {/* dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setGalleryIdx(i); }} className="w-2 h-2 rounded-full transition-all" style={{ background: i === galleryIdx ? '#fff' : 'rgba(255,255,255,.5)', width: i === galleryIdx ? 20 : 8 }} />
                    ))}
                  </div>
                </div>
                {/* thumbnails */}
                <div className="flex gap-2 p-3 bg-white overflow-x-auto">
                  {galleryImages.map((img, i) => (
                    <button key={i} onClick={() => setGalleryIdx(i)} className="shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all" style={{ ['--tw-ring-color' as any]: i === galleryIdx ? '#6200FF' : 'transparent', ringColor: i === galleryIdx ? '#6200FF' : 'transparent' }}>
                      <img src={img} alt="" className="w-full h-full object-cover" style={{ opacity: i === galleryIdx ? 1 : 0.6 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Interactive map */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Location</h3>
                <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-[#6200FF] hover:underline">
                  <Navigation size={15} /> Directions
                </a>
              </div>
              <div className="relative h-72 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <div ref={miniEl} className="absolute inset-0 z-0" />
                <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noreferrer"
                  className="absolute z-[500] bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg hover:bg-white transition-colors">
                  <MapPin size={18} className="text-[#6200FF] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{location.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{place.city}</p>
                  </div>
                  <Navigation size={16} className="text-[#6200FF] shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
          >
            {/* Rating summary */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
              <div className="text-center sm:border-r sm:border-slate-100 sm:pr-6 flex flex-col justify-center">
                <div className="font-display text-5xl font-bold text-[#2b2521]">{avg.toFixed(1)}</div>
                <div className="flex justify-center gap-0.5 my-1.5">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={15} className={s <= Math.round(avg) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} />)}
                </div>
                <div className="text-xs text-slate-500">{reviews.length} reviews</div>
              </div>
              <div className="flex-1 space-y-1.5 justify-center flex flex-col">
                {dist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-3">{star}</span>
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-5 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write a review */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <h3 className="font-display font-bold text-[#2b2521] mb-3">{t('det.write')}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-slate-600 font-medium">{t('det.yourRating')}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button key={star} whileTap={{ scale: 0.9 }} onClick={() => setUserRating(star)} className="hover:scale-110 transition-transform">
                      <Star size={24} className={star <= userRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                    </motion.button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder={t('det.expPh')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent resize-none mb-3"
                rows={3}
              />
              {/* photos */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => { setPhotos(photos.filter((_, j) => j !== i)); setPhotoFiles(photoFiles.filter((_, j) => j !== i)); }} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"><X size={11} /></button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:border-[#6200FF] hover:text-[#6200FF] transition-colors">
                    <ImagePlus size={18} />
                    <span className="text-[9px] font-semibold">Upload</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleSubmitReview} disabled={userRating === 0 || !comment.trim()}
                className="w-full bg-[#6200FF] text-white py-3.5 rounded-2xl hover:bg-[#5400dd] disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#6200FF]/20 font-semibold">
                Post Review
              </motion.button>
            </div>

            {/* Search + sort comments */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <MessageSquare size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} placeholder={t('det.searchComments')}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#2b2521] placeholder:text-slate-400 focus:outline-none rounded-2xl" />
              </div>
              <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value as any)}
                className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF] shrink-0">
                <option value="recent">{t('det.sortRecent')}</option>
                <option value="high">{t('det.sortHigh')}</option>
                <option value="low">{t('det.sortLow')}</option>
                <option value="liked">{t('det.sortLiked')}</option>
              </select>
            </div>

            {/* Reviews list */}
            <div className="space-y-3">
              {shownReviews.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                  <p className="text-sm text-slate-500">No comments match “{reviewSearch}”.</p>
                </div>
              )}
              {shownReviews.map((review, idx) => (
                <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <img src={review.avatar} alt={review.user} className="w-11 h-11 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#2b2521]">{review.user}</span>
                        <span className="text-xs text-slate-400">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1,2,3,4,5].map((s) => <Star key={s} size={13} className={s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} />)}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>

                      {review.photos.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {review.photos.map((p, i) => (
                            <button key={i} onClick={() => setLightbox({ imgs: review.photos, idx: i })} className="w-20 h-20 rounded-xl overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity">
                              <img src={p} alt={`Review photo ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* actions */}
                      <div className="flex items-center gap-4 mt-3">
                        <button onClick={() => toggleLike(review.id)} className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: review.liked ? '#6200FF' : '#94a3b8' }}>
                          <ThumbsUp size={15} className={review.liked ? 'fill-[#6200FF]' : ''} /> {review.likes}
                        </button>
                        <button onClick={() => { if (authApi.getToken()) reviewsApi.report(review.id, 'inappropriate').catch(() => {}); flash(t('det.tCommentReported')); }} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-rose-500 transition-colors">
                          <Flag size={15} /> Report
                        </button>
                        <button onClick={() => { setReplyOpen(replyOpen === review.id ? null : review.id); setReplyText(''); }} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-[#6200FF] transition-colors">
                          <MessageCircle size={15} /> Reply
                        </button>
                      </div>

                      {/* replies thread */}
                      {review.replies.length > 0 && (
                        <div className="mt-3 space-y-3 pl-3 border-l-2 border-slate-100">
                          {review.replies.map((rep) => (
                            <div key={rep.id} className="flex items-start gap-2.5">
                              <img src={rep.avatar} alt={rep.user} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-[#2b2521]">{rep.user}</span>
                                  <span className="text-xs text-slate-400">{rep.date}</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{rep.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* reply input */}
                      <AnimatePresence>
                        {replyOpen === review.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="flex items-center gap-2 mt-3">
                              <CornerDownRight size={16} className="text-slate-300 shrink-0" />
                              <input value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addReply(review.id)} placeholder="Write a reply…"
                                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                              <button onClick={() => addReply(review.id)} disabled={!replyText.trim()} className="w-10 h-10 rounded-xl bg-[#6200FF] text-white flex items-center justify-center disabled:bg-slate-200 shrink-0"><Send size={16} /></button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen image lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"><X size={22} /></button>
            {lightbox.imgs.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb && ({ ...lb, idx: (lb.idx - 1 + lb.imgs.length) % lb.imgs.length })); }} className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"><ChevronLeft size={26} /></button>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((lb) => lb && ({ ...lb, idx: (lb.idx + 1) % lb.imgs.length })); }} className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"><ChevronRight size={26} /></button>
              </>
            )}
            <motion.img key={lightbox.idx} src={lightbox.imgs[lightbox.idx]} alt="" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl" />
            {lightbox.imgs.length > 1 && (
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">{lightbox.idx + 1} / {lightbox.imgs.length}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
