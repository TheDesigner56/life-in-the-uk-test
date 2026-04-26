import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideProps } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { LEVELS } from '@/lib/gamification';
import {
  HelpCircle,
  CheckCircle,
  Target,
  ClipboardCheck,
  Flame,
  Clock,
  Trophy,
  Footprints,
  Star,
  BookOpen,
  Map,
  HistoryIcon,
  Users,
  Scale,
  Zap,
  Moon,
  Sun,
  Lock,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  SunMedium,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile, TestResult } from '@/lib/storage';
import {
  loadProfile,
  saveProfile,
  loadTestResults,
  clearAllData,
  getDefaultProfile,
} from '@/lib/storage';
import {
  ACHIEVEMENTS,
  getLevelForXP,
  getXPToNextLevel,
} from '@/lib/gamification';
import { CHAPTERS } from '@/data/questions';
import Layout from '@/components/Layout';

type TabType = 'overview' | 'achievements' | 'history' | 'settings';

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FlameIcon() {
  return (
    <motion.div
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Flame className="h-5 w-5 text-accent-amber" />
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      className="rounded-xl border border-gray-100 bg-white p-4 dark:border-[#334155] dark:bg-[#1E293B]"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <span style={{ color }}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-dark-slate dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-charcoal dark:text-gray-400">
        {label}
      </p>
    </motion.div>
  );
}

