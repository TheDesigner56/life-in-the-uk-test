export interface ChapterProgress {
  chapterId: number;
  questionsAttempted: number;
  questionsCorrect: number;
  flashcardsStudied: number;
  totalFlashcards: number;
  masteryLevel: "none" | "beginner" | "intermediate" | "master";
}

export interface UserProfile {
  username: string;
  avatar: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  testsCompleted: number;
  testsPassed: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  averageScore: number;
  bestScore: number;
  fastestTestTime: number;
  achievements: string[];
  chapterProgress: ChapterProgress[];
  preferredMode: "light" | "dark" | "system";
}

export interface TestSession {
  id: string;
  mode: "quick" | "full" | "chapter" | "marathon";
  chapterId?: number;
  questions: {
    id: string;
    chapterId: number;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
  }[];
  answers: Record<number, number>;
  startTime: number;
  endTime?: number;
  score?: number;
  passed?: boolean;
}

export interface TestResult {
  id: string;
  mode: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  passed: boolean;
  date: string;
  chapterBreakdown: Record<number, { attempted: number; correct: number }>;
}

const STORAGE_KEYS = {
  profile: "lituk_profile",
  results: "lituk_results",
  sessions: "lituk_sessions",
  settings: "lituk_settings",
} as const;

export function getDefaultProfile(): UserProfile {
  return {
    username: "",
    avatar: "",
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: "",
    testsCompleted: 0,
    testsPassed: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    averageScore: 0,
    bestScore: 0,
    fastestTestTime: 0,
    achievements: [],
    chapterProgress: [
      { chapterId: 1, questionsAttempted: 0, questionsCorrect: 0, flashcardsStudied: 0, totalFlashcards: 20, masteryLevel: "none" },
      { chapterId: 2, questionsAttempted: 0, questionsCorrect: 0, flashcardsStudied: 0, totalFlashcards: 20, masteryLevel: "none" },
      { chapterId: 3, questionsAttempted: 0, questionsCorrect: 0, flashcardsStudied: 0, totalFlashcards: 20, masteryLevel: "none" },
      { chapterId: 4, questionsAttempted: 0, questionsCorrect: 0, flashcardsStudied: 0, totalFlashcards: 20, masteryLevel: "none" },
      { chapterId: 5, questionsAttempted: 0, questionsCorrect: 0, flashcardsStudied: 0, totalFlashcards: 20, masteryLevel: "none" },
    ],
    preferredMode: "system",
  };
}

export function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.profile);
    if (stored) {
      const parsed = JSON.parse(stored) as UserProfile;
      return { ...getDefaultProfile(), ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return getDefaultProfile();
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}

export function loadTestResults(): TestResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.results);
    if (stored) {
      return JSON.parse(stored) as TestResult[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveTestResult(result: TestResult): void {
  try {
    const results = loadTestResults();
    results.unshift(result);
    // Keep max 50 results
    if (results.length > 50) {
      results.length = 50;
    }
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
  } catch {
    // ignore
  }
}

export function saveTestSession(session: TestSession): void {
  try {
    const sessions = loadTestSessions();
    sessions.unshift(session);
    if (sessions.length > 10) {
      sessions.length = 10;
    }
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function loadTestSessions(): TestSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sessions);
    if (stored) {
      return JSON.parse(stored) as TestSession[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function loadSettings(): { theme: "light" | "dark" | "system" } {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (stored) {
      return JSON.parse(stored) as { theme: "light" | "dark" | "system" };
    }
  } catch {
    // ignore
  }
  return { theme: "system" };
}

export function saveSettings(settings: { theme: "light" | "dark" | "system" }): void {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
