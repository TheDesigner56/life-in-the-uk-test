import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Zap,
  Crown,
  Medal,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { loadProfile } from '@/lib/storage';
import { getLevelForXP } from '@/lib/gamification';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  totalXP: number;
  weeklyXP: number;
  monthlyXP: number;
  testsCompleted: number;
  averageScore: number;
  currentStreak: number;
  isCurrentUser?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
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

const podiumVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2 + i * 0.1,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: i * 0.03,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const AVATAR_COLORS = [
  '#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

function getRankedUsers(period: 'weekly' | 'monthly' | 'alltime', allUsers: LeaderboardUser[]): LeaderboardUser[] {
  const sorted = [...allUsers].sort((a, b) => {
    if (period === 'weekly') return b.weeklyXP - a.weeklyXP;
    if (period === 'monthly') return b.monthlyXP - a.monthlyXP;
    return b.totalXP - a.totalXP;
  });
  return sorted;
}

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Avatar Component                                                   */
/* ------------------------------------------------------------------ */
function Avatar({ name, size = 'md', border = false }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; border?: boolean }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-display font-bold text-white',
        sizeClasses[size],
        border && 'border-[3px] border-white dark:border-[#1E293B] shadow-md'
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accuracy Bar                                                       */
/* ------------------------------------------------------------------ */
function AccuracyBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-success-green' : value >= 60 ? 'bg-accent-amber' : 'bg-alert-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-[50px] overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-charcoal dark:text-gray-300">{value}%</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Leaderboard Component                                         */
/* ------------------------------------------------------------------ */
export default function Leaderboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const profile = useMemo(() => loadProfile(), []);

  const allUsers = useMemo<LeaderboardUser[]>(() => {
    const currentUser: LeaderboardUser = {
      id: 'current-user',
      name: profile.username || 'You',
      avatar: profile.username ? profile.username[0] : 'Y',
      totalXP: profile.totalXP || 0,
      weeklyXP: 0,
      monthlyXP: 0,
      testsCompleted: profile.testsCompleted || 0,
      averageScore: profile.averageScore || 0,
      currentStreak: profile.currentStreak || 0,
      isCurrentUser: true,
    };
    return [currentUser];
  }, [profile]);

  const rankedUsers = useMemo(() => getRankedUsers(period, allUsers), [period, allUsers]);
  const top3 = rankedUsers.slice(0, 3);
  const rest = rankedUsers.slice(3);
  const currentUserRank = rankedUsers.findIndex((u) => u.isCurrentUser);
  const currentUserInTop = currentUserRank >= 0 && currentUserRank < 3 + 10;
  const hasData = rankedUsers.length > 0 && (rankedUsers.length > 1 || profile.testsCompleted > 0);

  const periodOptions: { key: typeof period; label: string }[] = [
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
    { key: 'alltime', label: 'All Time' },
  ];

  const getXPForPeriod = (u: LeaderboardUser) => {
    if (period === 'weekly') return u.weeklyXP;
    if (period === 'monthly') return u.monthlyXP;
    return u.totalXP;
  };

  /* Weekly challenges */
  const weeklyChallenges = [
    {
      id: 'wc1',
      icon: <Trophy className="h-6 w-6 text-accent-amber" />,
      title: 'Mock Master',
      description: 'Complete 3 full mock exams this week',
      current: 0,
      target: 3,
      xp: 200,
      completed: false,
    },
    {
      id: 'wc2',
      icon: <BookOpen className="h-6 w-6 text-royal-blue" />,
      title: 'Chapter Champ',
      description: 'Master a chapter (90%+ accuracy)',
      current: 0,
      target: 1,
      xp: 150,
      completed: false,
    },
    {
      id: 'wc3',
      icon: <Flame className="h-6 w-6 text-alert-red" />,
      title: 'Streak Keeper',
      description: 'Maintain a 7-day study streak',
      current: profile.currentStreak || 0,
      target: 7,
      xp: 100,
      completed: (profile.currentStreak || 0) >= 7,
    },
  ];

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
                  Leaderboard
                </h1>
                <p className="mt-1 text-sm text-charcoal dark:text-gray-400">
                  See how you rank against other future citizens.
                </p>
              </div>
              {hasData && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-royal-blue px-4 py-2 text-sm font-semibold text-white">
                  <Trophy className="h-4 w-4" />
                  You are #{currentUserRank >= 0 ? currentUserRank + 1 : '--'} this {period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'time'}
                </span>
              )}
            </motion.div>
          </motion.div>

          {/* -------- Personal Stats Row -------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: <Zap className="h-6 w-6 text-accent-amber" />,
                value: `${period === 'weekly' ? '0' : period === 'monthly' ? '0' : (profile.totalXP || 0).toLocaleString()}`,
                label: `${period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'Total'} XP`,
                sub: 'Complete tests to earn XP',
              },
              {
                icon: <Trophy className="h-6 w-6 text-royal-blue" />,
                value: `#${currentUserRank >= 0 ? currentUserRank + 1 : '--'}`,
                label: `Current rank`,
                sub: `of ${rankedUsers.length.toLocaleString()}`,
              },
              {
                icon: <Flame className="h-6 w-6 text-accent-amber" />,
                value: `${profile.currentStreak || 0} days`,
                label: 'Weekly streak',
                sub: `${Math.max(0, 7 - (profile.currentStreak || 0))} more for bonus`,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-sm dark:border-[#334155] dark:bg-[#1E293B]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]">
                  {stat.icon}
                </div>
                <p className="mt-2 font-display text-3xl font-bold text-dark-slate dark:text-white">{stat.value}</p>
                <p className="text-xs font-medium text-charcoal dark:text-gray-400">{stat.label}</p>
                <p className="mt-0.5 text-[11px] text-charcoal/70 dark:text-gray-500">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* -------- Period Tabs -------- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm dark:bg-[#1E293B]">
              {periodOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setPeriod(opt.key)}
                  className={cn(
                    'relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                    period === opt.key ? 'text-white' : 'text-charcoal hover:text-dark-slate dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  {period === opt.key && (
                    <motion.div
                      layoutId="leaderboard-tab"
                      className="absolute inset-0 rounded-full bg-royal-blue"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* -------- Empty State -------- */}
          {!hasData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center dark:border-[#334155] dark:bg-[#1E293B]"
            >
              <Trophy className="h-12 w-12 text-[#CBD5E1] dark:text-[#475569]" />
              <h3 className="mt-4 font-display text-lg font-semibold text-dark-slate dark:text-white">
                No leaderboard data yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-charcoal dark:text-gray-400">
                Complete tests to appear here! The leaderboard shows your own progress — challenge yourself to climb the ranks.
              </p>
              <button
                onClick={() => navigate('/practice')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal-blue px-6 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition-all hover:brightness-110"
              >
                Start Practising
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* -------- Podium -------- */}
          {hasData && (
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-8 flex items-end justify-center gap-3 md:gap-6">
                  {/* #2 - Left */}
                  {top3[1] && (
                    <motion.div
                      custom={1}
                      variants={podiumVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex w-[110px] flex-col items-center md:w-[160px]"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                      >
                        <Medal className="h-8 w-8 text-[#94A3B8]" />
                      </motion.div>
                      <Avatar name={top3[1].name} size="lg" border />
                      <p className="mt-2 truncate text-sm font-semibold text-dark-slate dark:text-white">{top3[1].name}</p>
                      <p className="font-display text-lg font-bold text-dark-slate dark:text-white">
                        {getXPForPeriod(top3[1]).toLocaleString()} XP
                      </p>
                      <div className="mt-2 flex h-[80px] w-full items-center justify-center rounded-t-xl bg-gradient-to-t from-[#CBD5E1] to-[#E2E8F0] dark:from-[#475569] dark:to-[#64748B]">
                        <span className="font-display text-2xl font-bold text-white">2</span>
                      </div>
                      {top3[1].currentStreak > 0 && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-charcoal dark:text-gray-400">
                          <Flame className="h-3 w-3 text-accent-amber" />
                          {top3[1].currentStreak} streak
                        </span>
                      )}
                    </motion.div>
                  )}

                  {/* #1 - Center */}
                  {top3[0] && (
                    <motion.div
                      custom={0}
                      variants={podiumVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex w-[130px] flex-col items-center md:w-[180px]"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <Crown className="h-10 w-10 text-accent-amber" />
                      </motion.div>
                      <Avatar name={top3[0].name} size="xl" border />
                      <p className="mt-2 truncate text-sm font-semibold text-dark-slate dark:text-white">{top3[0].name}</p>
                      <p className="font-display text-xl font-bold text-accent-amber">
                        {getXPForPeriod(top3[0]).toLocaleString()} XP
                      </p>
                      <div className="mt-2 flex h-[120px] w-full items-center justify-center rounded-t-xl bg-gradient-to-t from-accent-amber to-[#FBBF24] shadow-glow-amber">
                        <span className="font-display text-3xl font-bold text-white">1</span>
                      </div>
                      {top3[0].currentStreak > 0 && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-charcoal dark:text-gray-400">
                          <Flame className="h-3 w-3 text-accent-amber" />
                          {top3[0].currentStreak} streak
                        </span>
                      )}
                    </motion.div>
                  )}

                  {/* #3 - Right */}
                  {top3[2] && (
                    <motion.div
                      custom={2}
                      variants={podiumVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex w-[110px] flex-col items-center md:w-[160px]"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                      >
                        <Medal className="h-8 w-8 text-[#B45309]" />
                      </motion.div>
                      <Avatar name={top3[2].name} size="md" border />
                      <p className="mt-2 truncate text-sm font-semibold text-dark-slate dark:text-white">{top3[2].name}</p>
                      <p className="font-display text-lg font-bold text-dark-slate dark:text-white">
                        {getXPForPeriod(top3[2]).toLocaleString()} XP
                      </p>
                      <div className="mt-2 flex h-[60px] w-full items-center justify-center rounded-t-xl bg-gradient-to-t from-[#FCD34D] to-[#FDE68A] dark:from-[#B45309] dark:to-[#D97706]">
                        <span className="font-display text-2xl font-bold text-white">3</span>
                      </div>
                      {top3[2].currentStreak > 0 && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-charcoal dark:text-gray-400">
                          <Flame className="h-3 w-3 text-accent-amber" />
                          {top3[2].currentStreak} streak
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* -------- Rankings Table -------- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
                >
                  {/* Table Header */}
                  <div className="hidden grid-cols-[60px_1fr_100px_80px_80px_100px] gap-4 border-b border-[#E2E8F0] bg-light-gray px-5 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal dark:border-[#334155] dark:bg-[#0F172A] dark:text-gray-400 md:grid">
                    <span>Rank</span>
                    <span>User</span>
                    <span className="text-right">XP</span>
                    <span className="text-center">Tests</span>
                    <span className="text-center">Streak</span>
                    <span className="text-right">Accuracy</span>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155]">
                    {rest.slice(0, 12).map((user, i) => {
                      const rank = i + 4;
                      const isCurrentUser = user.isCurrentUser;
                      const level = getLevelForXP(user.totalXP);
                      return (
                        <motion.div
                          key={user.id}
                          custom={i}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          className={cn(
                            'grid grid-cols-[40px_1fr_80px] items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F8FAFC]/50 dark:hover:bg-white/[0.02] md:grid-cols-[60px_1fr_100px_80px_80px_100px] md:gap-4 md:px-5',
                            isCurrentUser && 'bg-royal-blue/[0.04] dark:bg-royal-blue/[0.08]'
                          )}
                        >
                          {/* Rank */}
                          <span className="text-sm font-semibold text-charcoal dark:text-gray-300">
                            {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
                          </span>

                          {/* User */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar name={user.name} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={cn('truncate text-sm font-medium', isCurrentUser ? 'text-royal-blue' : 'text-dark-slate dark:text-white')}>
                                  {user.name}
                                </span>
                                {isCurrentUser && (
                                  <span className="shrink-0 rounded-full bg-royal-blue/10 px-1.5 py-0.5 text-[9px] font-bold text-royal-blue">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-charcoal/60 dark:text-gray-500">Lv.{level.level} {level.title}</span>
                            </div>
                          </div>

                          {/* XP */}
                          <span className="text-right text-sm font-semibold text-accent-amber">
                            {getXPForPeriod(user).toLocaleString()} <span className="text-[10px] font-normal text-charcoal dark:text-gray-400">XP</span>
                          </span>

                          {/* Tests */}
                          <span className="hidden text-center text-sm text-charcoal dark:text-gray-300 md:block">
                            {user.testsCompleted}
                          </span>

                          {/* Streak */}
                          <span className="hidden items-center justify-center gap-1 text-sm text-charcoal dark:text-gray-300 md:flex">
                            <Flame className="h-3.5 w-3.5 text-accent-amber" />
                            {user.currentStreak}
                          </span>

                          {/* Accuracy */}
                          <div className="hidden justify-end md:flex">
                            <AccuracyBar value={user.averageScore} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Current user fixed row (if not in visible range) */}
                  {!currentUserInTop && currentUserRank >= 0 && (
                    <div className="sticky bottom-0 border-t-2 border-royal-blue bg-royal-blue/[0.08] px-5 py-3 dark:bg-royal-blue/[0.12]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-royal-blue">#{currentUserRank + 1}</span>
                          <Avatar name={profile.username || 'You'} size="sm" />
                          <span className="text-sm font-semibold text-royal-blue">{profile.username || 'You'}</span>
                        </div>
                        <span className="text-sm font-bold text-accent-amber">
                          {getXPForPeriod(rankedUsers[currentUserRank]).toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* -------- Weekly Challenges -------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
          >
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                This Week&apos;s Challenges
              </h3>
              <p className="text-xs text-charcoal dark:text-gray-400">Complete all 3 for a streak bonus!</p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {weeklyChallenges.map((ch) => {
                const progressPct = Math.min((ch.current / ch.target) * 100, 100);
                return (
                  <motion.div
                    key={ch.id}
                    variants={staggerItem}
                    className={cn(
                      'rounded-xl border p-5 transition-all',
                      ch.completed
                        ? 'border-success-green/30 bg-success-green/5'
                        : 'border-[#E2E8F0] bg-white dark:border-[#334155] dark:bg-[#1E293B]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A]">
                        {ch.icon}
                      </div>
                      {ch.completed && <CheckCircle2 className="h-5 w-5 text-success-green" />}
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-dark-slate dark:text-white">{ch.title}</h4>
                    <p className="mt-0.5 text-xs text-charcoal dark:text-gray-400">{ch.description}</p>
                    <p className="mt-2 text-xs font-medium text-charcoal dark:text-gray-300">
                      {ch.current}/{ch.target}
                    </p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#334155]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                        className={cn('h-full rounded-full', ch.completed ? 'bg-success-green' : 'bg-royal-blue')}
                      />
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent-amber px-2.5 py-1 text-[11px] font-semibold text-white">
                      +{ch.xp} XP
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
