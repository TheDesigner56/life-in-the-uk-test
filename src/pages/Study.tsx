import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Layers,
  ClipboardCheck,
  ChevronDown,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHAPTERS } from '@/data/questions';
import { chapterContents } from '@/data/chapterContent';
import { CHAPTER_COLORS, getTopicIcon } from '@/components/TopicIcon';
import { loadProfile } from '@/lib/storage';
import Layout from '@/components/Layout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function Study() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const profile = loadProfile();
    const prog: Record<number, number> = {};
    profile.chapterProgress.forEach((cp) => {
      const pct =
        cp.questionsAttempted > 0
          ? Math.round((cp.questionsCorrect / cp.questionsAttempted) * 100)
          : 0;
      prog[cp.chapterId] = pct;
    });
    setProgress(prog);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const studiedCount = Object.values(progress).filter((p) => p > 0).length;

  return (
    <Layout>
      <div className="mx-auto max-w-[1320px] px-4 py-24 md:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-royal-blue">
            STUDY MATERIALS
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-2xl font-semibold text-dark-slate dark:text-white md:text-[2rem]">
                Master the Handbook
              </h1>
              <p className="mt-1 text-charcoal dark:text-gray-400">
                Comprehensive summaries, flashcards, and key facts from the official Life in the UK handbook.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-royal-blue"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(studiedCount / 5) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                />
              </div>
              <span className="text-sm text-charcoal dark:text-gray-400">
                {studiedCount} of 5 studied
              </span>
            </div>
          </div>
        </motion.div>

        {/* Chapter Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {CHAPTERS.map((chapter) => {
            const isExpanded = expandedId === chapter.id;
            const chapterData = chapterContents.find((c) => c.id === chapter.id);
            const keyFactCount = chapterData?.keyFacts.length ?? 0;
            const flashcardCount = chapterData?.flashcards.length ?? 0;
            const prog = progress[chapter.id] ?? 0;

            return (
              <motion.div
                key={chapter.id}
                variants={cardVariants}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 dark:border-[#334155] dark:bg-[#1E293B]',
                  isExpanded ? 'shadow-lg' : 'hover:shadow-md'
                )}
              >
                {/* Collapsed State */}
                <div
                  className="flex cursor-pointer items-center gap-4 p-5 md:p-6"
                  onClick={() => toggleExpand(chapter.id)}
                >
                  {/* Chapter Icon */}
                  {(() => {
                    const colors = CHAPTER_COLORS[chapter.id] || CHAPTER_COLORS[1];
                    const Icon = getTopicIcon({ chapterId: chapter.id, text: chapter.shortName } as any);
                    return (
                      <div className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border md:flex`}>
                        <Icon className={`h-7 w-7 ${colors.text}`} />
                      </div>
                    );
                  })()}

                  {/* Chapter Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-xs font-medium"
                      style={{ color: chapter.color }}
                    >
                      Chapter {chapter.id}
                    </p>
                    <h2 className="mt-0.5 font-display text-lg font-semibold text-dark-slate dark:text-white md:text-xl">
                      {chapter.name}
                    </h2>
                    <p className="mt-1 text-xs text-charcoal dark:text-gray-400">
                      {keyFactCount} key facts &middot; {flashcardCount} flashcards
                    </p>
                  </div>

                  {/* Progress Ring */}
                  <div className="hidden items-center gap-3 md:flex">
                    <div className="relative h-12 w-12">
                      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke={chapter.color}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(prog / 100) * 125.6} 125.6`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-dark-slate dark:text-white">
                        {prog}%
                      </span>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-charcoal dark:text-gray-400" />
                  </motion.div>
                </div>

                {/* Expanded State */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-5 pb-6 pt-4 dark:border-[#334155] md:px-6 md:pl-[3.25rem]">
                        {/* Description */}
                        <p className="mb-4 text-sm leading-relaxed text-charcoal dark:text-gray-300">
                          {chapterData?.description}
                        </p>

                        {/* Section Titles */}
                        {chapterData && chapterData.sections.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {chapterData.sections.map((section) => (
                              <span
                                key={section.title}
                                className="rounded-full px-3 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: `${chapter.color}15`,
                                  color: chapter.color,
                                }}
                              >
                                {section.title}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mb-5">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-charcoal dark:text-gray-400">
                              Your progress
                            </span>
                            <span className="text-xs font-semibold" style={{ color: chapter.color }}>
                              {prog}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: chapter.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${prog}%` }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/study/${chapter.id}`);
                            }}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                              'bg-transparent text-charcoal hover:bg-royal-blue/10 hover:text-royal-blue',
                              'dark:text-gray-300 dark:hover:text-white'
                            )}
                          >
                            <BookOpen className="h-4 w-4" />
                            Study
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/study/${chapter.id}?tab=flashcards`);
                            }}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                              'bg-transparent text-charcoal hover:bg-royal-blue/10 hover:text-royal-blue',
                              'dark:text-gray-300 dark:hover:text-white'
                            )}
                          >
                            <Layers className="h-4 w-4" />
                            Flashcards
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/test/chapter/${chapter.id}`);
                            }}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200',
                              'hover:shadow-glow-blue hover:brightness-110'
                            )}
                            style={{ backgroundColor: chapter.color }}
                          >
                            <ClipboardCheck className="h-4 w-4" />
                            Take Test
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom spacer */}
        <div className="mt-12 rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-[#334155]">
          <Star className="mx-auto h-8 w-8 text-accent-amber" />
          <h3 className="mt-3 font-display text-lg font-semibold text-dark-slate dark:text-white">
            Study Tip
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-charcoal dark:text-gray-400">
            Expand each chapter to study the summary, then test yourself with flashcards.
            When you feel confident, take the chapter test to track your progress.
          </p>
        </div>
      </div>
    </Layout>
  );
}
