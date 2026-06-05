import { ArrowLeft, Store, ShieldCheck, Check, X, Trash2, Eye, EyeOff, Phone, Clock, Globe, ImagePlus, Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { places as placesApi, admin as adminApi, auth as authApi } from '../lib/api';
import { useStore } from '../store';

interface ManagePlacesPageProps { onBack: () => void; isAdmin?: boolean; }

export function ManagePlacesPage({ onBack, isAdmin }: ManagePlacesPageProps) {
  const { t, refreshPlaces } = useStore();
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

  // ---- admin: review-before-decision modal ----
  const [detail, setDetail] = useState<any | null>(null);
  const [acting, setActing] = useState(false);
  const decide = async (approve: boolean) => {
    if (!detail) return; setActing(true);
    try {
      if (approve) { await adminApi.approvePlace(detail.id); flash(t('mng.tApproved')); }
      else { await adminApi.rejectPlace(detail.id); flash(t('mng.tRejected')); }
      setDetail(null); loadAdmin(); loadMine(); refreshPlaces();
    } catch (e: any) { flash(e?.message || 'Error'); } finally { setActing(false); }
  };

  // ---- admin: report preview modal ----
  const [report, setReport] = useState<any | null>(null);
  const [racting, setRacting] = useState(false);
  const rid = (r: any) => r?.reviewId ?? r?.review_id;
  const moderate = async (kind: 'hide' | 'delete') => {
    if (!report) return; setRacting(true);
    try {
      if (kind === 'hide') { await adminApi.hideReview(rid(report)); flash(t('mng.tHidden')); }
      else { await adminApi.deleteReview(rid(report)); flash(t('mng.tDeleted')); }
      setReport(null); loadAdmin();
    } catch (e: any) { flash(e?.message || 'Error'); } finally { setRacting(false); }
  };

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
    try { await placesApi.uploadPhoto(edit.id, f); flash(t('mng.tPhoto')); loadMine(); refreshPlaces(); } catch { flash(t('mng.tPhotoFail')); }
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
                <button key={p.id} onClick={() => setDetail(p)} className="w-full text-left bg-white rounded-2xl p-3 border border-slate-200 hover:border-[#6200FF] transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.hasPhoto ? `/api/places/${p.id}/photo` : p.image} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).src = p.image; }} className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2b2521] line-clamp-1">{p.name} {p.claimedBy ? <span className="text-xs text-amber-600">(claim)</span> : null}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.category} · {p.city}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#f1ebff] text-[#6200FF] text-xs font-semibold shrink-0 flex items-center gap-1"><Eye size={13} /> {t('mng.review')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t('mng.reports')} ({reports.length})</h3>
            <div className="space-y-2">
              {reports.length === 0 && <p className="text-sm text-slate-400">{t('mng.noReports')}</p>}
              {reports.map((r: any) => (
                <button key={r.id} onClick={() => setReport(r)} className="w-full text-left bg-white rounded-2xl p-3 border border-slate-200 hover:border-[#6200FF] transition-colors flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {r.comment ? <p className="text-sm text-[#2b2521] line-clamp-2">“{r.comment}”</p> : <p className="text-sm text-slate-400">Review #{r.reviewId}</p>}
                    <p className="text-xs text-slate-500 mt-0.5">{r.author ? `${r.author} · ` : ''}{r.rating ? `★${r.rating} · ` : ''}<span className="text-rose-500">{r.reason || 'reported'}</span>{r.hidden ? ' · hidden' : ''}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#f1ebff] text-[#6200FF] text-xs font-semibold shrink-0 flex items-center gap-1"><Eye size={13} /> {t('mng.review')}</span>
                </button>
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

      {/* Admin: review-before-decision detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !acting && setDetail(null)}
            className="fixed inset-0 z-[1050] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
              <img src={detail.hasPhoto ? `/api/places/${detail.id}/photo` : detail.image} alt="" onError={(e) => { (e.currentTarget as HTMLImageElement).src = detail.image; }} className="w-full h-44 object-cover bg-slate-100" />
              <div className="p-6 overflow-y-auto space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#2b2521]">{detail.name}</h3>
                    <p className="text-sm text-slate-500">{detail.category} · {detail.city}{detail.country ? `, ${detail.country}` : ''}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${detail.claimedBy ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{detail.claimedBy ? t('mng.claimReq') : t('mng.newPlace')}</span>
                </div>
                <div className="space-y-1.5 text-sm text-slate-600">
                  {detail.phone && <p className="flex items-center gap-2"><Phone size={15} className="text-slate-400" /> {detail.phone}</p>}
                  {detail.website && <p className="flex items-center gap-2 break-all"><Globe size={15} className="text-slate-400 shrink-0" /> {detail.website}</p>}
                  {detail.openingHours && <p className="flex items-center gap-2"><Clock size={15} className="text-slate-400" /> {detail.openingHours}</p>}
                  {detail.price && <p className="flex items-center gap-2"><Store size={15} className="text-slate-400" /> {detail.price}</p>}
                  {(detail.lat || detail.lng) ? (
                    <a href={`https://www.google.com/maps?q=${detail.lat},${detail.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6200FF] hover:underline"><MapPin size={15} /> {detail.lat?.toFixed?.(5)}, {detail.lng?.toFixed?.(5)}</a>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-2 border-t border-slate-100">
                <button onClick={() => decide(false)} disabled={acting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 disabled:opacity-60">{acting ? <Loader2 size={17} className="animate-spin" /> : <><X size={17} /> {t('mng.reject')}</>}</button>
                <button onClick={() => decide(true)} disabled={acting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-60">{acting ? <Loader2 size={17} className="animate-spin" /> : <><Check size={17} /> {t('mng.approve')}</>}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin: report preview modal */}
      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !racting && setReport(null)}
            className="fixed inset-0 z-[1050] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 pb-3 border-b border-slate-100">
                <h3 className="font-display text-lg font-bold text-[#2b2521]">{t('mng.reportedReview')}</h3>
                <button onClick={() => setReport(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  {report.comment ? <p className="text-[#2b2521] leading-relaxed">“{report.comment}”</p> : <p className="text-slate-400">Review #{report.reviewId}</p>}
                </div>
                <div className="space-y-1.5 text-sm text-slate-600">
                  {report.author && <p><span className="text-slate-400">{t('mng.author')}: </span>{report.author}</p>}
                  {report.rating ? <p><span className="text-slate-400">{t('mng.ratingL')}: </span>★ {report.rating}</p> : null}
                  <p><span className="text-slate-400">{t('mng.reasonL')}: </span><span className="text-rose-500 font-medium">{report.reason || 'reported'}</span></p>
                  <p><span className="text-slate-400">{t('mng.statusL')}: </span>{report.hidden ? t('mng.hidden') : t('mng.visible')}</p>
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-2 border-t border-slate-100">
                <button onClick={() => moderate('hide')} disabled={racting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 disabled:opacity-60"><EyeOff size={16} /> {t('mng.hide')}</button>
                <button onClick={() => moderate('delete')} disabled={racting} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 disabled:opacity-60">{racting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> {t('mng.delete')}</>}</button>
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
