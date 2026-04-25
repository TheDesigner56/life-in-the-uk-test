/**
 * Hormozi-Style Freemium Tier System
 * Free = Hook | Pro = Painkiller (£19) | Ultimate = Dream (£39)
 */

export type UserTier = 'free' | 'pro' | 'ultimate';

export interface TierLimits {
  maxPracticeTests: number;
  maxMockExams: number;
  maxFlashcardsPerSession: number;
  unlockedChapters: number[];
  studyModes: string[];
  analyticsLevel: 'none' | 'basic' | 'full';
  aiRecommendations: boolean;
  leaderboardParticipation: boolean;
  reviewMode: boolean;
  printableCheatSheet: boolean;
}

export const TIER_CONFIG: Record<UserTier, TierLimits> = {
  free: {
    maxPracticeTests: 3,
    maxMockExams: 1,
    maxFlashcardsPerSession: 10,
    unlockedChapters: [1, 2],
    studyModes: ['quick-fire', 'mock'],
    analyticsLevel: 'none',
    aiRecommendations: false,
    leaderboardParticipation: false,
    reviewMode: false,
    printableCheatSheet: false,
  },
  pro: {
    maxPracticeTests: Infinity,
    maxMockExams: Infinity,
    maxFlashcardsPerSession: Infinity,
    unlockedChapters: [1, 2, 3, 4, 5],
    studyModes: ['quick-fire', 'mock', 'chapter', 'flashcards', 'marathon'],
    analyticsLevel: 'full',
    aiRecommendations: true,
    leaderboardParticipation: true,
    reviewMode: true,
    printableCheatSheet: false,
  },
  ultimate: {
    maxPracticeTests: Infinity,
    maxMockExams: Infinity,
    maxFlashcardsPerSession: Infinity,
    unlockedChapters: [1, 2, 3, 4, 5],
    studyModes: ['quick-fire', 'mock', 'chapter', 'flashcards', 'marathon'],
    analyticsLevel: 'full',
    aiRecommendations: true,
    leaderboardParticipation: true,
    reviewMode: true,
    printableCheatSheet: true,
  },
};

export const TIER_PRICES: Record<UserTier, { price: number; label: string; description: string }> = {
  free: { price: 0, label: 'Free', description: 'Get started' },
  pro: { price: 19, label: 'Pro', description: 'Pass guarantee' },
  ultimate: { price: 39, label: 'Ultimate', description: 'Full confidence' },
};

// User state stored in localStorage
export interface TierState {
  tier: UserTier;
  practiceTestsUsed: number;
  mockExamsUsed: number;
  flashcardsUsed: number;
  upgradedAt?: string;
}

const TIER_KEY = 'lituk_v4_tier';

export function getDefaultTierState(): TierState {
  return {
    tier: 'free',
    practiceTestsUsed: 0,
    mockExamsUsed: 0,
    flashcardsUsed: 0,
  };
}

export function loadTierState(): TierState {
  try {
    const raw = localStorage.getItem(TIER_KEY);
    if (raw) return { ...getDefaultTierState(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return getDefaultTierState();
}

export function saveTierState(state: TierState) {
  localStorage.setItem(TIER_KEY, JSON.stringify(state));
}

export function upgradeTier(tier: UserTier) {
  const state = loadTierState();
  state.tier = tier;
  state.upgradedAt = new Date().toISOString();
  saveTierState(state);
}

export function resetTier() {
  localStorage.removeItem(TIER_KEY);
}

export function getCurrentTier(): UserTier {
  return loadTierState().tier;
}

export function getLimits(): TierLimits {
  return TIER_CONFIG[getCurrentTier()];
}

export function canAccessFeature(feature: keyof TierLimits): boolean {
  const limits = getLimits();
  const val = limits[feature];
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val > 0;
  if (Array.isArray(val)) return val.length > 0;
  return !!val;
}

export function canTakePracticeTest(): boolean {
  const state = loadTierState();
  const limits = TIER_CONFIG[state.tier];
  return state.practiceTestsUsed < limits.maxPracticeTests;
}

export function canTakeMockExam(): boolean {
  const state = loadTierState();
  const limits = TIER_CONFIG[state.tier];
  return state.mockExamsUsed < limits.maxMockExams;
}

export function canUseFlashcards(count: number): boolean {
  const state = loadTierState();
  const limits = TIER_CONFIG[state.tier];
  return count < limits.maxFlashcardsPerSession;
}

export function canAccessChapter(chapterId: number): boolean {
  const limits = getLimits();
  return limits.unlockedChapters.includes(chapterId);
}

export function canUseStudyMode(mode: string): boolean {
  const limits = getLimits();
  return limits.studyModes.includes(mode);
}

export function usePracticeTest() {
  const state = loadTierState();
  state.practiceTestsUsed++;
  saveTierState(state);
}

export function useMockExam() {
  const state = loadTierState();
  state.mockExamsUsed++;
  saveTierState(state);
}

export function getTestsRemaining(): { practice: number; mock: number } {
  const state = loadTierState();
  const limits = TIER_CONFIG[state.tier];
  return {
    practice: Math.max(0, limits.maxPracticeTests - state.practiceTestsUsed),
    mock: Math.max(0, limits.maxMockExams - state.mockExamsUsed),
  };
}

export function isPro(): boolean {
  return getCurrentTier() !== 'free';
}
