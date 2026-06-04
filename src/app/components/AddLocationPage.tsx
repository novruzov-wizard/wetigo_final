import { ArrowLeft, MapPin, Upload, Plus, X, Building2, Phone, Clock, Globe, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { places as placesApi, auth as authApi } from '../lib/api';

interface AddLocationPageProps {
  onBack: () => void;
}

export function AddLocationPage({ onBack }: AddLocationPageProps) {
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
      if (formData.businessName.trim().length < 2) e.businessName = 'Enter at least 2 characters';
      if (!formData.category) e.category = 'Please choose a category';
      if (formData.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    }
    if (step === 2) {
      if (formData.address.trim().length < 4) e.address = 'Enter a valid street address';
      if (formData.city.trim().length < 2) e.city = 'Enter the city';
      if (!formData.country.trim()) e.country = 'Enter the country';
      if (!phoneRe.test(formData.phone.trim())) e.phone = 'Enter a valid phone number';
      if (formData.email.trim() && !emailRe.test(formData.email.trim())) e.email = 'Enter a valid email';
      if (formData.website.trim() && !urlRe.test(formData.website.trim())) e.website = 'Enter a valid website URL';
      if (!formData.hours.trim()) e.hours = 'Enter opening hours';
    }
    if (step === 3) {
      if (images.length < 3) e.images = 'Please add at least 3 photos';
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
      setDone(true);
      setTimeout(onBack, 1600);
    } catch (err: any) {
      setSubmitError(err?.message || 'Could not submit. Please try again.');
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
            <h1 className="text-2xl text-slate-900">Add Your Business</h1>
            <p className="text-slate-600 text-sm">Step {currentStep} of 3</p>
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
              <h3 className="text-lg text-slate-900 mb-4">Business Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Business Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF] focus:border-transparent transition-all shadow-sm ${errors.businessName ? 'border-rose-400' : 'border-slate-200'}`}
                  />
                  {errors.businessName && <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5"><AlertCircle size={13} /> {errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Category *</label>
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
                  <label className="block text-sm text-slate-700 mb-2">Description *</label>
                  <textarea
                    placeholder="Describe your business, services, and what makes you unique..."
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
              Continue to Location
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
              <h3 className="text-lg text-slate-900 mb-4">Location & Contact</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Street Address *</label>
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
                    <label className="block text-sm text-slate-700 mb-2">City *</label>
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
                    <label className="block text-sm text-slate-700 mb-2">Country *</label>
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
                  <label className="block text-sm text-slate-700 mb-2">Phone Number *</label>
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
                  <label className="block text-sm text-slate-700 mb-2">Email (optional)</label>
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
                  <label className="block text-sm text-slate-700 mb-2">Website (optional)</label>
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
                  <label className="block text-sm text-slate-700 mb-2">Business Hours *</label>
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
                Back
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => goToStep(3)}
                className="flex-1 bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 shadow-md"
              >
                Continue to Photos
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
              <h3 className="text-lg text-slate-900 mb-2">Business Photos</h3>
              <p className="text-sm text-slate-600 mb-4">Add at least 3 high-quality photos of your business (max 10)</p>

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
                    <span className="text-xs text-slate-500">Upload</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
              </div>
              {errors.images && <p className="flex items-center gap-1 text-xs text-rose-500 mb-3"><AlertCircle size={13} /> {errors.images}</p>}

              <div className="bg-purple-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex gap-3">
                  <ImageIcon size={20} className="text-[#6200FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 mb-1 font-medium">Photo Tips</p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Use high-resolution images (min 1200x800px)</li>
                      <li>• Show your business exterior, interior, and products</li>
                      <li>• Ensure good lighting and clear focus</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {submitError && <p className="flex items-center gap-1.5 text-sm text-rose-600 mb-2"><AlertCircle size={15} /> {submitError}</p>}
            {done && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-medium mb-2">✓ Submitted! Our team will review it within 24 hours.</div>}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300"
              >
                Back
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting || done}
                className="flex-1 bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
              >
                {submitting ? 'Submitting…' : done ? 'Submitted ✓' : 'Submit for Review'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
