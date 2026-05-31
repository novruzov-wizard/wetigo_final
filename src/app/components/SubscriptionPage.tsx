import { ArrowLeft, Check, Star, Zap, Crown, TrendingUp, BarChart3, BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface SubscriptionPageProps {
  onBack: () => void;
  onChoosePlan: (plan: { id: string; name: string; price: number; cycle: 'month' | 'year' }) => void;
  currentPlan?: string;
}

export function SubscriptionPage({ onBack, onChoosePlan, currentPlan = 'free' }: SubscriptionPageProps) {
  const [cycle, setCycle] = useState<'month' | 'year'>('month');

  const plans = [
    {
      id: 'free', name: 'Starter', icon: Star, tagline: 'For exploring',
      monthly: 0, color: '#64748b',
      features: ['Browse & review places', 'Save up to 20 favorites', 'Join community chats', 'Standard search results'],
    },
    {
      id: 'pro', name: 'Pro', icon: Zap, tagline: 'For power users', popular: true,
      monthly: 12, color: '#6200FF',
      features: ['Everything in Starter', 'Unlimited favorites & tracking', 'Promoted in search & categories', 'Verified profile badge', 'Create unlimited events'],
    },
    {
      id: 'business', name: 'Business', icon: Crown, tagline: 'For owners',
      monthly: 39, color: '#b45309',
      features: ['Everything in Pro', 'Top placement for your listings', 'Audience & performance analytics', 'Respond as the business', 'Priority support'],
    },
  ];

  const priceFor = (m: number) => (cycle === 'year' ? Math.round(m * 12 * 0.8) : m);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#6200FF] mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1ebff] text-[#6200FF] text-xs font-semibold mb-4">
          <Crown size={13} /> Wetigo Premium
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2b2521] mb-3">Grow faster with Wetigo</h1>
        <p className="text-slate-500 max-w-md mx-auto">Get discovered first, unlock analytics, and turn reviews into customers.</p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 mt-6 p-1 rounded-full bg-white border border-slate-200 shadow-sm">
          {(['month', 'year'] as const).map((c) => (
            <button key={c} onClick={() => setCycle(c)} className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              style={cycle === c ? { background: '#6200FF', color: '#fff' } : { color: '#6b7280' }}>
              {c === 'month' ? 'Monthly' : 'Yearly'}
              {c === 'year' && <span className={`ml-1.5 text-[10px] ${cycle === 'year' ? 'text-white/90' : 'text-emerald-600'}`}>-20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          const price = priceFor(plan.monthly);
          const isCurrent = currentPlan === plan.id;
          const isPopular = (plan as any).popular;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
              className="relative bg-white rounded-3xl border p-6 shadow-sm"
              style={{ borderColor: isPopular ? '#6200FF' : '#e9e4dc', boxShadow: isPopular ? '0 20px 50px -20px rgba(98,0,255,.35)' : undefined }}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#6200FF] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  <Zap size={12} className="fill-white" /> Most Popular
                </span>
              )}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${plan.color}1a` }}>
                <Icon size={24} style={{ color: plan.color }} />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2b2521]">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{plan.tagline}</p>
              <div className="flex items-end gap-1 mb-5">
                <span className="font-display text-4xl font-bold text-[#2b2521]">${price}</span>
                <span className="text-slate-400 text-sm mb-1.5">/{cycle === 'year' ? 'yr' : 'mo'}</span>
              </div>

              <button
                onClick={() => isCurrent ? undefined : (plan.monthly === 0 ? onBack() : onChoosePlan({ id: plan.id, name: plan.name, price, cycle }))}
                disabled={isCurrent}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors mb-5"
                style={isCurrent
                  ? { background: '#f1f5f9', color: '#94a3b8', cursor: 'default' }
                  : isPopular ? { background: '#6200FF', color: '#fff' } : { background: '#2b2521', color: '#fff' }}
              >
                {isCurrent ? 'Current plan' : plan.monthly === 0 ? 'Get started' : `Choose ${plan.name}`}
              </button>

              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={13} className="text-emerald-600" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Why premium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: TrendingUp, title: 'Get discovered', desc: 'Promoted placement puts you in front of more explorers.' },
          { icon: BarChart3, title: 'Know your audience', desc: 'See views, saves and review trends in real time.' },
          { icon: BadgeCheck, title: 'Build trust', desc: 'A verified badge signals quality to every visitor.' },
        ].map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
              <Icon size={22} className="text-[#6200FF] mb-3" />
              <h4 className="font-semibold text-[#2b2521] mb-1">{b.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
