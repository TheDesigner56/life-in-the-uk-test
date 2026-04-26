import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Target,
  Flame,
  Star,
  Clock,
  Lightbulb,
  Zap,
  BookOpen,
  Layers,
  Infinity as InfinityIcon,
  Trophy,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import {
  loadProfile,
  loadTestResults,
} from '@/lib/storage';
import { CHAPTERS } from '@/data/questions';
import { getLevelForXP } from '@/lib/gamification';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const barStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const barItem = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDateLong(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs === 1) return '1 hour ago';
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface ScoreDataPoint {
  date: string;
  score: number;
  label: string;
}

function getScoreTrendData(results: import('@/lib/storage').TestResult[], filter: '7d' | '30d' | 'all'): ScoreDataPoint[] {
  const now = Date.now();
  const cutoff = filter === '7d' ? now - 7 * 86400000 : filter === '30d' ? now - 30 * 86400000 : 0;
  const filtered = results.filter((r) => new Date(r.date).getTime() >= cutoff);
  return filtered.slice(0, 20).map((r) => ({
    date: r.date,
    score: r.score,
    label: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }));
}

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                     */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
}

/* ------------------------------------------------------------------ */
/*  Countdown timer                                                   */
/* ------------------------------------------------------------------ */
function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                         */
/* ------------------------------------------------------------------ */
interface StatCardProps {
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  value: string;
  label: string;
  changeText?: string;
  delay?: number;
}

