import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ClipboardCheck,
  BookOpen,
  Layers,
  Infinity as InfinityIcon,
  Search,
  Trophy,
  ChevronRight,
  BarChart3,
  Filter,
  ArrowUpDown,
  Flame,
  Heart,
  Star,
  Shuffle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { questions, CHAPTERS } from '@/data/questions';
import { CHAPTER_COLORS } from '@/components/TopicIcon';
import * as TopicIcons from '@/components/TopicIcon';
import { loadTestResults, loadProfile } from '@/lib/storage';
import type { TestResult } from '@/lib/storage';
import Layout from '@/components/Layout';

type StudyMode = 'quick' | 'full' | 'chapter' | 'flashcards' | 'marathon';
type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type SortOption = 'recommended' | 'newest' | 'hardest' | 'easiest' | 'attempted';

interface GeneratedTest {
  id: string;
  title: string;
  questionCount: number;
  timeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  chapterIds: number[];
  bestScore?: number;
  isCompleted?: boolean;
}

const MODES: { id: StudyMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'quick', label: 'Quick Fire', icon: Zap, description: '10 rapid-fire questions' },
  { id: 'full', label: 'Full Mock', icon: ClipboardCheck, description: '24 questions, 45 min timer' },
  { id: 'chapter', label: 'By Chapter', icon: BookOpen, description: 'Focus on one chapter' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, description: 'Flip through key facts' },
  { id: 'marathon', label: 'Marathon', icon: InfinityIcon, description: 'Endless questions' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateFullMockTests(): GeneratedTest[] {
  const tests: GeneratedTest[] = [];
  const shuffled = shuffleArray(questions);
  // Create 16 full mock tests with 24 questions each
  for (let i = 0; i < 16; i++) {
    const startIdx = i * 24;
    const qs = shuffled.slice(startIdx % shuffled.length, (startIdx % shuffled.length) + 24);
    if (qs.length < 24) {
      qs.push(...shuffled.slice(0, 24 - qs.length));
    }
    const chapterIds = [...new Set(qs.map((q) => q.chapterId))].sort();
    const difficulties = qs.map((q) => q.difficulty);
    const hardCount = difficulties.filter((d) => d === 'hard').length;
    const diff = hardCount > 10 ? 'hard' : hardCount > 5 ? 'medium' : 'easy';
    tests.push({
      id: `full-${i + 1}`,
      title: `Life in the UK Test #${i + 1}`,
      questionCount: 24,
      timeMinutes: 45,
      difficulty: diff as 'easy' | 'medium' | 'hard' | 'mixed',
      chapterIds,
    });
  }
  return tests;
}

function generateQuickFireTests(): GeneratedTest[] {
  const tests: GeneratedTest[] = [];
  const shuffled = shuffleArray(questions);
  for (let i = 0; i < 8; i++) {
    const startIdx = i * 10;
    const qs = shuffled.slice(startIdx % shuffled.length, (startIdx % shuffled.length) + 10);
    if (qs.length < 10) {
      qs.push(...shuffled.slice(0, 10 - qs.length));
    }
    const chapterIds = [...new Set(qs.map((q) => q.chapterId))].sort();
    tests.push({
      id: `quick-${i + 1}`,
      title: `Quick Fire #${i + 1}`,
      questionCount: 10,
      timeMinutes: 0,
      difficulty: 'mixed',
      chapterIds,
    });
  }
  return tests;
}

function getChapterTests(chapterId: number): GeneratedTest[] {
  const chapterQuestions = questions.filter((q) => q.chapterId === chapterId);
  const tests: GeneratedTest[] = [];
  const qCount = chapterQuestions.length;
  const testCount = Math.ceil(qCount / 24);
  for (let i = 0; i < Math.min(testCount, 8); i++) {
    const start = i * 24;
    const count = Math.min(24, qCount - start);
    if (count <= 0) break;
    const difficulties = chapterQuestions.slice(start, start + count).map((q) => q.difficulty);
    const hardCount = difficulties.filter((d) => d === 'hard').length;
    const diff = hardCount > count / 2 ? 'hard' : hardCount > count / 4 ? 'medium' : 'easy';
    tests.push({
      id: `chapter-${chapterId}-${i + 1}`,
      title: `${CHAPTERS[chapterId - 1].shortName} Test #${i + 1}`,
      questionCount: count,
      timeMinutes: Math.ceil(count * 1.875),
      difficulty: diff as 'easy' | 'medium' | 'hard' | 'mixed',
      chapterIds: [chapterId],
    });
  }
  return tests;
}

export default function Practice() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<StudyMode>('full');
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const results = loadTestResults();
    setTestResults(results);
    setProfileLoaded(true);
  }, []);

  const allFullMockTests = useMemo(() => generateFullMockTests(), []);
  const allQuickFireTests = useMemo(() => generateQuickFireTests(), []);

  const filteredTests = useMemo(() => {
    let tests = activeMode === 'quick' ? allQuickFireTests : allFullMockTests;

    // Attach best scores
    tests = tests.map((t) => {
      const result = testResults.find((r) => r.id === t.id);
      return {
        ...t,
        bestScore: result ? result.score : undefined,
        isCompleted: !!result,
      };
    });

    if (chapterFilter !== 'all') {
      tests = tests.filter((t) => t.chapterIds.includes(chapterFilter as number));
    }
    if (difficultyFilter !== 'all') {
      tests = tests.filter((t) => t.difficulty === difficultyFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tests = tests.filter((t) => t.title.toLowerCase().includes(q));
    }

    switch (sortOption) {
      case 'hardest':
        tests = [...tests].sort((a, b) => {
          const diffOrder = { hard: 3, medium: 2, easy: 1, mixed: 2 };
          return diffOrder[b.difficulty] - diffOrder[a.difficulty];
        });
        break;
      case 'easiest':
        tests = [...tests].sort((a, b) => {
          const diffOrder = { hard: 3, medium: 2, easy: 1, mixed: 2 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        });
        break;
      case 'attempted':
        tests = [...tests].sort((a, b) => (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0));
        break;
      default:
        break;
    }

    return tests;
  }, [activeMode, chapterFilter, difficultyFilter, sortOption, searchQuery, allFullMockTests, allQuickFireTests, testResults]);

  const chapterProgress = useMemo(() => {
    const profile = loadProfile();
    return profile.chapterProgress;
  }, [profileLoaded]);

  const lastTest = testResults[0];

  const handleStartTest = (testId: string) => {
    navigate(`/test/${activeMode}/${testId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <Layout>
      <div className="min-h-[100dvh] bg-light-gray dark:bg-dark-slate">
        <div className="mx-auto max-w-[1320px] px-4 py-24 md:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-dark-slate dark:text-white md:text-[2rem]">
                Choose Your Challenge
              </h1>
              <p className="mt-1 text-sm text-charcoal dark:text-gray-400 md:text-base">
                {Math.floor(questions.length / 24)}+ practice tests across 5 chapters. Pick a mode and start learning.
              </p>
            </div>
            {lastTest && (
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-charcoal shadow-sm dark:bg-[#1E293B] dark:text-gray-300">
                <span className="inline-block h-2 w-2 rounded-full bg-success-green" />
                Last test: {lastTest.mode === 'full' ? 'Full Mock' : lastTest.mode} — {lastTest.score}%
              </div>
            )}
          </motion.div>

          {/* Study Mode Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-6 rounded-xl bg-white p-2 shadow-sm dark:bg-[#1E293B]"
          >
            <div className="flex gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={cn(
                      'relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 snap-start whitespace-nowrap min-w-[100px]',
                      isActive
                        ? 'bg-royal-blue text-white shadow-sm'
                        : 'text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{mode.label}</span>
                    <span className="sm:hidden text-xs">{mode.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="mode-indicator"
                        className="absolute inset-0 rounded-lg bg-royal-blue"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Filter Bar */}
          <AnimatePresence mode="wait">
            {(activeMode === 'full' || activeMode === 'chapter') && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex flex-wrap items-center gap-3"
              >
                {/* Chapter Filter */}
                <div className="relative">
                  <select
                    value={chapterFilter}
                    onChange={(e) => setChapterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="appearance-none rounded-full border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-charcoal shadow-sm focus:border-royal-blue focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-gray-300"
                  >
                    <option value="all">All Chapters</option>
                    {CHAPTERS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Ch {ch.id}: {ch.shortName}
                      </option>
                    ))}
                  </select>
                  <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-charcoal dark:text-gray-400" />
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-[#334155] dark:bg-[#0F172A]">
                  {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficultyFilter(d)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium capitalize transition-all',
                        difficultyFilter === d
                          ? 'bg-royal-blue text-white'
                          : 'text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="appearance-none rounded-full border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-charcoal shadow-sm focus:border-royal-blue focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-gray-300"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest</option>
                    <option value="hardest">Hardest</option>
                    <option value="easiest">Easiest</option>
                    <option value="attempted">Most Attempted</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-charcoal dark:text-gray-400" />
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-charcoal placeholder:text-gray-400 focus:border-royal-blue focus:outline-none dark:border-[#334155] dark:bg-[#0F172A] dark:text-gray-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content by Mode */}
          <AnimatePresence mode="wait">
            {/* FULL MOCK MODE */}
            {activeMode === 'full' && (
              <motion.div
                key="full-mock"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredTests.map((test, idx) => (
                  <motion.div
                    key={test.id}
                    variants={cardVariants}
                    custom={idx}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={cn(
                      'group cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg dark:bg-[#1E293B]',
                      test.isCompleted
                        ? 'border-success-green/30 dark:border-success-green/30'
                        : 'border-gray-100 dark:border-[#334155] hover:border-royal-blue/30'
                    )}
                    onClick={() => handleStartTest(test.id)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-royal-blue px-2.5 py-1 text-xs font-semibold text-white">
                          #{test.id.split('-')[1]}
                        </span>
                        {/* Chapter icon badge */}
                        {(() => {
                          const primaryChapter = test.chapterIds[0] || 1;
                          const colors = CHAPTER_COLORS[primaryChapter] || CHAPTER_COLORS[1];
                          const IconSet = [
                            TopicIcons.ScaleIcon, TopicIcons.UKFlagIcon, TopicIcons.CrownIcon,
                            TopicIcons.TheatreIcon, TopicIcons.ParliamentIcon
                          ];
                          const ChapterIcon = IconSet[(primaryChapter - 1) % 5] || TopicIcons.ScaleIcon;
                          return (
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${colors.bg}`}>
                              <ChapterIcon className={`h-4 w-4 ${colors.text}`} />
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {test.chapterIds.slice(0, 3).map((cid) => {
                          const ch = CHAPTERS.find((c) => c.id === cid);
                          return ch ? (
                            <span
                              key={cid}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium dark:bg-white/5"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${ch.color} 15%, transparent)`,
                                color: ch.color,
                              }}
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ch.color }} />
                              Ch {cid}
                            </span>
                          ) : null;
                        })}
                        {test.chapterIds.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-charcoal dark:bg-white/5 dark:text-gray-400">
                            +{test.chapterIds.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-lg font-semibold text-dark-slate dark:text-white">
                      {test.title}
                    </h3>
                    <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                      {test.questionCount} questions · {test.timeMinutes} minutes · Mixed chapters
                    </p>

                    {/* Difficulty bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-[#334155]">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            test.difficulty === 'easy' && 'w-1/3 bg-success-green'
                          )}
                          style={{
                            width: test.difficulty === 'easy' ? '33%' : test.difficulty === 'medium' ? '66%' : '100%',
                            backgroundColor: test.difficulty === 'easy' ? '#059669' : test.difficulty === 'medium' ? '#F59E0B' : '#DC2626',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium capitalize text-charcoal dark:text-gray-400">
                        {test.difficulty}
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-4 flex items-center justify-between">
                      {test.bestScore !== undefined ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-success-green">
                          <Trophy className="h-3.5 w-3.5" />
                          Your best: {test.bestScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Not taken yet</span>
                      )}
                      <span className="flex items-center gap-1 rounded-full bg-royal-blue px-4 py-2 text-xs font-semibold text-white transition-transform group-active:scale-95">
                        Take Test
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* QUICK FIRE MODE */}
            {activeMode === 'quick' && (
              <motion.div
                key="quick-fire"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6"
              >
                {/* Hero Card */}
                <motion.div
                  variants={cardVariants}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-md dark:border-[#334155] dark:bg-[#1E293B] md:p-12"
                >
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="h-12 w-12 text-accent-amber" />
                    </motion.div>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-dark-slate dark:text-white md:text-3xl">
                    10 Questions · No Timer
                  </h2>
                  <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                    Rapid-fire practice. Perfect for a quick session.
                  </p>
                  <button
                    onClick={() => handleStartTest('new')}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-glow-blue hover:brightness-110 active:scale-95"
                  >
                    <Zap className="h-4 w-4" />
                    Start Quick Fire
                  </button>
                  <p className="mt-3 text-xs text-charcoal dark:text-gray-400">
                    Questions pulled from your weakest areas
                  </p>
                </motion.div>

                {/* Quick fire test list */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {allQuickFireTests.map((test, idx) => (
                    <motion.div
                      key={test.id}
                      variants={cardVariants}
                      custom={idx}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-[#334155] dark:bg-[#1E293B]"
                      onClick={() => handleStartTest(test.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-dark-slate dark:text-white">
                          Quick Fire #{idx + 1}
                        </span>
                        <Zap className="h-4 w-4 text-accent-amber" />
                      </div>
                      <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                        {test.questionCount} questions
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* BY CHAPTER MODE */}
            {activeMode === 'chapter' && (
              <motion.div
                key="by-chapter"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {CHAPTERS.map((chapter, idx) => {
                  const chProgress = chapterProgress.find((p) => p.chapterId === chapter.id);
                  const progress = chProgress
                    ? Math.round((chProgress.questionsCorrect / Math.max(chProgress.questionsAttempted, 1)) * 100)
                    : 0;
                  const qCount = questions.filter((q) => q.chapterId === chapter.id).length;
                  const tests = getChapterTests(chapter.id);

                  return (
                    <motion.div
                      key={chapter.id}
                      variants={cardVariants}
                      custom={idx}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group cursor-pointer rounded-2xl border-2 p-6 dark:bg-[#1E293B]"
                      style={{
                        borderColor: `color-mix(in srgb, ${chapter.color} 30%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${chapter.color} 5%, transparent)`,
                      }}
                      onClick={() => handleStartTest(`chapter-${chapter.id}-1`)}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `color-mix(in srgb, ${chapter.color} 15%, transparent)` }}
                        >
                          <BookOpen className="h-6 w-6" style={{ color: chapter.color }} />
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${chapter.color} 15%, transparent)`,
                            color: chapter.color,
                          }}
                        >
                          Ch {chapter.id}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-dark-slate dark:text-white">
                        {chapter.shortName}
                      </h3>
                      <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                        {chapter.name}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-charcoal dark:text-gray-300">
                        <BarChart3 className="h-3.5 w-3.5" />
                        {tests.length} tests · {qCount} questions
                      </div>

                      {/* Progress */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-charcoal dark:text-gray-400">
                            Your progress
                          </span>
                          <span className="text-xs font-semibold" style={{ color: chapter.color }}>
                            {progress}%
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-[#334155]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: chapter.color }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTest(`chapter-${chapter.id}-1`);
                        }}
                        className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: chapter.color }}
                      >
                        Start Chapter
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/study/${chapter.id}`);
                        }}
                        className="mt-2 ml-3 text-xs font-medium text-charcoal transition-colors hover:text-royal-blue dark:text-gray-400 dark:hover:text-white"
                      >
                        Study Materials
                      </button>
                    </motion.div>
                  );
                })}

                {/* Individual chapter tests below */}
                {chapterFilter !== 'all' && (
                  <div className="col-span-full mt-4">
                    <h3 className="text-lg font-semibold text-dark-slate dark:text-white">
                      {CHAPTERS.find((c) => c.id === chapterFilter)?.shortName} Tests
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {getChapterTests(chapterFilter as number).map((test, idx) => (
                        <motion.div
                          key={test.id}
                          variants={cardVariants}
                          custom={idx}
                          whileHover={{ y: -4 }}
                          className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]"
                          onClick={() => handleStartTest(test.id)}
                        >
                          <h4 className="text-sm font-semibold text-dark-slate dark:text-white">{test.title}</h4>
                          <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                            {test.questionCount} questions · {test.timeMinutes} min
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* FLASHCARDS MODE */}
            {activeMode === 'flashcards' && (
              <motion.div
                key="flashcards"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6"
              >
                <motion.div
                  variants={cardVariants}
                  className="mb-4 flex items-center justify-center"
                >
                  <button
                    onClick={() => navigate('/study')}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-royal-blue px-6 py-2.5 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white active:scale-95"
                  >
                    <Shuffle className="h-4 w-4" />
                    Shuffle All Chapters
                  </button>
                </motion.div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {CHAPTERS.map((chapter, idx) => {
                    const chProgress = chapterProgress.find((p) => p.chapterId === chapter.id);
                    const flashcardsStudied = chProgress?.flashcardsStudied ?? 0;
                    const totalFlashcards = chProgress?.totalFlashcards ?? 20;

                    return (
                      <motion.div
                        key={chapter.id}
                        variants={cardVariants}
                        custom={idx}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-[#334155] dark:bg-[#1E293B]"
                        style={{ borderTopWidth: '4px', borderTopColor: chapter.color }}
                        onClick={() => navigate('/study')}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `color-mix(in srgb, ${chapter.color} 15%, transparent)` }}
                          >
                            <Layers className="h-5 w-5" style={{ color: chapter.color }} />
                          </div>
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${chapter.color} 15%, transparent)`,
                              color: chapter.color,
                            }}
                          >
                            {flashcardsStudied}/{totalFlashcards} studied
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-dark-slate dark:text-white">
                          {chapter.shortName}
                        </h3>
                        <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                          {chapter.name}
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#334155]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(flashcardsStudied / totalFlashcards) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: chapter.color }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* MARATHON MODE */}
            {activeMode === 'marathon' && (
              <motion.div
                key="marathon"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-6"
              >
                <motion.div
                  variants={cardVariants}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-md dark:border-[#334155] dark:bg-[#1E293B] md:p-12"
                >
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <InfinityIcon className="h-12 w-12 text-royal-blue" />
                    </motion.div>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-dark-slate dark:text-white md:text-3xl">
                    Endless Questions
                  </h2>
                  <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                    Keep going until you stop. Track your endurance streak.
                  </p>

                  {/* Marathon stats */}
                  <div className="mt-6 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-accent-amber" />
                      <div className="text-left">
                        <div className="text-lg font-bold text-dark-slate dark:text-white">
                          {testResults.length > 0 ? '67' : '0'}
                        </div>
                        <div className="text-[10px] text-charcoal dark:text-gray-400">Best streak</div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-[#334155]" />
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-alert-red" />
                      <div className="text-left">
                        <div className="text-lg font-bold text-dark-slate dark:text-white">3</div>
                        <div className="text-[10px] text-charcoal dark:text-gray-400">Lives</div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-[#334155]" />
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-success-green" />
                      <div className="text-left">
                        <div className="text-lg font-bold text-dark-slate dark:text-white">
                          {testResults.length > 0 ? '1,240' : '0'}
                        </div>
                        <div className="text-[10px] text-charcoal dark:text-gray-400">High score</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTest('new')}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-glow-blue hover:brightness-110 active:scale-95"
                  >
                    <InfinityIcon className="h-4 w-4" />
                    Start Marathon
                  </button>

                  <p className="mt-3 text-xs text-charcoal dark:text-gray-400">
                    Progressive difficulty. How far can you go?
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {((activeMode === 'full' || activeMode === 'quick') && filteredTests.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center"
            >
              <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-sm text-charcoal dark:text-gray-400">
                No tests match your filters. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setChapterFilter('all');
                  setDifficultyFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-sm font-medium text-royal-blue hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
