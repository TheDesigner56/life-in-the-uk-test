import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, Check, X, Shield, Clock,
  GraduationCap, BarChart3, Infinity, Target, FileText,
  ChevronRight, AlertTriangle, Star
} from 'lucide-react';
import Layout from '@/components/Layout';
import { upgradeTier, type UserTier } from '@/lib/tier';
import { cn } from '@/lib/utils';

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const tiers = [
  {
    id: 'free' as UserTier,
    name: 'Starter',
    price: 0,
    label: 'Free',
    description: 'Get a taste of quality',
    color: 'gray',
    buttonText: 'Start Free',
    buttonAction: 'navigate',
    buttonTarget: '/practice',
    features: [
      { icon: GraduationCap, text: '3 practice tests', included: true },
      { icon: Target, text: '1 full mock exam', included: true },
      { icon: FileText, text: '2 chapter summaries', included: true },
      { icon: Zap, text: '2 study modes', included: true },
      { icon: BarChart3, text: 'Basic progress tracking', included: true },
      { icon: Infinity, text: 'Marathon mode', included: false },
      { icon: Sparkles, text: 'AI study plan', included: false },
      { icon: FileText, text: 'Full review mode', included: false },
    ],
  },
  {
    id: 'pro' as UserTier,
    name: 'Pro',
    price: 19,
    label: 'Most Popular',
    description: 'Pass guarantee — our students pass',
    color: 'amber',
    buttonText: 'Get Pro — £19',
    buttonAction: 'checkout',
    popular: true,
    features: [
      { icon: GraduationCap, text: 'All 597 practice questions', included: true, highlight: true },
      { icon: Target, text: 'Unlimited mock exams', included: true },
      { icon: FileText, text: 'All 5 chapter summaries', included: true },
      { icon: Zap, text: 'All 5 study modes', included: true },
      { icon: BarChart3, text: 'Smart analytics & weak areas', included: true },
      { icon: Sparkles, text: 'AI personalised study plan', included: true },
      { icon: Infinity, text: 'Marathon mode (unlimited)', included: true },
      { icon: FileText, text: 'Full review with explanations', included: true },
    ],
  },
  {
    id: 'ultimate' as UserTier,
    name: 'Ultimate',
    price: 39,
    label: 'Best Value',
    description: 'Full confidence — leave nothing to chance',
    color: 'purple',
    buttonText: 'Get Ultimate — £39',
    buttonAction: 'checkout',
    features: [
      { icon: GraduationCap, text: 'Everything in Pro', included: true },
      { icon: FileText, text: 'Printable cheat sheet PDF', included: true, highlight: true },
      { icon: Shield, text: 'Priority email support', included: true },
      { icon: Clock, text: 'Test day checklist & guide', included: true },
      { icon: Target, text: 'Key facts quick reference', included: true },
      { icon: Star, text: 'Lifetime updates', included: true },
      { icon: Sparkles, text: 'Early access to new features', included: true },
    ],
  },
];

function PainBanner() {
  return (
    <div className="mx-auto mb-16 max-w-2xl rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 dark:border-red-800/30 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
            The Maths is Simple
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            One retake costs <span className="font-bold text-red-500">£50</span>. Our Pro plan costs{' '}
            <span className="font-bold text-emerald-600">£19</span>. If we save you from even one retake,
            you've saved £31. Most of our students pass on their first try.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<UserTier>('pro');

  const handleCheckout = (tier: UserTier) => {
    upgradeTier(tier);
    setCheckoutTier(tier);
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <Layout>
        <section className="min-h-[80vh] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-20 text-white">
          <div className="mx-auto max-w-md px-4 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 font-display text-3xl font-bold"
            >
              Welcome to {checkoutTier === 'ultimate' ? 'Ultimate' : 'Pro'}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-gray-300"
            >
              You now have full access to everything. No more limits. Go pass that test.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 transition-all hover:scale-105"
              >
                Go to Dashboard
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1 variants={fadeIn} className="font-display text-4xl font-bold sm:text-5xl">
              Invest in Your <span className="text-amber-400">Pass</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              Less than half the cost of one retake. One-time payment. Pass guaranteed.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pain Banner */}
      <section className="bg-gray-50 pt-16 dark:bg-slate-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <PainBanner />
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-gray-50 pb-20 dark:bg-slate-800/50">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {tiers.map((tier) => {
              const isPopular = tier.popular;

              return (
                <motion.div
                  key={tier.id} variants={fadeIn}
                  className={cn(
                    'relative rounded-2xl border bg-white p-6 transition-all dark:bg-slate-800',
                    isPopular
                      ? tier.color === 'amber'
                        ? 'border-amber-300 shadow-xl shadow-amber-500/10 dark:border-amber-500/30'
                        : tier.color === 'purple'
                        ? 'border-purple-300 shadow-xl shadow-purple-500/10 dark:border-purple-500/30'
                        : 'border-gray-300 shadow-lg dark:border-gray-500/30'
                      : 'border-gray-100 dark:border-slate-700'
                  )}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
                    <div className="mt-4">
                      {tier.price === 0 ? (
                        <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">Free</span>
                      ) : (
                        <>
                          <span className="font-display text-5xl font-bold text-gray-900 dark:text-white">£{tier.price}</span>
                          <span className="ml-1 text-sm text-gray-400 dark:text-gray-500">one-time</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className={cn(
                            'mt-0.5 h-4 w-4 shrink-0',
                            (f as any).highlight ? 'text-amber-500' : 'text-emerald-500'
                          )} />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className={cn(
                          'text-sm',
                          f.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 line-through'
                        )}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      if (tier.buttonAction === 'checkout') {
                        handleCheckout(tier.id);
                      }
                    }}
                    className={cn(
                      'mt-6 w-full rounded-full py-3 text-sm font-bold transition-all',
                      tier.id === 'free'
                        ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
                        : tier.id === 'pro'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                    )}
                  >
                    {tier.buttonText}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              30-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Instant access
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" />
              No subscription, ever
            </div>
          </div>
        </div>
      </section>

      {/* Money-back guarantee */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 dark:border-emerald-800/30 dark:bg-emerald-950/20">
            <Shield className="mx-auto h-10 w-10 text-emerald-500" />
            <h3 className="mt-4 font-display text-xl font-bold text-gray-900 dark:text-white">
              Pass Guarantee
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Complete at least 3 mock exams on our platform. If you still fail the official test,
              email us your results and we'll refund you in full within 48 hours.
              We believe in our product that much.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
