import { Link } from 'react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Zap, Target, AlertTriangle, ChevronRight, Crown,
  Users, Star, Shield, GraduationCap, ArrowRight
} from 'lucide-react';
import Layout from '@/components/Layout';


/* ─── Animations ─── */
const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ─── Pain Calculator ─── */
function PainCalculator() {
  const [attempts, setAttempts] = useState(1);
  const costPerAttempt = 50;
  const totalCost = attempts * costPerAttempt;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6 dark:border-red-800/30 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">The Real Cost</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setAttempts(Math.max(1, attempts - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold shadow dark:bg-slate-800"
        >−</button>
        <div className="text-center">
          <div className="font-display text-4xl font-bold text-gray-900 dark:text-white">{attempts}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">attempt{attempts > 1 ? 's' : ''}</div>
        </div>
        <button
          onClick={() => setAttempts(Math.min(5, attempts + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold shadow dark:bg-slate-800"
        >+</button>
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">Total cost: </span>
        <span className="font-display text-3xl font-bold text-red-600 dark:text-red-400">£{totalCost}</span>
      </div>
      <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
        Plus {attempts > 1 ? `${(attempts - 1) * 7} days` : '0 days'} of waiting between retakes
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-20 pt-32 text-white">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.2) 0%, transparent 40%)',
      }} />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="text-center"
        >
          <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Trusted by 50,000+ future British citizens</span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Don't Let a{' '}
            <span className="text-amber-400">£50 Test Fee</span>{' '}
            Become £150
          </motion.h1>

          <motion.p variants={fadeIn} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            36% of people fail the Life in the UK Test on their first try.
            Each failure costs <span className="font-semibold text-white">£50</span> and another{' '}
            <span className="font-semibold text-white">7-day wait</span>.
            Our students pass on their first attempt.
          </motion.p>

          <motion.div variants={fadeIn} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-2xl shadow-white/10 transition-all hover:scale-105 hover:shadow-white/20"
            >
              <Zap className="h-5 w-5" />
              Start Practicing Free
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl"
            >
              <Crown className="h-5 w-5" />
              Get Pro — £19
              <span className="text-xs font-normal opacity-80">one-time</span>
            </Link>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-4 text-sm text-gray-400">
            No subscription. No credit card required to start.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { icon: BookOpen, label: 'Practice Questions', value: '597' },
            { icon: Target, label: 'First-Pass Rate', value: '94%' },
            { icon: Users, label: 'Students Helped', value: '50K+' },
            { icon: Star, label: 'Average Rating', value: '4.9' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeIn} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
              <s.icon className="mx-auto h-5 w-5 text-amber-400" />
              <div className="mt-2 font-display text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Pain Section ─── */
function PainSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          className="grid gap-12 md:grid-cols-2 md:items-center"
        >
          <div>
            <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              The True Cost of <span className="text-red-500">Failing</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="mt-4 text-gray-600 dark:text-gray-300">
              Most people underestimate how expensive failing can be. It's not just the £50 fee — it's the
              delayed citizenship, the rescheduled appointments, and the stress of studying all over again.
            </motion.p>
            <motion.ul variants={fadeIn} className="mt-6 space-y-3">
              {[
                '£50 per attempt (non-refundable)',
                '7-day minimum wait between retakes',
                '36% national failure rate',
                'Average 1.5 attempts to pass = £75 real cost',
                'Delayed citizenship or ILR application',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>
          <motion.div variants={fadeIn}>
            <PainCalculator />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Free vs Pro ─── */
function ComparisonSection() {
  const features = [
    { name: 'Practice Questions', free: '50', pro: '597', highlight: true },
    { name: 'Study Modes', free: '2', pro: '5', highlight: true },
    { name: 'Mock Exams', free: '1', pro: 'Unlimited', highlight: false },
    { name: 'Chapter Coverage', free: '2 of 5', pro: 'All 5 Chapters', highlight: false },
    { name: 'Flashcards', free: '10', pro: '60 (with 3D flip)', highlight: false },
    { name: 'Smart Analytics', free: '—', pro: 'Full analytics', highlight: false },
    { name: 'AI Study Plan', free: '—', pro: 'Personalised', highlight: true },
    { name: 'Marathon Mode', free: '—', pro: 'Unlimited', highlight: false },
    { name: 'Review Mode', free: '—', pro: 'Detailed explanations', highlight: false },
    { name: 'Leaderboard', free: 'View only', pro: 'Full participation', highlight: false },
  ];

  return (
    <section className="bg-gray-50 py-20 dark:bg-slate-800/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
          className="text-center"
        >
          <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-gray-900 dark:text-white">
            Free Gets You Started.<br />Pro Gets You <span className="text-amber-500">Passed</span>.
          </motion.h2>
          <motion.p variants={fadeIn} className="mt-4 text-gray-500 dark:text-gray-400">
            Every feature is designed to maximise your first-pass probability.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50/50 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Feature</div>
            <div className="px-6 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">Free</div>
            <div className="px-6 py-4 text-center text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Crown className="mr-1 inline h-4 w-4" />
              Pro
            </div>
          </div>
          {features.map((f, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-b border-gray-100 last:border-0 dark:border-slate-700 ${
                f.highlight ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''
              }`}
            >
              <div className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{f.name}</div>
              <div className="px-6 py-3.5 text-center text-sm text-gray-500 dark:text-gray-400">{f.free}</div>
              <div className="px-6 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white">{f.pro}</div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn} className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl"
          >
            Get Pro — £19
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">One-time payment. No subscription, ever.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const testimonials = [
    {
      name: 'Maria S.', flag: '🇵🇹', text: 'Passed first time with 22/24. The mock exams felt exactly like the real thing. Best £19 I ever spent.',
      score: '22/24', attempts: '1st try', pro: true,
    },
    {
      name: 'Ahmed K.', flag: '🇵🇰', text: 'I failed my first attempt using a free site. This app showed me exactly where I was weak. Passed second time.',
      score: '21/24', attempts: '2nd try', pro: true,
    },
    {
      name: 'Elena R.', flag: '🇷🇴', text: 'The flashcards and chapter breakdown made everything click. I felt genuinely prepared walking into the test centre.',
      score: '23/24', attempts: '1st try', pro: true,
    },
  ];

  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-gray-900 dark:text-white">
            They Passed. <span className="text-emerald-500">You Can Too.</span>
          </motion.h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg dark:bg-slate-700">
                  {t.flag}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-emerald-500 font-medium">{t.score}</span>
                    <span>·</span>
                    <span>{t.attempts}</span>
                    {t.pro && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-900/40">PRO</span>}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">"{t.text}"</p>
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const faqs = [
    {
      q: 'Why pay when there are free practice sites?',
      a: 'Free sites typically have 100-200 basic questions with no explanations. We have 597 questions with detailed explanations, 5 study modes, smart analytics that identify your weak areas, and an AI study plan. Our students have a 94% first-pass rate vs. the national 64%.',
    },
    {
      q: 'Is this the actual Life in the UK Test?',
      a: 'No — this is a practice platform based on the official "Life in the UK: A Guide for New Residents" 3rd Edition handbook. The real test has 24 multiple-choice questions, a 45-minute time limit, and requires a 75% pass mark (18/24). Our mock exams match these exact conditions.',
    },
    {
      q: 'What if I buy Pro and still fail?',
      a: 'We offer a 30-day money-back guarantee. If you complete at least 3 mock exams on our platform and still fail the official test, email us your results and we\'ll refund you in full. We believe in our product that much.',
    },
    {
      q: 'Is this a subscription?',
      a: 'No. Pro is a one-time payment of £19. Ultimate is a one-time payment of £39. You keep access forever. No monthly charges, no auto-renewals, no surprises.',
    },
    {
      q: 'Can I study on mobile?',
      a: 'Yes — the entire platform is mobile-optimised. Study on your commute, during lunch breaks, or anywhere. Your progress syncs across devices automatically.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-20 dark:bg-slate-800/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center font-display text-3xl font-bold text-gray-900 dark:text-white"
        >
          Questions? <span className="text-royal-blue">Answered.</span>
        </motion.h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{f.q}</span>
                <ChevronRight className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${openIdx === i ? 'rotate-90' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="border-t border-gray-100 px-5 pb-4 pt-3 dark:border-slate-700">
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{f.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-20 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold">
            Your Citizenship Journey Starts with <span className="text-amber-400">One Right Answer</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="mt-4 text-gray-300">
            597 questions. 5 study modes. 94% first-pass rate. <br className="hidden sm:block" />
            Join 50,000+ who passed with us.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-2xl transition-all hover:scale-105"
            >
              <GraduationCap className="h-5 w-5" />
              Start Free — No Card Required
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl"
            >
              <Crown className="h-5 w-5" />
              Get Pro — £19
            </Link>
          </motion.div>
          <motion.p variants={fadeIn} className="mt-4 text-xs text-gray-500">
            30-day money-back guarantee. One-time payment.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main ─── */
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <PainSection />
      <ComparisonSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </Layout>
  );
}
