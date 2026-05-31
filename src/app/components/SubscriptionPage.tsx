import { ArrowLeft, Check, Crown, TrendingUp, MapPin, BarChart, Zap, Users, Star, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface SubscriptionPageProps {
  onBack: () => void;
}

export function SubscriptionPage({ onBack }: SubscriptionPageProps) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      color: 'from-slate-600 to-slate-700',
      features: [
        'List your business profile',
        'Upload up to 10 photos',
        'Basic analytics dashboard',
        'Respond to customer reviews',
        'Business hours & contact info',
        'Email support',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$79',
      period: '/month',
      color: 'from-[#4a00cc] to-[#6200FF]',
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited photos & videos',
        'Advanced analytics & insights',
        'Priority customer support',
        'Featured placement in search',
        'Custom booking integration',
        'Social media auto-posting',
        'Competitor analysis tools',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      color: 'from-amber-600 to-orange-600',
      features: [
        'Everything in Professional',
        'Manage multiple locations',
        'Full API access',
        'Dedicated account manager',
        'White-label solutions',
        'Custom integrations',
        'Advanced marketing campaigns',
        'Analytics & reporting suite',
      ],
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Reach thousands of potential customers actively searching for businesses like yours',
    },
    {
      icon: MapPin,
      title: 'Local Visibility',
      description: 'Appear prominently in local searches and maps when customers are nearby',
    },
    {
      icon: BarChart,
      title: 'Business Insights',
      description: 'Understand your customers with detailed analytics and actionable insights',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4a00cc] to-[#6200FF] px-6 sm:px-8 pt-8 pb-8 rounded-3xl shadow-xl shadow-purple-600/20">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-6 bg-white/20 backdrop-blur-xl p-3 rounded-2xl hover:bg-white/30 transition-colors inline-flex border border-white/30 shadow-lg"
        >
          <ArrowLeft size={24} className="text-white" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">Business Plans</h1>
              <p className="text-purple-100">
                Join 10,000+ thriving businesses
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="py-6">
        <h2 className="font-semibold text-slate-900 mb-4">Why List on Wetigo?</h2>
        <div className="space-y-3">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Icon size={22} className="text-[#6200FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1.5">{benefit.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Plans */}
      <div className="mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-slate-200 hover:border-[#6200FF] transition-all duration-300"
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-[#4a00cc] to-[#6200FF] text-white text-center py-2.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
                  <Zap size={16} className="fill-white" />
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <div className={`relative bg-gradient-to-br ${plan.color} rounded-3xl p-6 mb-5 shadow-xl`}>
                  <div className="relative">
                    <h3 className="text-2xl text-white mb-2 font-semibold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl text-white font-bold">{plan.price}</span>
                      <span className="text-xl text-white/80">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-lg bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={14} className="text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 shadow-md`}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <h3 className="font-semibold text-slate-900 mb-4 text-center">Trusted by Businesses Worldwide</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, value: '10K+', label: 'Businesses' },
              { icon: Star, value: '4.9', label: 'Avg Rating' },
              { icon: Target, value: '2M+', label: 'Customers' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Icon size={22} className="text-[#6200FF]" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pb-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl">
          <h3 className="text-xl text-white mb-2 font-semibold">Need a Custom Solution?</h3>
          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            Contact our sales team for tailored enterprise solutions and volume pricing
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-semibold hover:bg-slate-100 transition-colors shadow-lg"
          >
            Contact Sales Team
          </motion.button>
        </div>
      </div>
    </div>
  );
}
