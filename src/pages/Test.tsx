import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  Heart,
  RotateCcw,
  ArrowRight,
  Eye,
  ClipboardCheck,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { questions, CHAPTERS } from '@/data/questions';
import type { Question } from '@/data/questions';
import { QuestionVisual } from '@/components/TopicIcon';
import {
  loadProfile,
  saveProfile,
  saveTestResult,
  saveTestSession,
  loadTestResults,
} from '@/lib/storage';
import {
  calculateXPForTest,
  checkAchievements,
  updateStreak,
  XP_ACTIONS,
} from '@/lib/gamification';
import type { TestResult } from '@/lib/storage';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TestMode = 'quick' | 'full' | 'chapter' | 'marathon' | 'flashcards';

interface TestState {
  currentIndex: number;
  answers: Record<number, number>;
  flagged: Set<number>;
  timeRemaining: number; // seconds
  isSubmitted: boolean;
  isReviewing: boolean;
  score: number;
}

interface MarathonState {
  lives: number;
  streak: number;
  score: number;
  gameOver: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateTestQuestions(mode: TestMode, id: string): Question[] {
  if (mode === 'marathon') {
    return shuffle(questions).slice(0, 100);
  }
  if (mode === 'quick') {
    return shuffle(questions).slice(0, 10);
  }
  if (mode === 'chapter') {
    const chapterId = parseInt(id.split('-')[1] || '1', 10);
    const chapterQs = questions.filter((q) => q.chapterId === chapterId);
    return shuffle(chapterQs).slice(0, Math.min(24, chapterQs.length));
  }
  // full mock
  const testNum = parseInt(id.split('-')[1] || '1', 10);
  const shuffled = shuffle(questions);
  const startIdx = ((testNum - 1) * 24) % shuffled.length;
  const qs = shuffled.slice(startIdx, startIdx + 24);
  if (qs.length < 24) qs.push(...shuffled.slice(0, 24 - qs.length));
  return qs;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getDifficultyColor(d: string): string {
  switch (d) {
    case 'easy': return '#059669';
    case 'medium': return '#F59E0B';
    case 'hard': return '#DC2626';
    default: return '#CBD5E1';
  }
}

function getTimerColor(seconds: number): string {
  if (seconds < 60) return '#DC2626';
  if (seconds < 300) return '#F59E0B';
  return '#334155';
}

/* ------------------------------------------------------------------ */
/*  Progress Ring                                                      */
/* ------------------------------------------------------------------ */

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#2563EB',
  label,
  sublabel,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          className="dark:stroke-[#334155]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold" style={{ color }}>
          {Math.round(percentage)}%
        </span>
        {(label || sublabel) && (
          <div className="mt-1 text-center">
            {label && <span className="block text-[10px] font-medium text-charcoal dark:text-gray-400">{label}</span>}
            {sublabel && <span className="block text-[10px] text-charcoal dark:text-gray-400">{sublabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Test() {
  const { mode, id } = useParams<{ mode: string; id: string }>();
  const navigate = useNavigate();
  const testMode = (mode as TestMode) || 'full';
  const testId = id || '1';

  /* --- derived data --- */
  const testQuestions = useMemo(() => generateTestQuestions(testMode, testId), [testMode, testId]);
  const totalQuestions = testQuestions.length;
  const testTitle = useMemo(() => {
    if (testMode === 'quick') return 'Quick Fire';
    if (testMode === 'marathon') return 'Marathon';
    if (testMode === 'chapter') {
      const chId = parseInt(testId.split('-')[1] || '1', 10);
      return `Chapter ${chId}`;
    }
    return `Full Mock #${testId.split('-')[1] || '1'}`;
  }, [testMode, testId]);

  const timeLimit = testMode === 'full' ? 45 * 60 : testMode === 'quick' ? 15 * 60 : 0;

  /* --- state --- */
  const [state, setState] = useState<TestState>({
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    timeRemaining: timeLimit,
    isSubmitted: false,
    isReviewing: false,
    score: 0,
  });

  const [marathon, setMarathon] = useState<MarathonState>({
    lives: 3,
    streak: 0,
    score: 0,
    gameOver: false,
    difficulty: 'mixed',
  });

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [showCorrectness, setShowCorrectness] = useState<Record<number, boolean>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  /* --- timer --- */
  useEffect(() => {
    if (timeLimit <= 0 || state.isSubmitted || state.isReviewing) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit, state.isSubmitted, state.isReviewing]);

  /* --- derived values --- */
  const answeredCount = Object.keys(state.answers).length;
  const currentQuestion = testQuestions[state.currentIndex];
  const timerColor = getTimerColor(state.timeRemaining);
  const timerIsWarning = state.timeRemaining < 300 && state.timeRemaining > 0;
  const timerIsCritical = state.timeRemaining < 60 && state.timeRemaining > 0;

  /* --- actions --- */
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (state.isSubmitted || state.isReviewing) return;
      if (testMode === 'marathon') {
        // Marathon: instant feedback
        const isCorrect = optionIndex === currentQuestion.correctIndex;
        setState((prev) => ({
          ...prev,
          answers: { ...prev.answers, [prev.currentIndex]: optionIndex },
        }));
        if (isCorrect) {
          setMarathon((prev) => ({
            ...prev,
            streak: prev.streak + 1,
            score: prev.score + 10 + prev.streak,
          }));
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              currentIndex: prev.currentIndex + 1,
            }));
            setHasCheckedAnswer(false);
          }, 500);
        } else {
          setMarathon((prev) => ({
            ...prev,
            lives: prev.lives - 1,
            streak: 0,
          }));
          if (marathon.lives <= 1) {
            setMarathon((prev) => ({ ...prev, gameOver: true }));
          } else {
            setTimeout(() => {
              setState((prev) => ({
                ...prev,
                currentIndex: prev.currentIndex + 1,
              }));
              setHasCheckedAnswer(false);
            }, 500);
          }
        }
        return;
      }

      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [prev.currentIndex]: optionIndex },
      }));
      setHasCheckedAnswer(false);
    },
    [state.isSubmitted, state.isReviewing, testMode, currentQuestion, marathon.lives]
  );

  const handleCheckAnswer = useCallback(() => {
    setHasCheckedAnswer(true);
    setShowCorrectness((prev) => ({ ...prev, [state.currentIndex]: true }));
  }, [state.currentIndex]);

  const handleNext = useCallback(() => {
    if (state.currentIndex < totalQuestions - 1) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
      setHasCheckedAnswer(false);
    }
  }, [state.currentIndex, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (state.currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
      }));
      setHasCheckedAnswer(false);
    }
  }, [state.currentIndex]);

  const handleJump = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentIndex: index }));
    setHasCheckedAnswer(false);
  }, []);

  const handleFlag = useCallback(() => {
    setState((prev) => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(prev.currentIndex)) {
        newFlagged.delete(prev.currentIndex);
      } else {
        newFlagged.add(prev.currentIndex);
      }
      return { ...prev, flagged: newFlagged };
    });
  }, []);

  const calculateScore = useCallback((): number => {
    let correct = 0;
    Object.entries(state.answers).forEach(([qIdx, aIdx]) => {
      const qi = parseInt(qIdx, 10);
      if (testQuestions[qi] && testQuestions[qi].correctIndex === aIdx) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  }, [state.answers, testQuestions, totalQuestions]);

  const handleSubmit = useCallback(() => {
    const score = calculateScore();
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setState((prev) => ({
      ...prev,
      isSubmitted: true,
      score,
      timeRemaining: prev.timeRemaining,
    }));
    setShowFinishModal(false);

    // Save results
    const chapterBreakdown: Record<number, { attempted: number; correct: number }> = {};
    Object.entries(state.answers).forEach(([qIdx, aIdx]) => {
      const qi = parseInt(qIdx, 10);
      const q = testQuestions[qi];
      if (!q) return;
      if (!chapterBreakdown[q.chapterId]) {
        chapterBreakdown[q.chapterId] = { attempted: 0, correct: 0 };
      }
      chapterBreakdown[q.chapterId].attempted++;
      if (q.correctIndex === aIdx) {
        chapterBreakdown[q.chapterId].correct++;
      }
    });

    const result: TestResult = {
      id: testId,
      mode: testMode,
      score,
      totalQuestions,
      correctAnswers: Math.round((score / 100) * totalQuestions),
      timeTaken,
      passed: score >= 75,
      date: new Date().toISOString(),
      chapterBreakdown,
    };

    // Update profile
    const profile = loadProfile();
    const { total, breakdown: _breakdown } = calculateXPForTest(
      score,
      totalQuestions,
      timeTaken,
      testMode === 'full'
    );
    setXpEarned(total);

    profile.totalXP += total;
    profile.testsCompleted += 1;
    if (score >= 75) profile.testsPassed += 1;
    profile.totalQuestionsAnswered += answeredCount;
    profile.totalCorrect += result.correctAnswers;
    profile.averageScore =
      profile.testsCompleted > 0
        ? Math.round(
            ((profile.averageScore * (profile.testsCompleted - 1)) + score) /
              profile.testsCompleted
          )
        : score;
    if (score > profile.bestScore) profile.bestScore = score;
    if (profile.fastestTestTime === 0 || timeTaken < profile.fastestTestTime) {
      profile.fastestTestTime = timeTaken;
    }

    // Streak
    const { newStreak } = updateStreak(profile);
    profile.currentStreak = newStreak;
    if (newStreak > profile.longestStreak) profile.longestStreak = newStreak;
    profile.lastStudyDate = new Date().toISOString().split('T')[0];

    // Chapter progress
    Object.entries(chapterBreakdown).forEach(([chId, data]) => {
      const chIdx = profile.chapterProgress.findIndex(
        (c) => c.chapterId === parseInt(chId, 10)
      );
      if (chIdx >= 0) {
        profile.chapterProgress[chIdx].questionsAttempted += data.attempted;
        profile.chapterProgress[chIdx].questionsCorrect += data.correct;
      }
    });

    // Achievements
    const newAchievements = checkAchievements(profile);
    newAchievements.forEach((achId) => {
      profile.achievements.push(achId);
      profile.totalXP += XP_ACTIONS.unlockAchievement;
    });

    saveProfile(profile);
    saveTestResult(result);
    saveTestSession({
      id: testId,
      mode: (testMode === 'flashcards' ? 'chapter' : testMode) as 'quick' | 'full' | 'chapter' | 'marathon',
      questions: testQuestions,
      answers: state.answers,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      score,
      passed: score >= 75,
    });

    // Confetti on pass
    if (score >= 75) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#059669', '#F59E0B', '#FBBF24', '#EF4444'],
        });
        // Second burst after delay
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8, x: 0.3 },
            colors: ['#2563EB', '#059669', '#F59E0B'],
          });
        }, 400);
      }, 800);
    }

    // Animate score
    let current = 0;
    const step = Math.max(1, Math.round(score / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setAnimatedScore(current);
    }, 25);
  }, [calculateScore, state.answers, testQuestions, totalQuestions, testMode, testId, answeredCount]);

  const handleReview = useCallback(() => {
    setState((prev) => ({ ...prev, isReviewing: true, currentIndex: 0 }));
    setAnimatedScore(0);
  }, []);

  const handleRestart = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      timeRemaining: timeLimit,
      isSubmitted: false,
      isReviewing: false,
      score: 0,
    });
    setMarathon({
      lives: 3,
      streak: 0,
      score: 0,
      gameOver: false,
      difficulty: 'mixed',
    });
    setXpEarned(0);
    setAnimatedScore(0);
    setHasCheckedAnswer(false);
    setShowCorrectness({});
    startTimeRef.current = Date.now();
  }, [timeLimit]);

  /* --- early exits --- */
  if (!currentQuestion && !state.isSubmitted && !state.isReviewing) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-light-gray dark:bg-dark-slate">
        <p className="text-charcoal dark:text-gray-400">Loading test...</p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  RESULTS SCREEN                                                  */
  /* ---------------------------------------------------------------- */
  if (state.isSubmitted && !state.isReviewing) {
    const passed = state.score >= 75;
    const correctCount = Math.round((state.score / 100) * totalQuestions);
    const incorrectCount = answeredCount - correctCount;
    const unansweredCount = totalQuestions - answeredCount;
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const prevResults = loadTestResults();
    const prevAvg =
      prevResults.length > 1
        ? prevResults.slice(1).reduce((s, r) => s + r.score, 0) / (prevResults.length - 1)
        : 0;
    const diff = state.score - Math.round(prevAvg);

    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-light-gray px-4 py-8 dark:bg-dark-slate">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          className="w-full max-w-[560px] rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-[#334155] dark:bg-[#1E293B] md:p-12"
        >
          {/* Score Header */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider',
                passed
                  ? 'bg-success-green/10 text-success-green'
                  : 'bg-alert-red/10 text-alert-red'
              )}
            >
              {passed ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  PASSED
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Keep Practising
                </span>
              )}
            </motion.div>

            <div className="mt-6">
              <ProgressRing
                percentage={animatedScore}
                size={140}
                strokeWidth={10}
                color={passed ? '#059669' : '#DC2626'}
                label={`${correctCount}/${totalQuestions}`}
                sublabel="correct"
              />
            </div>

            {/* XP Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white warm-glow"
            >
              <Flame className="h-4 w-4" />
              +{xpEarned} XP
            </motion.div>
          </div>

          {/* Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="mt-8 space-y-3 rounded-2xl bg-gray-50 p-5 dark:bg-[#0F172A]"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal dark:text-gray-400">Time taken</span>
              <span className="font-mono font-medium text-dark-slate dark:text-white">
                {formatTime(timeTaken)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal dark:text-gray-400">Correct</span>
              <span className="font-medium text-success-green">{correctCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal dark:text-gray-400">Incorrect</span>
              <span className="font-medium text-alert-red">{incorrectCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal dark:text-gray-400">Unanswered</span>
                <span className="font-medium text-charcoal dark:text-gray-300">{unansweredCount}</span>
              </div>
            )}
            {prevAvg > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal dark:text-gray-400">vs. Your average</span>
                <span
                  className={cn(
                    'flex items-center gap-1 font-medium',
                    diff >= 0 ? 'text-success-green' : 'text-alert-red'
                  )}
                >
                  {diff >= 0 ? '+' : ''}{diff}% {diff >= 0 ? 'above' : 'below'}
                </span>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.4 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={handleReview}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-royal-blue py-3 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white active:scale-95"
            >
              <Eye className="h-4 w-4" />
              Review Answers
            </button>
            <button
              onClick={handleRestart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-100 py-3 text-sm font-semibold text-charcoal transition-all hover:bg-gray-200 active:scale-95 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#475569]"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-royal-blue py-3 text-sm font-semibold text-white transition-all hover:shadow-glow-blue hover:brightness-110 active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
              Next Test
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  MARATHON GAME OVER                                              */
  /* ---------------------------------------------------------------- */
  if (testMode === 'marathon' && marathon.gameOver) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-light-gray px-4 dark:bg-dark-slate">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="w-full max-w-[480px] rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-[#334155] dark:bg-[#1E293B]"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Trophy className="mx-auto h-16 w-16 text-accent-amber" />
            </motion.div>
            <h2 className="mt-4 font-display text-2xl font-bold text-dark-slate dark:text-white">
              Game Over!
            </h2>
            <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
              You answered {marathon.score} questions correctly in a row!
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-[#0F172A]">
            <div className="text-center">
              <div className="font-mono text-xl font-bold text-dark-slate dark:text-white">
                {marathon.score}
              </div>
              <div className="text-[10px] text-charcoal dark:text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-xl font-bold text-accent-amber">{marathon.streak}</div>
              <div className="text-[10px] text-charcoal dark:text-gray-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-xl font-bold text-success-green">
                {state.currentIndex}
              </div>
              <div className="text-[10px] text-charcoal dark:text-gray-400">Questions</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRestart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-royal-blue py-3 text-sm font-semibold text-white transition-all hover:shadow-glow-blue active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-gray-200 py-3 text-sm font-semibold text-charcoal transition-all hover:bg-gray-50 active:scale-95 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#334155]"
            >
              Back to Practice
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  MAIN TEST UI                                                    */
  /* ---------------------------------------------------------------- */

  const chapter = CHAPTERS.find((c) => c.id === currentQuestion?.chapterId);
  const selectedAnswer = state.answers[state.currentIndex];
  const isFlagged = state.flagged.has(state.currentIndex);
  const shouldShowCorrectness =
    state.isReviewing || showCorrectness[state.currentIndex] || (testMode === 'marathon' && selectedAnswer !== undefined);

  return (
    <div className="flex h-[100dvh] flex-col bg-light-gray dark:bg-dark-slate">
      {/* ---- Minimal Navbar ---- */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-[#334155] dark:bg-[#1E293B]"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (Object.keys(state.answers).length > 0 && !state.isSubmitted && !state.isReviewing) {
                setShowQuitModal(true);
              } else {
                navigate('/practice');
              }
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-charcoal transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Quit</span>
          </button>
          <span className="text-xs font-medium text-dark-slate dark:text-white">
            {testTitle}
          </span>
        </div>

        {/* Timer */}
        {timeLimit > 0 && !state.isReviewing && (
          <div
            className={cn(
              'flex items-center gap-1.5 font-mono text-sm font-medium',
              timerIsCritical && 'animate-timer-pulse text-alert-red',
              timerIsWarning && !timerIsCritical && 'animate-timer-pulse text-accent-amber',
              !timerIsWarning && !timerIsCritical && 'text-dark-slate dark:text-gray-200'
            )}
          >
            <Clock className="h-3.5 w-3.5" style={{ color: timerColor }} />
            <span style={{ color: timerIsCritical || timerIsWarning ? undefined : timerColor }}>
              {formatTime(state.timeRemaining)}
            </span>
          </div>
        )}

        {state.isReviewing && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-royal-blue">
            <Eye className="h-3.5 w-3.5" />
            Review Mode
          </span>
        )}

        {/* Marathon stats */}
        {testMode === 'marathon' && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-medium text-accent-amber">
              <Flame className="h-3.5 w-3.5" />
              {marathon.streak}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={cn(
                    'h-4 w-4 transition-colors',
                    h <= marathon.lives ? 'fill-alert-red text-alert-red' : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ---- Main Content ---- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-12 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="mx-auto max-w-[720px]"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-charcoal dark:text-gray-400">
                  Question{' '}
                  <span className="text-royal-blue">
                    {testMode === 'marathon' ? state.currentIndex + 1 : `${state.currentIndex + 1} of ${totalQuestions}`}
                  </span>
                </span>
                {chapter && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${chapter.color} 15%, transparent)`,
                      color: chapter.color,
                    }}
                  >
                    Ch {chapter.id}: {chapter.shortName}
                  </span>
                )}
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${getDifficultyColor(currentQuestion.difficulty)} 15%, transparent)`,
                    color: getDifficultyColor(currentQuestion.difficulty),
                  }}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Card */}
              <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-[#334155] dark:bg-[#1E293B] md:p-10">
                {/* Topic Visual */}
                <QuestionVisual question={currentQuestion}>
                  <div className="flex-1">
                    <h2 className="max-w-[600px] font-display text-xl font-semibold leading-relaxed text-dark-slate dark:text-white md:text-2xl">
                      {currentQuestion.text}
                    </h2>
                  </div>
                </QuestionVisual>

                {/* Answer Options */}
                <div className="mt-6 space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === currentQuestion.correctIndex;
                    const showCorrect = shouldShowCorrectness;

                    let borderColor = 'border-gray-200 dark:border-[#475569]';
                    let bgColor = 'bg-transparent';
                    let hoverClasses =
                      'hover:border-royal-blue hover:bg-[rgba(37,99,235,0.03)] dark:hover:bg-[rgba(37,99,235,0.05)]';
                    let radioBorder = 'border-gray-300 dark:border-gray-500';
                    let radioFill = 'bg-transparent';
                    let radioIcon = null;

                    if (showCorrect) {
                      if (isCorrect) {
                        borderColor = 'border-success-green';
                        bgColor = 'bg-[rgba(5,150,105,0.06)]';
                        hoverClasses = '';
                        radioBorder = 'border-success-green';
                        radioFill = 'bg-success-green';
                        radioIcon = <CheckCircle2 className="h-3 w-3 text-white" />;
                      } else if (isSelected && !isCorrect) {
                        borderColor = 'border-alert-red';
                        bgColor = 'bg-[rgba(220,38,38,0.06)]';
                        hoverClasses = '';
                        radioBorder = 'border-alert-red';
                        radioFill = 'bg-alert-red';
                        radioIcon = <X className="h-3 w-3 text-white" />;
                      } else {
                        borderColor = 'border-gray-100 dark:border-[#334155]';
                        bgColor = 'bg-gray-50/50 dark:bg-white/[0.02]';
                        hoverClasses = '';
                        radioBorder = 'border-gray-200 dark:border-[#475569]';
                      }
                    } else if (isSelected) {
                      borderColor = 'border-royal-blue';
                      bgColor = 'bg-[rgba(37,99,235,0.06)]';
                      hoverClasses = '';
                      radioBorder = 'border-royal-blue';
                      radioFill = 'bg-royal-blue';
                      radioIcon = <CheckCircle2 className="h-3 w-3 text-white" />;
                    }

                    return (
                      <motion.button
                        key={optIdx}
                        onClick={() => handleAnswer(optIdx)}
                        disabled={showCorrect && testMode !== 'marathon'}
                        whileHover={!showCorrect ? { x: 4 } : {}}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          'flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-150',
                          borderColor,
                          bgColor,
                          hoverClasses,
                          'disabled:cursor-default'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                            radioBorder,
                            radioFill
                          )}
                        >
                          {radioIcon}
                        </span>
                        <span className="text-sm font-medium text-dark-slate dark:text-gray-100 md:text-base">
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={state.currentIndex === 0}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium transition-all',
                        state.currentIndex === 0
                          ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                          : 'text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleFlag}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-medium transition-all',
                        isFlagged
                          ? 'bg-accent-amber/10 text-accent-amber'
                          : 'text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                      )}
                    >
                      <Flag className={cn('h-4 w-4', isFlagged && 'fill-accent-amber')} />
                      {isFlagged ? 'Flagged' : 'Flag'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {(testMode === 'quick' || testMode === 'chapter') && !state.isReviewing && !hasCheckedAnswer && selectedAnswer !== undefined && (
                      <button
                        onClick={handleCheckAnswer}
                        className="flex items-center gap-1.5 rounded-full border-2 border-royal-blue px-5 py-2.5 text-xs font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white active:scale-95"
                      >
                        Check Answer
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={state.currentIndex >= totalQuestions - 1}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold transition-all active:scale-95',
                        state.currentIndex >= totalQuestions - 1
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-[#334155] dark:text-gray-500'
                          : 'bg-royal-blue text-white hover:shadow-glow-blue hover:brightness-110'
                      )}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Explanation (Review Mode) */}
              {state.isReviewing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 rounded-xl border-l-4 border-royal-blue bg-[rgba(37,99,235,0.05)] p-5 dark:bg-[rgba(37,99,235,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-royal-blue">
                    Why this is correct:
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-slate dark:text-gray-200">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {/* Show explanation after check in quick/chapter mode */}
              {hasCheckedAnswer && !state.isReviewing && (testMode === 'quick' || testMode === 'chapter') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border-l-4 border-royal-blue bg-[rgba(37,99,235,0.05)] p-5 dark:bg-[rgba(37,99,235,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-royal-blue">
                    Explanation:
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-slate dark:text-gray-200">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---- Navigation Sidebar (Desktop) ---- */}
        <div className="hidden w-[280px] flex-shrink-0 border-l border-gray-200 bg-white dark:border-[#334155] dark:bg-[#1E293B] lg:flex lg:flex-col">
          {/* Progress */}
          <div className="border-b border-gray-100 p-5 dark:border-[#334155]">
            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#334155]">
              <div
                className="h-full rounded-full bg-royal-blue transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-charcoal dark:text-gray-400">
              <span>
                {answeredCount} of {totalQuestions} answered
              </span>
              {testMode === 'marathon' && (
                <span className="text-accent-amber">{marathon.score} pts</span>
              )}
            </div>
          </div>

          {/* Question Grid */}
          <div className="flex-1 overflow-y-auto p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal dark:text-gray-400">
              Questions
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {testQuestions.map((q, idx) => {
                const isAnswered = state.answers[idx] !== undefined;
                const isCurrent = idx === state.currentIndex;
                const isFlagged = state.flagged.has(idx);
                const wasCorrect =
                  state.isReviewing && state.answers[idx] === q.correctIndex;
                const wasIncorrect =
                  state.isReviewing && state.answers[idx] !== undefined && state.answers[idx] !== q.correctIndex;

                let btnClasses = 'bg-gray-100 text-charcoal dark:bg-[#0F172A] dark:text-gray-400';
                if (wasCorrect) btnClasses = 'bg-success-green text-white';
                else if (wasIncorrect) btnClasses = 'bg-alert-red text-white';
                else if (isCurrent) btnClasses = 'bg-royal-blue text-white ring-2 ring-royal-blue ring-offset-2 dark:ring-offset-[#1E293B]';
                else if (isAnswered) btnClasses = 'bg-royal-blue/20 text-royal-blue dark:bg-royal-blue/30 dark:text-blue-300';

                return (
                  <button
                    key={idx}
                    onClick={() => handleJump(idx)}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-transform hover:scale-110',
                      btnClasses
                    )}
                  >
                    {idx + 1}
                    {isFlagged && !state.isReviewing && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-amber" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-100 p-5 dark:border-[#334155]">
            <button
              onClick={() => {
                if (state.flagged.size > 0) {
                  handleJump(Array.from(state.flagged)[0]);
                }
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-charcoal transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Flag className="h-3.5 w-3.5" />
              Flagged ({state.flagged.size})
            </button>
            {!state.isReviewing && (
              <button
                onClick={() => setShowFinishModal(true)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-royal-blue py-2.5 text-xs font-semibold text-white transition-all hover:shadow-glow-blue hover:brightness-110 active:scale-95"
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                Finish Test
              </button>
            )}
          </div>
        </div>

        {/* ---- Mobile Bottom Nav ---- */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 dark:border-[#334155] dark:bg-[#1E293B] lg:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-charcoal dark:text-gray-300"
          >
            <BarChart3 className="h-4 w-4" />
            Questions
          </button>
          <div className="flex items-center gap-1 text-xs text-charcoal dark:text-gray-400">
            <span className="text-royal-blue font-semibold">{state.currentIndex + 1}</span>
            <span>/</span>
            <span>{totalQuestions}</span>
          </div>
          {!state.isReviewing ? (
            <button
              onClick={() => setShowFinishModal(true)}
              className="rounded-full bg-royal-blue px-4 py-2 text-xs font-semibold text-white"
            >
              Finish
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>

      {/* ---- Mobile Sidebar Drawer ---- */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/40"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[210] rounded-t-3xl bg-white p-6 dark:bg-[#1E293B]"
              style={{ maxHeight: '60vh' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-dark-slate dark:text-white">
                  Questions
                </span>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="rounded-lg p-1 text-charcoal dark:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-8 gap-2 overflow-y-auto" style={{ maxHeight: '40vh' }}>
                {testQuestions.map((q, idx) => {
                  const isAnswered = state.answers[idx] !== undefined;
                  const isCurrent = idx === state.currentIndex;
                  const isFlagged = state.flagged.has(idx);
                  const wasCorrect = state.isReviewing && state.answers[idx] === q.correctIndex;
                  const wasIncorrect =
                    state.isReviewing && state.answers[idx] !== undefined && state.answers[idx] !== q.correctIndex;

                  let btnClasses = 'bg-gray-100 text-charcoal dark:bg-[#0F172A] dark:text-gray-400';
                  if (wasCorrect) btnClasses = 'bg-success-green text-white';
                  else if (wasIncorrect) btnClasses = 'bg-alert-red text-white';
                  else if (isCurrent) btnClasses = 'bg-royal-blue text-white ring-2 ring-royal-blue';
                  else if (isAnswered) btnClasses = 'bg-royal-blue/20 text-royal-blue';

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        handleJump(idx);
                        setShowSidebar(false);
                      }}
                      className={cn(
                        'relative flex h-11 items-center justify-center rounded-lg text-sm font-semibold',
                        btnClasses
                      )}
                    >
                      {idx + 1}
                      {isFlagged && !state.isReviewing && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-amber" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---- Quit Confirmation Modal ---- */}
      <AnimatePresence>
        {showQuitModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[rgba(15,23,42,0.6)] backdrop-blur-sm"
              onClick={() => setShowQuitModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-[400px] rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1E293B]"
            >
              <h3 className="text-lg font-semibold text-dark-slate dark:text-white">
                Quit Test?
              </h3>
              <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                Are you sure you want to quit? Your progress will not be saved.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowQuitModal(false)}
                  className="flex-1 rounded-full bg-royal-blue py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                >
                  Keep Going
                </button>
                <button
                  onClick={() => navigate('/practice')}
                  className="flex-1 rounded-full border-2 border-alert-red py-2.5 text-sm font-semibold text-alert-red transition-all hover:bg-alert-red hover:text-white active:scale-95"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---- Finish Test Modal ---- */}
      <AnimatePresence>
        {showFinishModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[rgba(15,23,42,0.6)] backdrop-blur-sm"
              onClick={() => setShowFinishModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-[400px] rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1E293B]"
            >
              <h3 className="text-lg font-semibold text-dark-slate dark:text-white">
                Finish Test?
              </h3>
              <p className="mt-2 text-sm text-charcoal dark:text-gray-400">
                You have answered {answeredCount} of {totalQuestions} questions.
                {totalQuestions - answeredCount > 0 && ' Are you ready to finish?'}
              </p>
              {totalQuestions - answeredCount > 0 && (
                <p className="mt-2 text-xs font-medium text-alert-red">
                  You have {totalQuestions - answeredCount} unanswered questions!
                </p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 rounded-full border-2 border-gray-200 py-2.5 text-sm font-semibold text-charcoal transition-all hover:bg-gray-50 active:scale-95 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#334155]"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-full bg-royal-blue py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                >
                  Finish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
