import { ArrowLeft, MapPin, Plus, X, Building2, Phone, Clock, Globe, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { places as placesApi, auth as authApi } from '../lib/api';
import { useStore } from '../store';

interface AddLocationPageProps {
  onBack: () => void;
}

export function AddLocationPage({ onBack }: AddLocationPageProps) {
  const { t, refreshPlaces } = useStore();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    hours: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ---- validation ----
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[+]?[\d\s()-]{7,20}$/;
  const urlRe = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

  const validateStep = (step: number): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (formData.businessName.trim().length < 2) e.businessName = t('addp.vName');
      if (!formData.category) e.category = t('addp.vCategory');
      if (formData.description.trim().length < 20) e.description = t('addp.vDesc');
    }
    if (step === 2) {
      if (formData.address.trim().length < 4) e.address = t('addp.vAddress');
      if (formData.city.trim().length < 2) e.city = t('addp.vCity');
      if (!formData.country.trim()) e.country = t('addp.vCountry');
      if (!phoneRe.test(formData.phone.trim())) e.phone = t('addp.vPhone');
      if (formData.email.trim() && !emailRe.test(formData.email.trim())) e.email = t('addp.vEmail');
      if (formData.website.trim() && !urlRe.test(formData.website.trim())) e.website = t('addp.vWebsite');
      if (!formData.hours.trim()) e.hours = t('addp.vHours');
    }
    if (step === 3) {
      if (images.length < 3) e.images = t('addp.vPhotos');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToStep = (target: number) => {
    // validate the current step before advancing
    if (target > currentStep && !validateStep(currentStep)) return;
    setCurrentStep(target);
  };

  const categories = [
    { id: 'wedding', name: 'Wedding Venues', icon: '💒' },
    { id: 'restaurant', name: 'Restaurants & Dining', icon: '🍽️' },
    { id: 'fashion', name: 'Fashion & Apparel', icon: '👔' },
    { id: 'footwear', name: 'Footwear & Accessories', icon: '👟' },
    { id: 'fitness', name: 'Fitness & Wellness', icon: '💪' },
    { id: 'cafe', name: 'Cafes & Bakeries', icon: '☕' },
    { id: 'beauty', name: 'Beauty & Spa', icon: '💄' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
    { id: 'automotive', name: 'Automotive', icon: '🚗' },
    { id: 'hotel', name: 'Hotels & Lodging', icon: '🏨' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
  ];

  const [done, setDone] = useState(false);
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitError(''); setSubmitting(true);
    const payload = {
      name: formData.businessName.trim(),
      category: categories.find((c) => c.id === formData.category)?.name ?? formData.category,
      categoryId: formData.category,
      image: images[0] ?? '',
      city: `${formData.city.trim()}, ${formData.country.trim()}`,
      country: formData.country.trim().toLowerCase().slice(0, 2),
      price: '$$',
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      openingHours: formData.hours.trim(),
    };
    try {
      if (authApi.getToken()) {
        const created = await placesApi.create(payload);   // backend stores as "pending"
        // upload the real photos as bytes (stored in our DB, served back as the place image)
        const newId = (created as any)?.id;
        if (newId) {
          for (const f of files) {
            try { await placesApi.uploadPhoto(newId, f); } catch { /* skip one */ }
          }
        }
      }
      refreshPlaces();
      setDone(true);
      setTimeout(onBack, 3200);
    } catch (err: any) {
      setSubmitError(err?.message || t('addp.error'));
      setSubmitting(false);
    }
  };

  const fileRef = useRef<HTMLInputElement | null>(null);
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).slice(0, 10 - images.length);
    setImages([...images, ...picked.map((f) => URL.createObjectURL(f))]);
    setFiles([...files, ...picked]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </motion.button>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === currentStep ? 'w-8 bg-[#6200FF]' : step < currentStep ? 'w-2 bg-[#6200FF]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a00cc] to-[#6200FF] flex items-center justify-center shadow-lg shadow-purple-600/20">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-slate-900">{t('addp.title')}</h1>
            <p className="text-slate-600 text-sm">{t('addp.step')} {currentStep} / 3</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-6 space-y-4"
          >
            <div>
              <h3 className="text-lg text-slate-900 mb-4">{t('addp.bizInfo')}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.name')} *</label>
                  <input
                    type="text"
                    placeholder={t('addp.namePh')}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.businessName ? 'border-rose-400' : 'border-slate-200'}`}
                  />
                  {errors.businessName && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.category')} *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                          formData.category === cat.id
                            ? 'bg-purple-50 border-[#6200FF] shadow-sm shadow-purple-600/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          <span className={`text-xs ${formData.category === cat.id ? 'text-purple-900 font-semibold' : 'text-slate-700'}`}>
                            {cat.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.description')} *</label>
                  <textarea
                    placeholder={t('addp.descPh')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm resize-none ${errors.description ? 'border-rose-400' : 'border-slate-200'}`}
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {errors.description ? <p className="flex items-center gap-1 text-xs text-rose-500"><AlertCircle size={13} /> {errors.description}</p> : <span />}
                    <span className="text-xs text-slate-400">{formData.description.trim().length}/20</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => goToStep(2)}
              className="w-full bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 shadow-md"
            >
              {t('addp.toLocation')}
            </motion.button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-6 space-y-4"
          >
            <div>
              <h3 className="text-lg text-slate-900 mb-4">{t('addp.locContact')}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.address')} *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.address ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.address && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">{t('addp.city')} *</label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.city ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                    {errors.city && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">{t('addp.country')} *</label>
                    <input
                      type="text"
                      placeholder="USA"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.country ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                    {errors.country && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.phone')} *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.phone ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.phone && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.email')}</label>
                  <input
                    type="email"
                    placeholder="hello@yourbusiness.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.email ? 'border-rose-400' : 'border-slate-200'}`}
                  />
                  {errors.email && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.website')}</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="url"
                      placeholder="https://yourbusiness.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.website ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.website && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.website}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">{t('addp.hours')} *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.hours ? 'border-rose-400' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.hours && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.hours}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300"
              >
                {t('addp.back')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => goToStep(3)}
                className="flex-1 bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 shadow-md"
              >
                {t('addp.toPhotos')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-6 space-y-4"
          >
            <div>
              <h3 className="text-lg text-slate-900 mb-2">{t('addp.photos')}</h3>
              <p className="text-sm text-slate-600 mb-4">{t('addp.photosHint')}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                  >
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </motion.div>
                ))}

                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#6200FF] hover:bg-[#f1ebff] transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Plus size={24} className="text-slate-400" />
                    <span className="text-xs text-slate-500">{t('addp.upload')}</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
              </div>
              {errors.images && <p className="flex items-center gap-1 text-xs text-rose-500 mb-3"><AlertCircle size={13} /> {errors.images}</p>}

              <div className="bg-purple-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex gap-3">
                  <ImageIcon size={20} className="text-[#6200FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 mb-1 font-medium">{t('addp.tips')}</p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• {t('addp.tip1')}</li>
                      <li>• {t('addp.tip2')}</li>
                      <li>• {t('addp.tip3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {submitError && <p className="flex items-center gap-1.5 text-sm text-rose-600 mb-2"><AlertCircle size={15} /> {submitError}</p>}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300"
              >
                {t('addp.back')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting || done}
                className="flex-1 bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
              >
                {submitting ? t('addp.submitting') : done ? t('addp.submitted') : t('addp.submit')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast — animated, dismissible, auto-hides */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ type: 'spring', bounce: 0.35 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[2000] w-[92%] max-w-md"
          >
            <div className="relative flex items-start gap-3 bg-white rounded-2xl shadow-2xl border border-emerald-100 px-5 py-4 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <Check size={22} className="text-white" strokeWidth={3} />
              </div>
              <div className="flex-1 pr-5">
                <p className="font-semibold text-slate-900 text-sm">{t('addp.successTitle')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('addp.successDesc')}</p>
              </div>
              <button onClick={onBack} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-colors"><X size={16} /></button>
              <motion.div initial={{ width: '100%' }} animate={{ width: 0 }} transition={{ duration: 3.2, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-emerald-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
