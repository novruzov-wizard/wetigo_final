import { ArrowLeft, Lock, CreditCard, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { startCheckout, stripeConfigured } from '../lib/stripe';

interface Plan { id: string; name: string; price: number; cycle: 'month' | 'year'; }
interface PaymentPageProps {
  plan: Plan;
  onBack: () => void;
  onSuccess: (planId: string) => void;
}

export function PaymentPage({ plan, onBack, onSuccess }: PaymentPageProps) {
  const [card, setCard] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [error, setError] = useState('');

  const tax = +(plan.price * 0.08).toFixed(2);
  const total = +(plan.price + tax).toFixed(2);

  const fmtNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/(.{2})(.+)/, '$1/$2');

  const valid = card.name.trim() && card.number.replace(/\s/g, '').length >= 15 && card.exp.length === 5 && card.cvc.length >= 3;

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('processing');
    try {
      // If Stripe is configured with keys + price IDs, redirect to Checkout.
      const redirected = await startCheckout(plan.id, plan.cycle);
      if (redirected) return; // browser navigates away
    } catch {
      setError('Could not reach Stripe. Please try again.');
      setStatus('idle');
      return;
    }
    // In-app fallback (no Stripe keys yet) — simulate processing.
    setTimeout(() => {
      setStatus('done');
      setTimeout(() => onSuccess(plan.id), 1400);
    }, 1400);
  };

  if (status === 'done') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-emerald-600" strokeWidth={3} />
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-[#2b2521] mb-2">You're {plan.name}! 🎉</h1>
        <p className="text-slate-500">Your subscription is active. Unlocking your premium features…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#6200FF] mb-6">
        <ArrowLeft size={18} /> Back to plans
      </button>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Card form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-[#2b2521] mb-1">Payment details</h1>
          <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5"><Lock size={14} /> Secured by Stripe · encrypted</p>

          {!stripeConfigured && (
            <div className="mb-5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-3 py-2">
              Demo mode — add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to process real payments via Stripe Checkout.
            </div>
          )}

          <form onSubmit={pay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Cardholder name</label>
              <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Card number</label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={card.number} onChange={(e) => setCard({ ...card, number: fmtNumber(e.target.value) })} placeholder="4242 4242 4242 4242" inputMode="numeric"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Expiry</label>
                <input value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM/YY" inputMode="numeric"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">CVC</label>
                <input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" inputMode="numeric"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#2b2521] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button type="submit" disabled={!valid || status === 'processing'}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#6200FF] text-white font-semibold shadow-lg shadow-[#6200FF]/25 hover:bg-[#5400dd] disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed transition-colors">
              {status === 'processing' ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : <><Lock size={16} /> Pay ${total}</>}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display font-bold text-[#2b2521] mb-4">Order summary</h2>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-semibold text-[#2b2521]">Wetigo {plan.name}</p>
              <p className="text-xs text-slate-400">Billed {plan.cycle === 'year' ? 'yearly' : 'monthly'}</p>
            </div>
            <span className="font-semibold text-[#2b2521]">${plan.price}</span>
          </div>
          <div className="flex items-center justify-between py-2 text-sm text-slate-500"><span>Subtotal</span><span>${plan.price}</span></div>
          <div className="flex items-center justify-between py-2 text-sm text-slate-500 border-b border-slate-100"><span>Tax (8%)</span><span>${tax}</span></div>
          <div className="flex items-center justify-between pt-4">
            <span className="font-semibold text-[#2b2521]">Total</span>
            <span className="font-display text-2xl font-bold text-[#2b2521]">${total}</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">You can cancel anytime from Settings. {plan.cycle === 'year' ? 'Yearly plans include a 20% discount.' : ''}</p>
        </div>
      </div>
    </div>
  );
}
