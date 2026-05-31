import { useState } from 'react';
import { Eye, EyeOff, Star, MapPin, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import wetigoLogo from './figma/logo.png';

interface AuthPageProps {
  onAuth: () => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [remember, setRemember] = useState(true);

  const isSignup = mode === 'signup';
  const canSubmit = form.email.trim() && form.password.trim() && (!isSignup || form.name.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onAuth();
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-[var(--cream)] p-3 sm:p-5">
      <div className="w-full grid lg:grid-cols-2 rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-[#2b2521]/10 max-w-6xl mx-auto my-auto">
        {/* ===== Left: form ===== */}
        <div className="px-7 sm:px-12 lg:px-16 py-10 lg:py-14 flex flex-col">
          <img src={wetigoLogo} alt="Wetigo" className="h-16 w-auto object-contain -ml-2 mb-10" />

          <div className="flex-1 flex flex-col justify-center max-w-md w-full">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2b2521] mb-3">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-[#8a7d72] mb-8">
              {isSignup ? 'Already a member?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setMode(isSignup ? 'signin' : 'signup')}
                className="font-semibold text-[#6200FF] underline underline-offset-4 hover:opacity-80"
              >
                {isSignup ? 'Sign in' : 'Create now'}
              </button>
            </p>

            <form onSubmit={submit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isSignup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Full name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#faf4ec] border border-[#e7dccd] text-[#2b2521] placeholder:text-[#b3a596] focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-[#5c524a] mb-1.5">E-mail</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#faf4ec] border border-[#e7dccd] text-[#2b2521] placeholder:text-[#b3a596] focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c524a] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#faf4ec] border border-[#e7dccd] text-[#2b2521] placeholder:text-[#b3a596] focus:outline-none focus:border-[#6200FF] focus:ring-2 focus:ring-[#6200FF]/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89a8b] hover:text-[#6200FF] p-1"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className="flex items-center gap-2 text-sm text-[#5c524a]"
                >
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${remember ? 'bg-[#6200FF] border-[#6200FF]' : 'border-[#cbbcab] bg-white'}`}>
                    {remember && <Check size={13} className="text-white" strokeWidth={3} />}
                  </span>
                  Remember me
                </button>
                <button type="button" className="text-sm font-semibold text-[#2b2521] underline underline-offset-4 hover:text-[#6200FF]">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-[#d8cdbf] disabled:shadow-none disabled:cursor-not-allowed transition"
              >
                {isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e7dccd]" />
              <span className="text-xs font-medium text-[#a89a8b] uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-[#e7dccd]" />
            </div>

            <div className="space-y-3">
              <button onClick={onAuth} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#e7dccd] bg-white text-[#2b2521] font-medium hover:bg-[#faf4ec] transition">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>
                Continue with Google
              </button>
              <button onClick={onAuth} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#e7dccd] bg-white text-[#2b2521] font-medium hover:bg-[#faf4ec] transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg>
                Continue with Facebook
              </button>
            </div>
          </div>
        </div>

        {/* ===== Right: brand showcase ===== */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12"
          style={{ background: 'linear-gradient(150deg, #e9c7a8 0%, #d49a72 55%, #b5764f 100%)' }}>
          <div className="pointer-events-none absolute -top-20 -right-16 w-80 h-80 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-[#6200FF]/15 blur-3xl" />

          <div className="relative flex justify-end">
            <span className="text-white/90 text-sm font-medium bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">Where to go?</span>
          </div>

          {/* Floating place card */}
          <div className="relative my-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm"
            >
              <div className="relative h-44">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop" alt="Featured place" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-[#2b2521]">4.9</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-[#2b2521] mb-1">La Cucina Italiana</h3>
                <div className="flex items-center gap-1.5 text-sm text-[#8a7d72]">
                  <MapPin size={14} className="text-[#6200FF]" /> City Center, Chicago
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-white leading-tight mb-3">
              Discover places<br />worth your time.
            </h2>
            <p className="text-white/80 leading-relaxed max-w-sm">
              Join 50,000+ explorers finding and reviewing the best local businesses — rated by a community you can trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
