/**
 * OREVON Plan Engine — turns an Assessment + a Care Score into one
 * concrete focus area, so the user always has a single clear thing to
 * work on instead of five parallel to-do lists.
 *
 * Selection logic: start from the user's stated goal, but if a
 * sub-score reveals a more urgent gap than the stated goal covers,
 * OREVON says so and focuses there instead — that's the "intelligent"
 * part of Intelligent Oral Care.
 */

import type { AssessmentAnswers } from '@/lib/assessment';
import type { RoutineKey } from '@/lib/routine';
import type { CareScoreResult, SubScoreKey } from '@/lib/score-engine';

export type FocusArea = 'gumCare' | 'consistency' | 'sensitivityCare' | 'prevention' | 'freshBreathWhitening';

export type WeeklyGoal = {
  label: string;
  targetKeys: RoutineKey[];
  targetDays: number;
};

export type PlanTemplate = {
  focusArea: FocusArea;
  focusStatement: string;
  dailyActionKeys: RoutineKey[];
  weeklyGoal: WeeklyGoal;
  learnArticleIds: string[];
};

const PLAN_TEMPLATES: Record<FocusArea, PlanTemplate> = {
  gumCare: {
    focusArea: 'gumCare',
    focusStatement: 'Gum Care',
    dailyActionKeys: ['floss', 'nightBrush'],
    weeklyGoal: { label: 'Floss 5 days this week', targetKeys: ['floss'], targetDays: 5 },
    learnArticleIds: ['gum-care', 'flossing'],
  },
  consistency: {
    focusArea: 'consistency',
    focusStatement: 'Consistency',
    dailyActionKeys: ['morningBrush', 'nightBrush'],
    weeklyGoal: {
      label: 'Brush morning and night, 6 days this week',
      targetKeys: ['morningBrush', 'nightBrush'],
      targetDays: 6,
    },
    learnArticleIds: ['brushing'],
  },
  sensitivityCare: {
    focusArea: 'sensitivityCare',
    focusStatement: 'Sensitivity Care',
    dailyActionKeys: ['morningBrush', 'nightBrush'],
    weeklyGoal: {
      label: 'Keep both routines gentle, 6 days this week',
      targetKeys: ['morningBrush', 'nightBrush'],
      targetDays: 6,
    },
    learnArticleIds: ['sensitivity'],
  },
  prevention: {
    focusArea: 'prevention',
    focusStatement: 'Prevention',
    dailyActionKeys: ['mouthwash', 'floss'],
    weeklyGoal: { label: 'Use mouthwash 5 days this week', targetKeys: ['mouthwash'], targetDays: 5 },
    learnArticleIds: ['prevention'],
  },
  freshBreathWhitening: {
    focusArea: 'freshBreathWhitening',
    focusStatement: 'Fresh Breath & Whitening',
    dailyActionKeys: ['tongueClean', 'mouthwash'],
    weeklyGoal: { label: 'Clean your tongue 5 days this week', targetKeys: ['tongueClean'], targetDays: 5 },
    learnArticleIds: ['bad-breath', 'whitening'],
  },
};

const GOAL_TO_FOCUS: Record<string, FocusArea> = {
  healthierGums: 'gumCare',
  generalMaintenance: 'consistency',
  sensitivityRelief: 'sensitivityCare',
  cavityPrevention: 'prevention',
  whiterTeeth: 'freshBreathWhitening',
  fresherBreath: 'freshBreathWhitening',
};

const SUBSCORE_TO_FOCUS: Record<SubScoreKey, FocusArea> = {
  consistency: 'consistency',
  gumCare: 'gumCare',
  sensitivityCare: 'sensitivityCare',
  preventiveCare: 'prevention',
  cleaning: 'freshBreathWhitening',
};

/** Below this, a sub-score is treated as urgent enough to override the stated goal. */
const URGENT_THRESHOLD = 50;

export function selectFocusArea(answers: AssessmentAnswers, score: CareScoreResult): FocusArea {
  const goalFocus = GOAL_TO_FOCUS[answers.goal as string];

  const [weakestKey, weakestValue] = (Object.entries(score.subScores) as [SubScoreKey, number][]).reduce(
    (lowest, entry) => (entry[1] < lowest[1] ? entry : lowest)
  );
  const weakestFocus = SUBSCORE_TO_FOCUS[weakestKey];

  if (weakestValue < URGENT_THRESHOLD && weakestFocus !== goalFocus) {
    return weakestFocus;
  }

  return goalFocus ?? weakestFocus;
}

export function generatePlan(answers: AssessmentAnswers, score: CareScoreResult): PlanTemplate {
  const focusArea = selectFocusArea(answers, score);
  return PLAN_TEMPLATES[focusArea];
}