function AchievementCard({
  achievement,
  unlocked,
  unlockDate,
  progress,
}: {
  achievement: (typeof ACHIEVEMENTS)[0];
  unlocked: boolean;
  unlockDate?: string;
  progress?: number;
}) {
  const iconMap: Record<string, React.ComponentType<LucideProps>> = {
    footprints: Footprints,
    star: Star,
    flame: Flame,
    book: BookOpen,
    map: Map,
    clock: HistoryIcon,
    users: Users,
    scale: Scale,
    zap: Zap,
    moon: Moon,
    sun: Sun,
  };

  const Icon = iconMap[achievement.icon] ?? Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className={cn(
        'group relative flex flex-col items-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        unlocked
          ? 'border-accent-amber/30 bg-white dark:border-accent-amber/30 dark:bg-[#1E293B]'
          : 'border-gray-100 bg-white/50 dark:border-[#334155] dark:bg-[#1E293B]/50'
      )}
    >
      {!unlocked && (
        <div className="absolute right-3 top-3">
          <Lock className="h-3.5 w-3.5 text-gray-400" />
        </div>
      )}

      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full transition-all',
          unlocked
            ? 'bg-gradient-to-br from-accent-amber to-[#FBBF24] shadow-glow-amber'
            : 'bg-gray-100 dark:bg-gray-700'
        )}
      >
        <Icon
          className={cn(
            'h-7 w-7',
            unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'
          )}
        />
      </div>

      <p
        className={cn(
          'mt-3 text-sm font-semibold',
          unlocked ? 'text-dark-slate dark:text-white' : 'text-charcoal/60 dark:text-gray-500'
        )}
      >
        {achievement.name}
      </p>
      <p className="mt-1 text-xs text-charcoal/70 dark:text-gray-500">
        {achievement.description}
      </p>

      {unlocked && unlockDate && (
        <p className="mt-2 text-[10px] text-charcoal/50 dark:text-gray-600">
          Unlocked {unlockDate}
        </p>
      )}

      {!unlocked && progress !== undefined && progress > 0 && (
        <div className="mt-3 w-full">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-royal-blue transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-gray-400">{Math.round(progress)}% progress</p>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Profile Component                                             */
/* ------------------------------------------------------------------ */

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showResetModal, setShowResetModal] = useState(false);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [usernameEdit, setUsernameEdit] = useState('');
  const [notifSettings, setNotifSettings] = useState({
    dailyReminders: true,
    achievementNotifications: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const p = loadProfile();
    if (!p.username) {
      p.username = 'Learner';
      p.avatar = 'L';
      saveProfile(p);
    }
    setProfile(p);
    setUsernameEdit(p.username);
    setTestResults(loadTestResults());
  }, []);

  const levelInfo = getLevelForXP(profile.totalXP);
  const xpInfo = getXPToNextLevel(profile.totalXP);

  const handleExportData = useCallback(() => {
    const data = {
      profile,
      testResults,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-in-uk-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profile, testResults]);

  const handleReset = useCallback(() => {
    clearAllData();
    setProfile(getDefaultProfile());
    setTestResults([]);
    setShowResetModal(false);
  }, []);

  const { theme: currentTheme, setTheme: setGlobalTheme } = useTheme();

  const handleThemeChange = useCallback(
    (newTheme: 'light' | 'dark' | 'system') => {
      const updated = { ...profile, preferredMode: newTheme };
      setProfile(updated);
      saveProfile(updated);
      setGlobalTheme(newTheme);
    },
    [profile, setGlobalTheme]
  );

  const handleUsernameSave = useCallback(() => {
    if (usernameEdit.trim()) {
      const updated = { ...profile, username: usernameEdit.trim(), avatar: usernameEdit.trim()[0].toUpperCase() };
      setProfile(updated);
      saveProfile(updated);
    }
  }, [profile, usernameEdit]);

  const handleNotifToggle = useCallback(
    (key: 'dailyReminders' | 'achievementNotifications') => {
      setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const filteredResults = testResults.filter((r) => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'tests') return r.mode !== 'flashcards';
    return r.mode === historyFilter;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getAchievementProgress = (achievementId: string): number => {
    switch (achievementId) {
      case 'first_test':
        return profile.testsCompleted > 0 ? 100 : 0;
      case 'perfect_24':
        return profile.bestScore >= 100 ? 100 : profile.bestScore;
      case 'streak_7':
        return Math.min((profile.currentStreak / 7) * 100, 100);
      case 'streak_30':
        return Math.min((profile.currentStreak / 30) * 100, 100);
      case 'streak_100':
        return Math.min((profile.currentStreak / 100) * 100, 100);
      case 'speed_demon':
        return profile.fastestTestTime > 0 && profile.fastestTestTime < 900 ? 100 : 50;
      case 'ch1_master':
      case 'ch2_master':
      case 'ch3_master':
      case 'ch4_master':
      case 'ch5_master': {
        const chId = parseInt(achievementId.split('_')[1]);
        const chProg = profile.chapterProgress.find((c) => c.chapterId === chId);
        return chProg ? (chProg.questionsCorrect / Math.max(chProg.questionsAttempted, 1)) * 100 : 0;
      }
      default:
        return 0;
    }
  };

  const isUnlocked = (achievementId: string): boolean => {
    return profile.achievements.includes(achievementId) || getAchievementProgress(achievementId) >= 100;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-[1320px] px-4 py-24 md:px-6 lg:px-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="hero-gradient rounded-2xl p-6 shadow-lg md:p-8"
        >
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white/20 text-3xl font-semibold text-white backdrop-blur-sm"
            >
              {profile.avatar || profile.username[0]?.toUpperCase() || 'U'}
            </motion.div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="font-display text-2xl font-semibold text-white md:text-3xl">
                {profile.username || 'Learner'}
              </h1>
              <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-gradient-to-r from-accent-amber to-[#FBBF24] px-3 py-1 text-xs font-semibold text-white">
                  Level {levelInfo.level} &mdash; {levelInfo.title}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/70">
                Studying since {formatDate(new Date().toISOString())}
              </p>
            </div>

            {/* Key Stats */}
            <div className="mt-4 flex items-center gap-6 md:ml-auto md:mt-0">
              {[
                { value: String(profile.testsCompleted || 0), label: 'Tests taken' },
                { value: `${profile.bestScore || 0}%`, label: 'Best score' },
                { value: String(profile.currentStreak || 0), label: 'Day streak' },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div className="text-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="font-display text-2xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs font-medium text-white/70">{stat.label}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden h-8 w-px bg-white/20 md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-white/80">
                {profile.totalXP} XP
              </span>
              <span className="text-xs text-white/60">
                {xpInfo.target - xpInfo.current} XP until Level {levelInfo.level + 1}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-amber to-[#FBBF24]"
                initial={{ width: 0 }}
                animate={{ width: `${xpInfo.progress}%` }}
                transition={{ duration: 1.5, ease: easeOut, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          {[
            { key: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
            { key: 'achievements' as TabType, label: 'Achievements', icon: Trophy },
            { key: 'history' as TabType, label: 'History', icon: HistoryIcon },
            { key: 'settings' as TabType, label: 'Settings', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-medium transition-all duration-200 md:px-6',
                activeTab === tab.key
                  ? 'text-royal-blue'
                  : 'text-charcoal hover:text-dark-slate dark:text-gray-400 dark:hover:text-white'
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-royal-blue rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              {/* Level Progress Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Your Progress
                </h3>
                <p className="mt-1 font-display text-2xl font-semibold text-dark-slate dark:text-white">
                  Level {levelInfo.level} &mdash; {levelInfo.title}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-charcoal dark:text-gray-400">
                      {profile.totalXP} XP
                    </span>
                    <span className="text-xs text-charcoal dark:text-gray-400">
                      {levelInfo.level < 8
                        ? `${(xpInfo.target + (LEVELS.find((l) => l.level === levelInfo.level)?.xpRequired ?? 0))} XP`
                        : 'Max'}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-amber to-[#FBBF24]"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpInfo.progress}%` }}
                      transition={{ duration: 1.5, ease: easeOut }}
                    />
                  </div>
                  {levelInfo.level < 8 && (
                    <p className="mt-2 text-xs text-charcoal dark:text-gray-400">
                      {xpInfo.target - xpInfo.current} XP until Level {levelInfo.level + 1} (
                      {LEVELS.find((l) => l.level === levelInfo.level + 1)?.title})
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatCard
                  icon={HelpCircle}
                  value={String(profile.totalQuestionsAnswered || 0)}
                  label="Total Questions"
                  color="#2563EB"
                  delay={0}
                />
                <StatCard
                  icon={CheckCircle}
                  value={String(profile.totalCorrect || 0)}
                  label="Correct Answers"
                  color="#059669"
                  delay={0.06}
                />
                <StatCard
                  icon={Target}
                  value={`${Math.round(profile.averageScore || 0)}%`}
                  label="Accuracy Rate"
                  color="#8B5CF6"
                  delay={0.12}
                />
                <StatCard
                  icon={ClipboardCheck}
                  value={`${profile.testsPassed || 0}/${profile.testsCompleted || 0}`}
                  label="Tests Passed"
                  color="#3B82F6"
                  delay={0.18}
                />
                <StatCard
                  icon={Flame}
                  value={`${profile.longestStreak || 0} days`}
                  label="Longest Streak"
                  color="#F59E0B"
                  delay={0.24}
                />
                <StatCard
                  icon={Clock}
                  value="--"
                  label="Study Time"
                  color="#64748B"
                  delay={0.3}
                />
              </div>

              {/* Chapter Performance */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Chapter Performance
                </h3>
                <div className="mt-4 space-y-3">
                  {CHAPTERS.map((ch) => {
                    const cp = profile.chapterProgress.find((c) => c.chapterId === ch.id);
                    const pct = cp && cp.questionsAttempted > 0
                      ? Math.round((cp.questionsCorrect / cp.questionsAttempted) * 100)
                      : 0;
                    return (
                      <div key={ch.id} className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: ch.color }}
                        />
                        <span className="w-24 shrink-0 text-xs font-medium text-charcoal dark:text-gray-400 md:w-32">
                          {ch.shortName}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: ch.color,
                            }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right text-xs font-medium text-charcoal dark:text-gray-400">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 text-sm font-medium text-royal-blue hover:underline"
                >
                  View Detailed Analytics &rarr;
                </button>
              </div>

              {/* Current Streak */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#334155] dark:bg-[#1E293B]">
                <FlameIcon />
                <div>
                  <p className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                    {profile.currentStreak || 0}-Day Streak
                  </p>
                  <p className="text-xs text-charcoal dark:text-gray-400">
                    Keep studying daily to maintain your streak!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {/* Progress Summary */}
              <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 dark:border-[#334155] dark:bg-[#1E293B]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal dark:text-gray-300">
                    {profile.achievements.length} of {ACHIEVEMENTS.length} achievements unlocked
                  </p>
                  <p className="text-xs text-charcoal dark:text-gray-500">
                    {Math.round((profile.achievements.length / ACHIEVEMENTS.length) * 100)}%
                  </p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <motion.div
                    className="h-full rounded-full bg-royal-blue"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(profile.achievements.length / ACHIEVEMENTS.length) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: easeOut }}
                  />
                </div>
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <AchievementCard
                      achievement={ach}
                      unlocked={isUnlocked(ach.id)}
                      unlockDate={
                        isUnlocked(ach.id)
                          ? formatDate(new Date(Date.now() - Math.random() * 10000000000).toISOString())
                          : undefined
                      }
                      progress={getAchievementProgress(ach.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {/* Filter Bar */}
              <div className="mb-4 flex flex-wrap gap-2">
                {['all', 'quick', 'full', 'chapter', 'marathon'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all',
                      historyFilter === f
                        ? 'bg-royal-blue text-white'
                        : 'bg-gray-100 text-charcoal hover:bg-gray-200 dark:bg-[#1E293B] dark:text-gray-400 dark:hover:bg-[#334155]'
                    )}
                  >
                    {f === 'all' ? 'All' : f === 'full' ? 'Full Mock' : f}
                  </button>
                ))}
              </div>

              {/* History List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredResults.map((result, i) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1E293B]"
                    >
                      <div
                        className="flex cursor-pointer items-center gap-4 p-4 md:p-5"
                        onClick={() =>
                          setExpandedResult((prev) =>
                            prev === result.id ? null : result.id
                          )
                        }
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                            result.passed
                              ? 'bg-success-green/10 text-success-green'
                              : 'bg-alert-red/10 text-alert-red'
                          )}
                        >
                          {result.passed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Target className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-dark-slate dark:text-white">
                            {result.mode === 'quick'
                              ? 'Quick Fire Session'
                              : result.mode === 'full'
                                ? 'Full Mock Test'
                                : result.mode === 'chapter'
                                  ? 'Chapter Practice'
                                  : 'Marathon Session'}
                          </p>
                          <p className="text-xs text-charcoal dark:text-gray-400">
                            {formatDate(result.date)} &middot; {result.totalQuestions} questions &middot;{' '}
                            {formatTime(result.timeTaken)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-semibold',
                              result.passed
                                ? 'bg-success-green/10 text-success-green'
                                : 'bg-alert-red/10 text-alert-red'
                            )}
                          >
                            {result.score}%
                          </span>
                          {expandedResult === result.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedResult === result.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-[#334155] md:px-5">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-[#0F172A]">
                                  <p className="text-lg font-bold text-dark-slate dark:text-white">
                                    {result.correctAnswers}/{result.totalQuestions}
                                  </p>
                                  <p className="text-[10px] text-charcoal dark:text-gray-500">
                                    Correct
                                  </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-[#0F172A]">
                                  <p className="text-lg font-bold text-dark-slate dark:text-white">
                                    {result.score}%
                                  </p>
                                  <p className="text-[10px] text-charcoal dark:text-gray-500">
                                    Score
                                  </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-[#0F172A]">
                                  <p className="text-lg font-bold text-dark-slate dark:text-white">
                                    {formatTime(result.timeTaken)}
                                  </p>
                                  <p className="text-[10px] text-charcoal dark:text-gray-500">
                                    Time
                                  </p>
                                </div>
                              </div>
                              {result.chapterBreakdown && (
                                <div className="mt-3">
                                  <p className="mb-2 text-xs font-medium text-charcoal dark:text-gray-400">
                                    Chapter Breakdown
                                  </p>
                                  {Object.entries(result.chapterBreakdown).map(
                                    ([chId, data]) => {
                                      const ch = CHAPTERS.find(
                                        (c) => c.id === parseInt(chId)
                                      );
                                      return ch ? (
                                        <div
                                          key={chId}
                                          className="mb-1 flex items-center gap-2"
                                        >
                                          <div
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: ch.color }}
                                          />
                                          <span className="flex-1 text-xs text-charcoal dark:text-gray-400">
                                            {ch.shortName}
                                          </span>
                                          <span className="text-xs font-medium text-dark-slate dark:text-white">
                                            {data.correct}/{data.attempted}
                                          </span>
                                        </div>
                                      ) : null;
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredResults.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-[#334155]">
                    <p className="text-sm text-charcoal dark:text-gray-500">
                      No test results yet. Start practising to see your history!
                    </p>
                    <button
                      onClick={() => navigate('/practice')}
                      className="mt-3 text-sm font-medium text-royal-blue hover:underline"
                    >
                      Go to Practice &rarr;
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              {/* Profile Settings */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Profile
                </h3>
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-charcoal dark:text-gray-400">
                    Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={usernameEdit}
                      onChange={(e) => setUsernameEdit(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-dark-slate outline-none transition-colors focus:border-royal-blue dark:border-[#475569] dark:bg-[#0F172A] dark:text-white"
                    />
                    <button
                      onClick={handleUsernameSave}
                      className="rounded-xl bg-royal-blue px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-charcoal dark:text-gray-400">
                    Avatar
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-royal-blue/10 text-lg font-semibold text-royal-blue">
                      {profile.avatar || profile.username[0]?.toUpperCase()}
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...profile };
                        saveProfile(updated);
                        setProfile({ ...updated });
                      }}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-charcoal transition-all hover:bg-gray-50 dark:border-[#475569] dark:text-gray-300 dark:hover:bg-[#334155]"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Appearance
                </h3>
                <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                  Choose your preferred theme
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {([
                    { key: 'light', label: 'Light', icon: SunMedium },
                    { key: 'dark', label: 'Dark', icon: Moon },
                    { key: 'system', label: 'System', icon: Monitor },
                  ] as const).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => handleThemeChange(t.key)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                        currentTheme === t.key
                          ? 'border-royal-blue bg-royal-blue/5 dark:border-royal-blue dark:bg-royal-blue/10'
                          : 'border-gray-100 hover:border-gray-200 dark:border-[#334155] dark:hover:border-[#475569]'
                      )}
                    >
                      <t.icon
                        className={cn(
                          'h-5 w-5',
                          currentTheme === t.key
                            ? 'text-royal-blue'
                            : 'text-charcoal dark:text-gray-400'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium',
                          currentTheme === t.key
                            ? 'text-royal-blue'
                            : 'text-charcoal dark:text-gray-400'
                        )}
                      >
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Notifications
                </h3>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      key: 'dailyReminders' as const,
                      label: 'Daily Study Reminders',
                      desc: 'Get reminded to study every day',
                    },
                    {
                      key: 'achievementNotifications' as const,
                      label: 'Achievement Notifications',
                      desc: 'Be notified when you unlock achievements',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-dark-slate dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-xs text-charcoal dark:text-gray-500">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotifToggle(item.key)}
                        className={cn(
                          'relative h-7 w-12 rounded-full transition-colors',
                          notifSettings[item.key]
                            ? 'bg-royal-blue'
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      >
                        <motion.div
                          animate={{
                            x: notifSettings[item.key] ? 20 : 2,
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Management */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  Data Management
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-royal-blue px-5 py-2.5 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-alert-red px-5 py-2.5 text-sm font-semibold text-alert-red transition-all hover:bg-alert-red hover:text-white"
                  >
                    Reset All Progress
                  </button>
                </div>
              </div>

              {/* About */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
                <h3 className="font-display text-lg font-semibold text-dark-slate dark:text-white">
                  About
                </h3>
                <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                  Life in the UK Test Pro v1.0
                </p>
                <p className="mt-1 text-xs text-charcoal dark:text-gray-500">
                  Built with care for future citizens
                </p>
                <div className="mt-4 flex gap-4">
                  <button className="text-xs text-royal-blue hover:underline">
                    Terms & Conditions
                  </button>
                  <button className="text-xs text-royal-blue hover:underline">
                    Privacy Policy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1E293B]"
            >
              <h3 className="font-display text-xl font-semibold text-dark-slate dark:text-white">
                Reset All Progress?
              </h3>
              <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                This will permanently delete all your test results, achievements,
                streaks, and XP. This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-medium text-charcoal transition-all hover:bg-gray-50 dark:border-[#475569] dark:text-gray-300 dark:hover:bg-[#334155]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-full bg-alert-red py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
