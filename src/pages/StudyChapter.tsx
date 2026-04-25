import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Check,
  HelpCircle,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHAPTERS } from '@/data/questions';
import { getChapterContent } from '@/data/chapterContent';
import { ChapterHeaderVisual } from '@/components/TopicIcon';
import Layout from '@/components/Layout';

type TabType = 'summary' | 'flashcards' | 'keyfacts';

export default function StudyChapter() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = parseInt(chapterId ?? '1', 10);
  const chapter = CHAPTERS.find((c) => c.id === id);
  const content = getChapterContent(id);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'flashcards') return 'flashcards';
    return 'summary';
  });

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatus, setCardStatus] = useState<Record<number, 'known' | 'learning' | undefined>>({});
  const [showComplete, setShowComplete] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const flashcardRef = useRef<HTMLDivElement>(null);

  const flashcards = content?.flashcards ?? [];
  const cardOrder = shuffleMode ? shuffledIndices : flashcards.map((_, i) => i);
  const currentCard = cardOrder[currentCardIndex] !== undefined ? flashcards[cardOrder[currentCardIndex]] : null;

  const goNext = useCallback(() => {
    if (currentCardIndex < cardOrder.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex((prev) => prev + 1), 150);
    } else if (Object.keys(cardStatus).length === flashcards.length) {
      setShowComplete(true);
    }
  }, [currentCardIndex, cardOrder.length, flashcards.length, cardStatus]);

  const goPrev = useCallback(() => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex((prev) => prev - 1), 150);
    }
  }, [currentCardIndex]);

  const shuffleCards = useCallback(() => {
    const indices = flashcards.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    setShuffleMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  const markKnown = useCallback(() => {
    if (!currentCard) return;
    const actualIndex = cardOrder[currentCardIndex];
    setCardStatus((prev) => ({ ...prev, [actualIndex]: 'known' }));
    goNext();
  }, [currentCard, cardOrder, currentCardIndex, goNext]);

  const markLearning = useCallback(() => {
    if (!currentCard) return;
    const actualIndex = cardOrder[currentCardIndex];
    setCardStatus((prev) => ({ ...prev, [actualIndex]: 'learning' }));
    goNext();
  }, [currentCard, cardOrder, currentCardIndex, goNext]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'flashcards' || showComplete) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'k' || e.key === 'K') {
        markKnown();
      } else if (e.key === 'l' || e.key === 'L') {
        markLearning();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, showComplete, goNext, goPrev, markKnown, markLearning]);

  // Celebration on complete
  useEffect(() => {
    if (showComplete) {
      const known = Object.values(cardStatus).filter((s) => s === 'known').length;
      if (known === flashcards.length) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#059669', '#F59E0B', '#FBBF24', '#EF4444'],
        });
      }
    }
  }, [showComplete, cardStatus, flashcards.length]);

  if (!chapter || !content) {
    return (
      <Layout>
        <div className="mx-auto max-w-[1320px] px-4 py-32 text-center md:px-6">
          <h1 className="font-display text-2xl font-bold text-dark-slate dark:text-white">
            Chapter not found
          </h1>
          <button
            onClick={() => navigate('/study')}
            className="mt-4 text-royal-blue underline"
          >
            Back to Study Materials
          </button>
        </div>
      </Layout>
    );
  }

  const knownCount = Object.values(cardStatus).filter((s) => s === 'known').length;
  const learningCount = Object.values(cardStatus).filter((s) => s === 'learning').length;

  return (
    <Layout>
      <div className="mx-auto max-w-[1320px] px-4 py-24 md:px-6 lg:px-8">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <button
            onClick={() => navigate('/study')}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal transition-colors hover:text-royal-blue dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Study Materials
          </button>

          <ChapterHeaderVisual
            chapterId={chapter.id}
            title={`Chapter ${chapter.id}: ${chapter.name}`}
            subtitle={content.description}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 flex items-center gap-1 rounded-xl border border-gray-100 bg-white p-1 dark:border-[#334155] dark:bg-[#1E293B]"
        >
          {[
            { key: 'summary' as TabType, label: 'Summary' },
            { key: 'keyfacts' as TabType, label: 'Key Facts' },
            { key: 'flashcards' as TabType, label: 'Flashcards' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setShowComplete(false);
              }}
              className={cn(
                'relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-royal-blue text-white shadow-md'
                  : 'text-charcoal hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              {content.sections.map((section, si) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]"
                >
                  <h3
                    className="mb-3 font-display text-lg font-semibold"
                    style={{ color: chapter.color }}
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.content.map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="text-sm leading-relaxed text-charcoal dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="inline-flex items-center gap-2 rounded-full bg-royal-blue px-6 py-3 text-sm font-semibold text-white shadow-glow-blue transition-all hover:brightness-110"
                >
                  <RotateCw className="h-4 w-4" />
                  Study Flashcards
                </button>
                <button
                  onClick={() => navigate(`/test/chapter/${chapter.id}`)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-royal-blue px-6 py-3 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white dark:border-royal-blue dark:text-royal-blue"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Take Chapter Test
                </button>
              </div>
            </motion.div>
          )}

          {/* Key Facts Tab */}
          {activeTab === 'keyfacts' && (
            <motion.div
              key="keyfacts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {content.keyFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1E293B]"
                    style={{ borderLeft: `4px solid ${chapter.color}` }}
                  >
                    <p className="text-sm font-semibold text-dark-slate dark:text-white">
                      Q: {fact.question}
                    </p>
                    <p className="mt-1.5 text-sm text-charcoal dark:text-gray-400">
                      A: {fact.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {!showComplete ? (
                <>
                  {/* Progress */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal dark:text-gray-400">
                      Card {currentCardIndex + 1} of {flashcards.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success-green">{knownCount} known</span>
                      <span className="text-xs text-accent-amber">{learningCount} learning</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: chapter.color }}
                      animate={{
                        width: `${((currentCardIndex) / flashcards.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Flashcard */}
                  <div className="mx-auto max-w-[640px]" style={{ perspective: '1000px' }}>
                    <div
                      ref={flashcardRef}
                      onClick={() => setIsFlipped((prev) => !prev)}
                      className="relative cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Front */}
                        <div
                          className={cn(
                            'flex min-h-[360px] items-center justify-center rounded-3xl border-2 border-gray-100 bg-white p-8 shadow-xl dark:border-[#334155] dark:bg-[#1E293B]'
                          )}
                          style={{
                            borderTop: `4px solid ${chapter.color}`,
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          <div className="text-center">
                            <p
                              className="mb-4 text-xs font-medium uppercase tracking-wider"
                              style={{ color: chapter.color }}
                            >
                              Question
                            </p>
                            <p className="font-display text-xl font-semibold text-dark-slate dark:text-white md:text-2xl">
                              {currentCard?.front}
                            </p>
                            <p className="mt-6 text-xs text-gray-400">
                              Tap or press Space to flip
                            </p>
                          </div>
                        </div>

                        {/* Back */}
                        <div
                          className={cn(
                            'absolute inset-0 flex min-h-[360px] items-center justify-center rounded-3xl border-2 border-gray-100 bg-white p-8 shadow-xl dark:border-[#334155] dark:bg-[#1E293B]'
                          )}
                          style={{
                            borderTop: `4px solid ${chapter.color}`,
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <div className="text-center">
                            <p
                              className="mb-4 text-xs font-medium uppercase tracking-wider"
                              style={{ color: chapter.color }}
                            >
                              Answer
                            </p>
                            <p className="text-lg leading-relaxed text-charcoal dark:text-gray-300">
                              {currentCard?.back}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="mx-auto mt-8 max-w-[640px]">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={goPrev}
                        disabled={currentCardIndex === 0}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all',
                          currentCardIndex === 0
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                            : 'bg-transparent text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>

                      <button
                        onClick={() => setIsFlipped((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-royal-blue px-5 py-2.5 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white"
                      >
                        <RotateCw className="h-4 w-4" />
                        Flip
                      </button>

                      <button
                        onClick={shuffleCards}
                        className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-4 py-2.5 text-sm font-medium text-charcoal transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <Sparkles className="h-4 w-4" />
                        Shuffle
                      </button>

                      <button
                        onClick={markKnown}
                        className="inline-flex items-center gap-1.5 rounded-full bg-success-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                      >
                        <Check className="h-4 w-4" />
                        Known
                      </button>

                      <button
                        onClick={markLearning}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent-amber px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Learning
                      </button>

                      <button
                        onClick={goNext}
                        disabled={currentCardIndex >= cardOrder.length - 1}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all',
                          currentCardIndex >= cardOrder.length - 1
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                            : 'bg-transparent text-charcoal hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                        )}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Segment progress */}
                    <div className="mt-4 flex gap-1">
                      {flashcards.map((_, i) => {
                        const status = cardStatus[i];
                        return (
                          <div
                            key={i}
                            className={cn(
                              'h-1 flex-1 rounded-full transition-colors',
                              status === 'known'
                                ? 'bg-success-green'
                                : status === 'learning'
                                  ? 'bg-accent-amber/50'
                                  : i === cardOrder[currentCardIndex]
                                    ? 'bg-gray-400'
                                    : 'bg-gray-100 dark:bg-gray-700'
                            )}
                          />
                        );
                      })}
                    </div>

                    {/* Keyboard shortcuts hint */}
                    <p className="mt-4 text-center text-xs text-gray-400">
                      Space/Enter: Flip &middot; Arrow keys: Navigate &middot; K: Known &middot; L: Learning
                    </p>
                  </div>
                </>
              ) : (
                /* Completion Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto max-w-[480px] rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl dark:border-[#334155] dark:bg-[#1E293B]"
                >
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${chapter.color}15` }}
                  >
                    <Sparkles className="h-8 w-8" style={{ color: chapter.color }} />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-dark-slate dark:text-white">
                    Deck Complete!
                  </h2>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-success-green/10 px-4 py-3">
                      <span className="text-sm font-medium text-success-green">Known</span>
                      <span className="text-sm font-bold text-success-green">{knownCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-accent-amber/10 px-4 py-3">
                      <span className="text-sm font-medium text-accent-amber">Learning</span>
                      <span className="text-sm font-bold text-accent-amber">{learningCount}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {learningCount > 0 && (
                      <button
                        onClick={() => {
                          const learningIndices = Object.entries(cardStatus)
                            .filter(([, s]) => s === 'learning')
                            .map(([i]) => parseInt(i));
                          setShuffledIndices(learningIndices);
                          setShuffleMode(true);
                          setCurrentCardIndex(0);
                          setIsFlipped(false);
                          setShowComplete(false);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-royal-blue px-6 py-3 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue hover:text-white"
                      >
                        Review Learning Cards
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentCardIndex(0);
                        setIsFlipped(false);
                        setCardStatus({});
                        setShowComplete(false);
                        setShuffleMode(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-6 py-3 text-sm font-medium text-charcoal transition-all hover:bg-gray-100 dark:text-gray-300"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={() => navigate(`/study/${chapter.id}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-6 py-3 text-sm font-medium text-charcoal transition-all hover:bg-gray-100 dark:text-gray-300"
                    >
                      Back to Chapter
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
