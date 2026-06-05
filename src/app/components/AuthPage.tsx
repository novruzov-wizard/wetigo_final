import { useRef, useState } from 'react';
import { Eye, EyeOff, Star, MapPin, ArrowRight, Check, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { auth as authApi } from '../lib/api';

interface AuthPageProps {
  onAuth: () => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const { t, updateUser, setLang } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'form' | 'verify' | 'forgot' | 'reset'>('form');
  const [newPassword, setNewPassword] = useState('');
  const [info, setInfo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', birthDate: '' });
  const [remember, setRemember] = useState(true);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSignup = mode === 'signup';
  const canSubmit = form.email.trim() && form.password.trim() && (!isSignup || (form.name.trim() && form.birthDate.trim()));

  // Save token + user into the store, then enter the app.
  const finishAuth = (res: { token: string; refreshToken?: string; user: any }) => {
    authApi.setSession(res);
    if (res.user) {
      updateUser({
        name: res.user.name ?? 'Wetigo User',
        email: res.user.email ?? '',
        bio: res.user.bio ?? '',
        avatar: res.user.avatar ?? 'https://i.pravatar.cc/160?img=12',
      });
      if (res.user.language) { try { setLang(res.user.language); } catch { /* ignore */ } }
    }
    onAuth();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError(''); setLoading(true);
    try {
      if (isSignup) {
        await authApi.register(form);   // backend sends OTP (emails it / returns devCode)
        setStep('verify');
      } else {
        const res = await authApi.login({ email: form.email, password: form.password });
        finishAuth(res as any);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) codeRefs.current[i + 1]?.focus();
  };
  const onCodeKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) codeRefs.current[i - 1]?.focus();
  };
  const codeComplete = code.every((c) => c !== '');

  const verify = async () => {
    if (!codeComplete || loading) return;
    setError(''); setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email: form.email, code: code.join('') });
      finishAuth(res as any);
    } catch (err: any) {
      setError(err?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try { await authApi.resendOtp({ email: form.email }); setResent(true); setTimeout(() => setResent(false), 2500); } catch { /* ignore */ }
  };

  // ---- forgot / reset password ----
  const sendReset = async () => {
    if (!form.email.trim() || loading) return;
    setError(''); setInfo(''); setLoading(true);
    try {
      await authApi.forgotPassword({ email: form.email.trim() });
      setCode(['', '', '', '', '', '']); setNewPassword('');
      setInfo('We sent a 6-digit code to your email.');
      setStep('reset');
    } catch (err: any) {
      setError(err?.message || 'Could not send reset code');
    } finally { setLoading(false); }
  };
  const doReset = async () => {
    if (!codeComplete || newPassword.trim().length < 6 || loading) return;
    setError(''); setLoading(true);
    try {
      const res = await authApi.resetPassword({ email: form.email.trim(), code: code.join(''), password: newPassword.trim() });
      if (res && (res as any).token) { finishAuth(res as any); return; }
      setInfo('Password updated. Please sign in.');
      setStep('form'); setMode('signin'); setForm({ ...form, password: '' });
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired code');
    } finally { setLoading(false); }
  };

  const oauth = (provider: 'google' | 'facebook') => {
    // Redirect to the backend's OAuth start; it bounces to Google/Facebook,
    // then back to {APP_URL}/auth/callback#token=... (handled in App).
    const base = (import.meta as any).env?.VITE_API_URL || '';
    window.location.href = `${base}/auth/oauth/${provider}/start`;
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-[#f5f6f4] p-3 sm:p-5">
      <div className="w-full grid lg:grid-cols-2 rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-[#2b2521]/10 max-w-6xl mx-auto my-auto">
        {/* ===== Left: form / verification ===== */}
        <div className="px-7 sm:px-12 lg:px-16 py-10 lg:py-14 flex flex-col">
          {/* Mobile brand banner (the purple showcase is desktop-only) */}
          <div className="lg:hidden -mx-7 sm:-mx-12 -mt-10 mb-8 px-7 sm:px-12 pt-8 pb-6 rounded-b-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(150deg,#4a00cc 0%,#6200FF 55%,#7c10ff 100%)' }}>
            <div className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <span className="text-white text-2xl font-extrabold tracking-tight">Wetigo</span>
              <span className="text-white/90 text-xs font-medium bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">Where to go?</span>
            </div>
            <p className="relative text-white/85 text-sm mt-3 max-w-xs">{t('auth.discover')}</p>
          </div>
          <div className="hidden lg:block mb-8">
            <span className="font-display text-4xl font-extrabold tracking-tight text-[#6200FF]">Wetigo</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'forgot' ? (
              <motion.div key="forgot" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="flex-1 flex flex-col justify-center max-w-md w-full">
                <button onClick={() => { setStep('form'); setError(''); setInfo(''); }} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#6200FF] mb-6 w-fit">
                  <ArrowLeft size={16} /> {t('auth.back')}
                </button>
                <div className="w-14 h-14 rounded-2xl bg-[#f1ebff] flex items-center justify-center mb-5"><ShieldCheck size={26} className="text-[#6200FF]" /></div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2b2521] mb-2">{t('auth.forgotTitle')}</h1>
                <p className="text-slate-500 mb-8">{t('auth.forgotDesc')}</p>
                <label className="block text-sm font-medium text-[#5c524a] mb-1.5">{t('auth.email')}</label>
                <input type="email" placeholder="example@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition mb-4" />
                {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}
                <button onClick={sendReset} disabled={!form.email.trim() || loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed transition">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>{t('auth.sendCode')} <ArrowRight size={18} /></>}
                </button>
              </motion.div>
            ) : step === 'reset' ? (
              <motion.div key="reset" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="flex-1 flex flex-col justify-center max-w-md w-full">
                <button onClick={() => { setStep('forgot'); setError(''); }} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#6200FF] mb-6 w-fit">
                  <ArrowLeft size={16} /> {t('auth.back')}
                </button>
                <div className="w-14 h-14 rounded-2xl bg-[#f1ebff] flex items-center justify-center mb-5"><ShieldCheck size={26} className="text-[#6200FF]" /></div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2b2521] mb-2">{t('auth.resetTitle')}</h1>
                <p className="text-slate-500 mb-6">{t('auth.verifyDesc')} <span className="font-semibold text-[#2b2521]">{form.email}</span>.</p>
                {info && <p className="text-sm text-emerald-600 mb-3">{info}</p>}
                <div className="flex gap-2 sm:gap-3 mb-5">
                  {code.map((c, i) => (
                    <input key={i} ref={(el) => { codeRefs.current[i] = el; }} value={c} onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onCodeKey(i, e)}
                      inputMode="numeric" maxLength={1}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-slate-50 border-2 border-slate-200 text-[#2b2521] focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                  ))}
                </div>
                <label className="block text-sm font-medium text-[#5c524a] mb-1.5">{t('auth.newPassword')}</label>
                <div className="relative mb-4">
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6200FF] p-1">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
                {newPassword.length > 0 && newPassword.length < 6 && <p className="text-xs text-rose-500 mb-3">Password must be at least 6 characters</p>}
                {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}
                <button onClick={doReset} disabled={!codeComplete || newPassword.trim().length < 6 || loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed transition mb-4">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>{t('auth.resetTitle')} <ArrowRight size={18} /></>}
                </button>
                <p className="text-sm text-slate-500 text-center">{t('auth.didnt')} <button onClick={sendReset} className="font-semibold text-[#6200FF] hover:opacity-80">{t('auth.resend')}</button></p>
              </motion.div>
            ) : step === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                className="flex-1 flex flex-col justify-center max-w-md w-full">
                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2b2521] mb-3">
                  {isSignup ? t('auth.create') : t('auth.welcome')}
                </h1>
                <p className="text-slate-500 mb-8">
                  {isSignup ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                  <button onClick={() => setMode(isSignup ? 'signin' : 'signup')} className="font-semibold text-[#6200FF] underline underline-offset-4 hover:opacity-80">
                    {isSignup ? t('auth.signin') : t('auth.createNow')}
                  </button>
                </p>

                <form onSubmit={submit} className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {isSignup && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-sm font-medium text-[#5c524a] mb-1.5">{t('auth.fullname')}</label>
                        <input type="text" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                        <label className="block text-sm font-medium text-[#5c524a] mb-1.5 mt-4">{t('auth.birthDate')}</label>
                        <input type="date" max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label className="block text-sm font-medium text-[#5c524a] mb-1.5">{t('auth.email')}</label>
                    <input type="email" placeholder="example@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5c524a] mb-1.5">{t('auth.password')}</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6200FF] p-1">
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button type="button" onClick={() => setRemember(!remember)} className="flex items-center gap-2 text-sm text-[#5c524a]">
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${remember ? 'bg-[#6200FF] border-[#6200FF]' : 'border-slate-300 bg-white'}`}>
                        {remember && <Check size={13} className="text-white" strokeWidth={3} />}
                      </span>
                      {t('auth.remember')}
                    </button>
                    <button type="button" onClick={() => { setStep('forgot'); setError(''); setInfo(''); }} className="text-sm font-semibold text-[#2b2521] underline underline-offset-4 hover:text-[#6200FF]">{t('auth.forgot')}</button>
                  </div>
                  {info && <p className="text-sm text-emerald-600">{info}</p>}
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                  <button type="submit" disabled={!canSubmit || loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed transition">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>{isSignup ? t('auth.create') : t('auth.signin')} <ArrowRight size={18} /></>}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="space-y-3">
                  <button onClick={() => oauth('google')} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white text-[#2b2521] font-medium hover:bg-slate-50 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>
                    {t('auth.continueGoogle')}
                  </button>
                  {/* Facebook OAuth temporarily disabled until app review is approved */}
                </div>
              </motion.div>
            ) : (
              <motion.div key="verify" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="flex-1 flex flex-col justify-center max-w-md w-full">
                <button onClick={() => setStep('form')} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#6200FF] mb-6 w-fit">
                  <ArrowLeft size={16} /> {t('auth.back')}
                </button>
                <div className="w-14 h-14 rounded-2xl bg-[#f1ebff] flex items-center justify-center mb-5">
                  <ShieldCheck size={26} className="text-[#6200FF]" />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2b2521] mb-2">{t('auth.verifyTitle')}</h1>
                <p className="text-slate-500 mb-8">{t('auth.verifyDesc')} <span className="font-semibold text-[#2b2521]">{form.email || 'your email'}</span>. Enter it below to continue.</p>

                <div className="flex gap-2 sm:gap-3 mb-6">
                  {code.map((c, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeRefs.current[i] = el; }}
                      value={c}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onCodeKey(i, e)}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-slate-50 border-2 border-slate-200 text-[#2b2521] focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition"
                    />
                  ))}
                </div>

                <button onClick={verify} disabled={!codeComplete}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed transition mb-4">
                  {t('auth.verifyContinue')} <ArrowRight size={18} />
                </button>
                <p className="text-sm text-slate-500 text-center">
                  {t('auth.didnt')}{' '}
                  <button onClick={resend} className="font-semibold text-[#6200FF] hover:opacity-80">
                    {resent ? t('auth.resent') : t('auth.resend')}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===== Right: brand showcase (Wetigo purple) ===== */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12"
          style={{ background: 'linear-gradient(150deg, #4a00cc 0%, #6200FF 55%, #7c10ff 100%)' }}>
          <div className="pointer-events-none absolute -top-20 -right-16 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative flex justify-end">
            <span className="text-white/90 text-sm font-medium bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">Where to go?</span>
          </div>

          <div className="relative my-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm">
              <div className="relative h-44">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop" alt="Featured place" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow">
                  <Star size={13} className="text-amber-500 fill-amber-500" /><span className="text-sm font-bold text-[#2b2521]">4.9</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-[#2b2521] mb-1">La Cucina Italiana</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} className="text-[#6200FF]" /> City Center, Chicago</div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-white leading-tight mb-3">{t('auth.discover')}</h2>
            <p className="text-white/80 leading-relaxed max-w-sm">{t('auth.discoverDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
