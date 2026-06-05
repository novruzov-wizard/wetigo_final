import { ArrowLeft, Store, ShieldCheck, Check, X, Trash2, Eye, EyeOff, Phone, Clock, Globe, ImagePlus, Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { places as placesApi, admin as adminApi, auth as authApi } from '../lib/api';
import { useStore } from '../store';

interface ManagePlacesPageProps { onBack: () => void; isAdmin?: boolean; }

export function ManagePlacesPage({ onBack, isAdmin }: ManagePlacesPageProps) {
  const { t } = useStore();
  const [tab, setTab] = useState<'mine' | 'admin'>(isAdmin ? 'admin' : 'mine');
  const [mine, setMine] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); window.clearTimeout((flash as any)._t); (flash as any)._t = window.setTimeout(() => setToast(null), 2200); };

  const loadMine = () => placesApi.mine().then(setMine).catch(() => setMine([]));
  const loadAdmin = () => { adminApi.pendingPlaces().then(setPending).catch(() => setPending([])); adminApi.reports().then(setReports).catch(() => setReports([])); };
  useEffect(() => { Promise.all([loadMine(), isAdmin ? loadAdmin() : null]).finally(() => setLoading(false)); /* eslint-disable-next-line */ }, []);

  // ---- owner edit modal ----
  const [edit, setEdit] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const openEdit = (p: any) => { setEdit(p); setForm({ phone: p.phone || '', website: p.website || '', openingHours: p.openingHours || '', price: p.price || '$$', city: p.city || '' }); };
  const saveEdit = async () => {
    if (!edit) return; setSaving(true);
    try { await placesApi.update(edit.id, form); flash(t('mng.tSaved')); setEdit(null); loadMine(); }
    catch (e: any) { flash(e?.message || t('mng.tSaveFail')); } finally { setSaving(false); }
  };
  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !edit) return;
    try { await placesApi.uploadPhoto(edit.id, f); flash(t('mng.tPhoto')); loadMine(); } catch { flash(t('mng.tPhotoFail')); }
    e.target.value = '';
  };

  const statusChip = (s: string) => {
    const map: Record<string, string> = { approved: 'bg-emerald-50 text-emerald-600', pending: 'bg-amber-50 text-amber-600', rejected: 'bg-rose-50 text-rose-600' };
    const lbl: Record<string,string> = { approved: t('mng.approved'), pending: t('mng.pendingS'), rejected: t('mng.rejected') };
    return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${map[s] || 'bg-slate-100 text-slate-500'}`}>{lbl[s] || s}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={22} /></button>
        <h1 className="font-display text-2xl font-bold text-[#2b2521]">{t('mng.title')}</h1>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex gap-1 mb-5">
          {(['mine', 'admin'] as const).map((x) => (
            <button key={x} onClick={() => setTab(x)} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === x ? 'bg-[#6200FF] text-white' : 'text-slate-600'}`}>
              {x === 'mine' ? t('mng.mine') : t('mng.admin')}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="py-16 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" /></div>}

      {/* ---- My businesses ---- */}
      {!loading && tab === 'mine' && (
        <div className="space-y-3">
          {mine.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3"><Store size={22} className="text-slate-300" /></div>
              <p className="text-sm font-medium text-slate-700 mb-1">{t('mng.empty')}</p>
              <p className="text-xs text-slate-500">{t('mng.emptyDesc')}</p>
            </div>
          )}
          {mine.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <img src={p.hasPhoto ? p.image : (p.image || '')} alt="" className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-semibold text-[#2b2521] line-clamp-1">{p.name}</p>{statusChip(p.status)}</div>
                <p className="text-xs text-slate-500 line-clamp-1">{p.category} · {p.city}</p>
              </div>
              <button onClick={() => openEdit(p)} className="px-3 py-2 rounded-xl bg-[#f1ebff] text-[#6200FF] text-sm font-semibold hover:bg-[#e3d6ff] shrink-0">{t('mng.edit')}</button>
            </div>
          ))}
        </div>
      )}

      {/* ---- Admin ---- */}
      {!loading && tab === 'admin' && isAdmin && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t('mng.pending')} ({pending.length})</h3>
            <div className="space-y-2">
              {pending.length === 0 && <p className="text-sm text-slate-400">{t('mng.nothingPending')}</p>}
              {pending.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2b2521] line-clamp-1">{p.name} {p.claimedBy ? <span className="text-xs text-amber-600">(claim)</span> : null}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.category} · {p.city}</p>
                  </div>
                  <button onClick={() => adminApi.approvePlace(p.id).then(() => { flash(t('mng.tApproved')); loadAdmin(); })} className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center"><Check size={16} /></button>
                  <button onClick={() => adminApi.rejectPlace(p.id).then(() => { flash(t('mng.tRejected')); loadAdmin(); })} className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t('mng.reports')} ({reports.length})</h3>
            <div className="space-y-2">
              {reports.length === 0 && <p className="text-sm text-slate-400">{t('mng.noReports')}</p>}
              {reports.map((r: any) => (
                <div key={r.id} className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-3">
                  <div className="flex-1 min-w-0"><p className="text-sm text-[#2b2521]">Review #{r.reviewId ?? r.review_id ?? r.id}</p><p className="text-xs text-slate-500">{r.reason || 'reported'}</p></div>
                  <button onClick={() => adminApi.hideReview(r.reviewId ?? r.review_id).then(() => flash(t('mng.tHidden')))} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"><EyeOff size={13} /> {t('mng.hide')}</button>
                  <button onClick={() => adminApi.deleteReview(r.reviewId ?? r.review_id).then(() => flash(t('mng.tDeleted')))} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1"><Trash2 size={13} /> {t('mng.delete')}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- Edit modal ---- */}
      <AnimatePresence>
        {edit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEdit(null)}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-display text-lg font-bold text-[#2b2521] line-clamp-1">{edit.name}</h3>
                <button onClick={() => setEdit(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                <Field icon={<Phone size={16} />} label={t('det.phone')} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+994 ..." />
                <Field icon={<Globe size={16} />} label={t('det.website')} value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://" />
                <Field icon={<Clock size={16} />} label={t('det.hours')} value={form.openingHours} onChange={(v) => setForm({ ...form, openingHours: v })} placeholder="Mo-Su 09:00-23:00" />
                <Field icon={<MapPin size={16} />} label={t('mng.address')} value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">{t('mng.price')}</label>
                  <div className="flex gap-2">{['$', '$$', '$$$', '$$$$'].map((pr) => (
                    <button key={pr} onClick={() => setForm({ ...form, price: pr })} className={`flex-1 py-2 rounded-xl border text-sm font-semibold ${form.price === pr ? 'bg-[#6200FF] text-white border-[#6200FF]' : 'bg-white border-slate-200 text-slate-600'}`}>{pr}</button>
                  ))}</div>
                </div>
                <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#6200FF] hover:text-[#6200FF] text-sm font-semibold"><ImagePlus size={17} /> {t('mng.uploadPhoto')}</button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
              </div>
              <div className="flex gap-3 p-6 pt-2">
                <button onClick={() => setEdit(null)} className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50">{t('mng.cancel')}</button>
                <button onClick={saveEdit} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6200FF] text-white font-semibold hover:bg-[#5400dd] disabled:opacity-60">{saving ? <Loader2 size={17} className="animate-spin" /> : <><Check size={17} /> {t('mng.save')}</>}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1100] bg-[#2b2521] text-white text-sm font-medium px-5 py-3 rounded-full shadow-2xl">{toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ icon, label, value, onChange, placeholder }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#2b2521] focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
      </div>
    </div>
  );
}