function StatCard({ icon, colorClass, bgClass, value, label, changeText }: StatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-[#334155] dark:bg-[#1E293B]"
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bgClass)}>
          {icon}
        </div>
        {changeText && (
          <span className="text-xs font-medium text-success-green">{changeText}</span>
        )}
      </div>
      <p className={cn('mt-3 font-display text-3xl font-bold', colorClass)}>{value}</p>
      <p className="mt-1 text-xs font-medium text-charcoal dark:text-gray-400">{label}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Component                                          */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useMemo(() => loadProfile(), []);

  const results = useMemo(() => loadTestResults(), []);

  const level = useMemo(() => getLevelForXP(profile.totalXP), [profile.totalXP]);

  const [scoreFilter, setScoreFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const scoreData = useMemo(
    () => getScoreTrendData(results, scoreFilter),
    [results, scoreFilter]
  );

  const testsCount = useCountUp(profile.testsCompleted);
  const avgScore = useCountUp(profile.averageScore, 1200, 0);
  const streakCount = useCountUp(profile.currentStreak);
  const xpCount = useCountUp(profile.totalXP);
  const countdown = useCountdownToMidnight();

  const greeting = `${getTimeGreeting()}, ${profile.username || 'Learner'}`;

  const weakestChapter = useMemo(() => {
    const sorted = [...profile.chapterProgress].sort(
      (a, b) =>
        (a.questionsAttempted === 0 ? 0 : a.questionsCorrect / a.questionsAttempted) -
        (b.questionsAttempted === 0 ? 0 : b.questionsCorrect / b.questionsAttempted)
    );
    return sorted[0];
  }, [profile.chapterProgress]);

  const recommendation = useMemo(() => {
    if (weakestChapter && weakestChapter.questionsAttempted > 0) {
      const pct = Math.round((weakestChapter.questionsCorrect / weakestChapter.questionsAttempted) * 100);
      const chName = CHAPTERS.find((c) => c.id === weakestChapter.chapterId)?.shortName || `Chapter ${weakestChapter.chapterId}`;
      return {
        text: `Your ${chName} score is ${pct}%. Let's improve it!`,
        action: () => navigate('/practice'),
        buttonText: 'Study Now',
      };
    }
    if (profile.currentStreak >= 6) {
      return {
        text: `You're on a ${profile.currentStreak}-day streak. One more day for a bonus!`,
        action: () => navigate('/practice'),
        buttonText: 'Keep Going',
      };
    }
    return {
      text: "You haven't done a full mock this week. Try one now!",
      action: () => navigate('/test/full/new'),
      buttonText: 'Start Mock',
    };
  }, [weakestChapter, profile, navigate]);

  /* Daily challenges mock data */
  const dailyChallenges = [
    {
      id: 'c1',
      icon: <Target className="h-5 w-5 text-royal-blue" />,
      title: 'Accuracy Ace',
      description: 'Answer 20 questions correctly today',
      current: 8,
      target: 20,
      xp: 75,
      completed: false,
    },
    {
      id: 'c2',
      icon: <BookOpen className="h-5 w-5 text-royal-blue" />,
      title: 'History Hour',
      description: 'Complete a Chapter 3 practice test',
      current: 0,
      target: 1,
      xp: 75,
      completed: false,
    },
    {
      id: 'c3',
      icon: <Trophy className="h-5 w-5 text-royal-blue" />,
      title: 'Mock Master',
      description: 'Score 80%+ on a full mock exam',
      current: 0,
      target: 1,
      xp: 75,
      completed: false,
    },
  ];

  /* Recent activity mock data */
  const recentActivity = useMemo(() => {
    if (results.length >= 5) {
      return results.slice(0, 5).map((r, i) => ({
        id: r.id,
        icon:
          r.mode === 'quick' ? (
            <Zap className="h-4 w-4 text-accent-amber" />
          ) : r.mode === 'full' ? (
            <ClipboardCheck className="h-4 w-4 text-royal-blue" />
          ) : r.mode === 'chapter' ? (
            <BookOpen className="h-4 w-4 text-chapter-4" />
          ) : (
            <InfinityIcon className="h-4 w-4 text-chapter-5" />
          ),
        iconBg:
          r.mode === 'quick'
            ? 'bg-accent-amber/10'
            : r.mode === 'full'
              ? 'bg-royal-blue/10'
              : r.mode === 'chapter'
                ? 'bg-chapter-4/10'
                : 'bg-chapter-5/10',
        title:
          r.mode === 'quick'
            ? 'Quick Fire Session'
            : r.mode === 'full'
              ? `Full Mock Exam #${results.length - i}`
              : r.mode === 'chapter'
                ? `Chapter ${r.chapterBreakdown && Object.keys(r.chapterBreakdown)[0] ? `Ch ${Object.keys(r.chapterBreakdown)[0]}` : 'Study'}`
                : 'Marathon Session',
        meta: `${r.totalQuestions} questions · ${r.score}%`,
        score: r.score,
        passed: r.passed,
        time: timeAgo(r.date),
      }));
    }
    return [
      { id: 'a1', icon: <Zap className="h-4 w-4 text-accent-amber" />, iconBg: 'bg-accent-amber/10', title: 'Quick Fire Session', meta: '10 questions · 90%', score: 90, passed: true, time: '2 hours ago' },
      { id: 'a2', icon: <ClipboardCheck className="h-4 w-4 text-royal-blue" />, iconBg: 'bg-royal-blue/10', title: 'Full Mock Exam #12', meta: '24 questions · 79%', score: 79, passed: true, time: 'Yesterday' },
      { id: 'a3', icon: <BookOpen className="h-4 w-4 text-chapter-4" />, iconBg: 'bg-chapter-4/10', title: 'Chapter 3: History', meta: '15 questions · 67%', score: 67, passed: false, time: '2 days ago' },
      { id: 'a4', icon: <Layers className="h-4 w-4 text-chapter-2" />, iconBg: 'bg-chapter-2/10', title: 'Flashcards: Chapter 1', meta: '20 cards reviewed', score: 100, passed: true, time: '3 days ago' },
      { id: 'a5', icon: <InfinityIcon className="h-4 w-4 text-chapter-5" />, iconBg: 'bg-chapter-5/10', title: 'Marathon Session', meta: '45 questions · 84%', score: 84, passed: true, time: '4 days ago' },
    ];
  }, [results]);

  const chapterBars = useMemo(() => {
    return profile.chapterProgress.map((cp) => {
      const ch = CHAPTERS.find((c) => c.id === cp.chapterId);
      const pct = cp.questionsAttempted === 0 ? 0 : Math.round((cp.questionsCorrect / cp.questionsAttempted) * 100);
      let label = 'Needs Work';
      let labelColor = 'text-alert-red';
      if (pct >= 91) { label = 'Mastered'; labelColor = 'text-success-green'; }
      else if (pct >= 71) { label = 'Strong'; labelColor = 'text-royal-blue'; }
      else if (pct >= 41) { label = 'Improving'; labelColor = 'text-accent-amber'; }
      return {
        chapterId: cp.chapterId,
        name: ch ? `Ch ${cp.chapterId}: ${ch.shortName.split(' ').slice(0, 2).join(' ')}` : `Ch ${cp.chapterId}`,
        shortName: ch?.shortName || '',
        color: ch?.color || '#2563EB',
        pct,
        label,
        labelColor,
      };
    });
  }, [profile.chapterProgress]);

  /* Custom chart tooltip */
  const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { day: string; score: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-md dark:border-[#334155] dark:bg-[#1E293B]">
          <p className="text-xs text-charcoal dark:text-gray-300">{data.day}</p>
          <p className="mt-1 font-display text-lg font-bold text-dark-slate dark:text-white">{data.score}%</p>
          <span
            className={cn(
              'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
              data.score >= 75
                ? 'bg-success-green/10 text-success-green'
                : 'bg-alert-red/10 text-alert-red'
            )}
          >
            {data.score >= 75 ? 'Pass' : 'Fail'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-[100dvh] bg-light-gray pb-16 pt-20 dark:bg-dark-slate"
      >
        <div className="mx-auto max-w-[1320px] px-4 md:px-6 lg:px-8">
          {/* -------- Page Header -------- */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-dark-slate dark:text-white md:text-3xl">
                  {greeting} {getTimeGreeting() === 'Good morning' ? '☀️' : getTimeGreeting() === 'Good afternoon' ? '🌤️' : '🌙'}
                </h1>
                <p className="mt-1 text-sm text-charcoal dark:text-gray-400">Here&apos;s your study progress today.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-charcoal dark:text-gray-400">{formatDateLong()}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-3 py-1 text-xs font-semibold text-accent-amber">
                  <Flame className="h-3.5 w-3.5" />
                  {profile.currentStreak} Day Streak
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* -------- Quick Stats -------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <StatCard
              icon={<ClipboardCheck className="h-5 w-5 text-royal-blue" />}
              colorClass="text-dark-slate dark:text-white"
              bgClass="bg-royal-blue/10"
              value={testsCount}
              label="Tests completed"
              changeText="+3 this week"
            />
            <StatCard
              icon={<Target className="h-5 w-5 text-success-green" />}
              colorClass="text-dark-slate dark:text-white"
              bgClass="bg-success-green/10"
              value={`${avgScore}%`}
              label="Average score"
              changeText="+5%"
            />
            <StatCard
              icon={<Flame className="h-5 w-5 text-accent-amber" />}
              colorClass="text-dark-slate dark:text-white"
              bgClass="bg-accent-amber/10"
              value={streakCount}
              label="Day streak"
              changeText={profile.currentStreak >= 7 ? 'Week Warrior!' : `${7 - profile.currentStreak} to bonus`}
            />
            <StatCard
              icon={<Star className="h-5 w-5 text-accent-amber" />}
              colorClass="text-dark-slate dark:text-white"
              bgClass="bg-accent-amber/10"
              value={xpCount}
              label="XP earned"
              changeText={`Level ${level.level}`}
            />
          </motion.div>

          {/* -------- Two Column: Chart + Chapter Mastery -------- */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Score Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#334155] dark:bg-[#1E293B] lg:col-span-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">Score Trend</h3>
                  <p className="text-xs text-charcoal dark:text-gray-400">Your scores over time</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-light-gray p-1 dark:bg-dark-slate">
                  {(['7d', '30d', 'all'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setScoreFilter(f)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
                        scoreFilter === f
                          ? 'bg-royal-blue text-white'
                          : 'text-charcoal hover:text-dark-slate dark:text-gray-400 dark:hover:text-white'
                      )}
                    >
                      {f === '7d' ? '7 Days' : f === '30d' ? '30 Days' : 'All Time'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine
                      y={75}
                      stroke="#059669"
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      label={{ value: 'Pass Mark', position: 'right', fill: '#059669', fontSize: 11 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                      dot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#2563EB', stroke: '#fff', strokeWidth: 3 }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chapter Mastery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#334155] dark:bg-[#1E293B] lg:col-span-2"
            >
              <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">Chapter Mastery</h3>
              <p className="text-xs text-charcoal dark:text-gray-400">Your strength across all 5 chapters</p>

              <motion.div variants={barStagger} initial="hidden" animate="visible" className="mt-5 space-y-4">
                {chapterBars.map((bar) => (
                  <motion.div key={bar.chapterId} variants={barItem}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: bar.color }} />
                        <span className="text-sm font-medium text-dark-slate dark:text-gray-200">{bar.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-dark-slate dark:text-white">{bar.pct}%</span>
                        <span className={cn('text-[11px] font-medium', bar.labelColor)}>{bar.label}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.pct}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.5 + bar.chapterId * 0.08 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: bar.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <button
                onClick={() => navigate('/practice')}
                className="mt-5 w-full rounded-full border-2 border-royal-blue px-4 py-2.5 text-sm font-semibold text-royal-blue transition-all duration-200 hover:bg-royal-blue hover:text-white"
              >
                Study Weak Areas
              </button>
            </motion.div>
          </div>

          {/* -------- Daily Challenges -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">Today&apos;s Challenges</h3>
              <div className="flex items-center gap-1.5 text-xs font-medium text-charcoal dark:text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Resets in {countdown}
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {dailyChallenges.map((ch) => {
                const progressPct = Math.min((ch.current / ch.target) * 100, 100);
                return (
                  <motion.div
                    key={ch.id}
                    variants={staggerItem}
                    className={cn(
                      'rounded-xl border bg-light-gray p-4 dark:bg-[#0F172A]',
                      ch.completed
                        ? 'border-success-green/50 bg-success-green/5'
                        : 'border-[#E2E8F0] dark:border-[#334155]'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {ch.icon}
                        <span className="text-sm font-semibold text-dark-slate dark:text-white">{ch.title}</span>
                      </div>
                      {ch.completed && <CheckCircle2 className="h-5 w-5 text-success-green" />}
                    </div>
                    <p className="mt-1 text-xs text-charcoal dark:text-gray-400">{ch.description}</p>
                    <p className="mt-2 text-xs font-medium text-charcoal dark:text-gray-300">
                      {ch.current}/{ch.target}
                    </p>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                        className={cn('h-full rounded-full', ch.completed ? 'bg-success-green' : 'bg-royal-blue')}
                      />
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent-amber px-2 py-0.5 text-[10px] font-semibold text-white">
                      +{ch.xp} XP
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* -------- Recent Activity -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">Recent Activity</h3>
              <button
                onClick={() => navigate('/profile')}
                className="text-xs font-medium text-royal-blue hover:underline"
              >
                View All
              </button>
            </div>

            <motion.div variants={barStagger} initial="hidden" animate="visible" className="mt-3 divide-y divide-[#E2E8F0] dark:divide-[#334155]">
              {recentActivity.map((item) => (
                <motion.div
                  key={item.id}
                  variants={barItem}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-[#F8FAFC]/50 dark:hover:bg-white/[0.02]"
                >
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', item.iconBg)}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-dark-slate dark:text-white">{item.title}</p>
                    <p className="text-xs text-charcoal dark:text-gray-400">{item.meta}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      item.passed
                        ? 'bg-success-green/10 text-success-green'
                        : 'bg-alert-red/10 text-alert-red'
                    )}
                  >
                    {item.score}%
                  </span>
                  <span className="hidden shrink-0 text-xs text-[#94A3B8] dark:text-[#64748B] sm:block">{item.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* -------- Smart Recommendation -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6 rounded-2xl border border-royal-blue/20 bg-gradient-to-r from-royal-blue/[0.05] to-royal-blue/[0.02] p-6 dark:border-royal-blue/30"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal-blue/10"
              >
                <Lightbulb className="h-6 w-6 text-royal-blue" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-royal-blue">Recommended for you:</p>
                <p className="mt-0.5 font-display text-lg font-semibold text-dark-slate dark:text-white">
                  {recommendation.text}
                </p>
              </div>
              <button
                onClick={recommendation.action}
                className="hidden shrink-0 items-center gap-1 rounded-full bg-royal-blue px-5 py-2 text-sm font-semibold text-white shadow-glow-blue transition-all duration-200 hover:brightness-110 sm:inline-flex"
              >
                {recommendation.buttonText}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
