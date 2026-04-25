import type { UserProfile, ChapterProgress } from "./storage";

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Newcomer", xpRequired: 0 },
  { level: 2, title: "Learner", xpRequired: 200 },
  { level: 3, title: "Student", xpRequired: 500 },
  { level: 4, title: "Scholar", xpRequired: 1000 },
  { level: 5, title: "Graduate", xpRequired: 2000 },
  { level: 6, title: "Expert", xpRequired: 3500 },
  { level: 7, title: "Master", xpRequired: 5500 },
  { level: 8, title: "Citizen Pro", xpRequired: 8000 },
];

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_test", name: "First Steps", description: "Complete your first test", icon: "footprints" },
  { id: "perfect_24", name: "Perfect Score", description: "Get 24/24 on a full mock", icon: "star" },
  { id: "streak_7", name: "Week Warrior", description: "7-day study streak", icon: "flame" },
  { id: "streak_30", name: "Monthly Master", description: "30-day study streak", icon: "flame" },
  { id: "streak_100", name: "Century Club", description: "100-day study streak", icon: "flame" },
  { id: "ch1_master", name: "Values Scholar", description: "Master Chapter 1", icon: "book" },
  { id: "ch2_master", name: "Geography Pro", description: "Master Chapter 2", icon: "map" },
  { id: "ch3_master", name: "History Buff", description: "Master Chapter 3", icon: "clock" },
  { id: "ch4_master", name: "Culture Expert", description: "Master Chapter 4", icon: "users" },
  { id: "ch5_master", name: "Law & Order", description: "Master Chapter 5", icon: "scale" },
  { id: "speed_demon", name: "Speed Demon", description: "Complete a test in under 15 minutes", icon: "zap" },
  { id: "night_owl", name: "Night Owl", description: "Study after 10 PM", icon: "moon" },
  { id: "early_bird", name: "Early Bird", description: "Study before 7 AM", icon: "sun" },
];

export const XP_ACTIONS = {
  completePractice: 50,
  passFullMock: 100,
  perfectScore: 200,
  correctAnswer: 5,
  studyFlashcard: 2,
  dailyChallenge: 75,
  streak7Bonus: 50,
  unlockAchievement: 100,
} as const;

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPToNextLevel(xp: number): { current: number; target: number; progress: number } {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) {
    return { current: xp, target: xp, progress: 100 };
  }
  const progress = ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
  return {
    current: xp - currentLevel.xpRequired,
    target: nextLevel.xpRequired - currentLevel.xpRequired,
    progress: Math.min(Math.max(progress, 0), 100),
  };
}

export function calculateXPForTest(
  score: number,
  totalQuestions: number,
  timeTakenSeconds: number,
  isFullMock: boolean
): { total: number; breakdown: { action: string; xp: number }[] } {
  const breakdown: { action: string; xp: number }[] = [];

  // Base XP for completing
  breakdown.push({
    action: isFullMock ? "Complete full mock" : "Complete practice",
    xp: isFullMock ? XP_ACTIONS.passFullMock : XP_ACTIONS.completePractice,
  });

  // XP for correct answers
  const correctXP = Math.round((score / 100) * totalQuestions * XP_ACTIONS.correctAnswer);
  if (correctXP > 0) {
    breakdown.push({ action: "Correct answers", xp: correctXP });
  }

  // Perfect score bonus
  if (score === 100 && isFullMock) {
    breakdown.push({ action: "Perfect score bonus", xp: XP_ACTIONS.perfectScore });
  }

  // Speed bonus
  if (isFullMock && timeTakenSeconds < 900) {
    breakdown.push({ action: "Speed bonus", xp: XP_ACTIONS.completePractice });
  }

  const total = breakdown.reduce((sum, b) => sum + b.xp, 0);
  return { total, breakdown };
}

export function checkAchievements(profile: UserProfile): string[] {
  const unlocked: string[] = [];

  if (profile.testsCompleted >= 1) unlocked.push("first_test");
  if (profile.bestScore === 100) unlocked.push("perfect_24");
  if (profile.currentStreak >= 7) unlocked.push("streak_7");
  if (profile.currentStreak >= 30) unlocked.push("streak_30");
  if (profile.currentStreak >= 100) unlocked.push("streak_100");
  if (profile.fastestTestTime > 0 && profile.fastestTestTime < 900) unlocked.push("speed_demon");

  // Chapter mastery checks
  const ch1 = profile.chapterProgress.find((c) => c.chapterId === 1);
  const ch2 = profile.chapterProgress.find((c) => c.chapterId === 2);
  const ch3 = profile.chapterProgress.find((c) => c.chapterId === 3);
  const ch4 = profile.chapterProgress.find((c) => c.chapterId === 4);
  const ch5 = profile.chapterProgress.find((c) => c.chapterId === 5);

  if (ch1?.masteryLevel === "master") unlocked.push("ch1_master");
  if (ch2?.masteryLevel === "master") unlocked.push("ch2_master");
  if (ch3?.masteryLevel === "master") unlocked.push("ch3_master");
  if (ch4?.masteryLevel === "master") unlocked.push("ch4_master");
  if (ch5?.masteryLevel === "master") unlocked.push("ch5_master");

  // Time-based achievements
  const hour = new Date().getHours();
  if (hour >= 22) unlocked.push("night_owl");
  if (hour < 7) unlocked.push("early_bird");

  return unlocked.filter((id) => !profile.achievements.includes(id));
}

export function updateStreak(profile: UserProfile): { newStreak: number; streakMaintained: boolean } {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = profile.lastStudyDate;

  if (!lastDate) {
    return { newStreak: 1, streakMaintained: false };
  }

  const last = new Date(lastDate);
  const now = new Date(today);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { newStreak: profile.currentStreak, streakMaintained: true };
  } else if (diffDays === 1) {
    return { newStreak: profile.currentStreak + 1, streakMaintained: true };
  } else {
    return { newStreak: 1, streakMaintained: false };
  }
}

export function calculateChapterMastery(
  questionsAttempted: number,
  questionsCorrect: number
): ChapterProgress["masteryLevel"] {
  if (questionsAttempted === 0) return "none";
  const accuracy = questionsCorrect / questionsAttempted;
  if (accuracy >= 0.9 && questionsAttempted >= 20) return "master";
  if (accuracy >= 0.7 && questionsAttempted >= 10) return "intermediate";
  if (accuracy >= 0.5) return "beginner";
  return "none";
}
