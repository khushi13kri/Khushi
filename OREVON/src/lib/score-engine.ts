/**
 * OREVON Care Score — a behavioral/wellness score, not a clinical or
 * diagnostic measurement. It summarizes how consistent someone's
 * self-reported oral-care habits are, nothing more.
 *
 * V1 computes the score purely from Assessment answers (labelled
 * "Based on what you told us"). Once the app has tracked Routine
 * history over time, a later version can blend that in and start
 * showing a real trend — the `trend` field already exists for that,
 * it's just always `undefined` for now because there isn't enough
 * history yet to compare against.
 */

import type { AssessmentAnswers } from '@/lib/assessment';

export type CareScoreTier = 'Building' | 'Good' | 'Strong' | 'Excellent';

export type SubScoreKey = 'consistency' | 'gumCare' | 'cleaning' | 'sensitivityCare' | 'preventiveCare';

export type CareScoreResult = {
  overall: number;
  tier: CareScoreTier;
  /** Where this score came from. V1 is always 'declared' (assessment only). */
  basis: 'declared';
  subScores: Record<SubScoreKey, number>;
  /** Undefined until there's enough history to compare against — see note above. */
  trend?: { direction: 'up' | 'down' | 'steady'; delta: number };
};

const frequencyScore: Record<string, number> = {
  daily: 100,
  fewTimesWeek: 65,
  rarely: 30,
  never: 10,
};

const brushingScore: Record<string, number> = {
  twiceDaily: 100,
  moreThanTwice: 80,
  onceDaily: 55,
  rarely: 15,
};

const sensitivityCareScore: Record<string, number> = {
  none: 100,
  mild: 75,
  moderate: 55,
  severe: 35,
};

const mouthwashScore: Record<string, number> = {
  daily: 100,
  fewTimesWeek: 70,
  rarely: 40,
  never: 20,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function tierFor(overall: number): CareScoreTier {
  if (overall >= 85) return 'Excellent';
  if (overall >= 70) return 'Strong';
  if (overall >= 50) return 'Good';
  return 'Building';
}

export function computeCareScore(answers: AssessmentAnswers): CareScoreResult {
  const concerns = Array.isArray(answers.concerns) ? answers.concerns : [];

  const consistency = brushingScore[answers.brushingFrequency as string] ?? 50;

  let gumCare = frequencyScore[answers.flossFrequency as string] ?? 50;
  if (concerns.includes('bleedingGums')) gumCare -= 20;

  let cleaning = frequencyScore[answers.tongueCleaning as string] ?? 50;
  if (concerns.includes('badBreath')) cleaning -= 15;

  const sensitivityCare = sensitivityCareScore[answers.sensitivity as string] ?? 70;

  let preventiveCare = mouthwashScore[answers.mouthwashUse as string] ?? 50;
  if (concerns.includes('cavities')) preventiveCare -= 15;

  const subScores: Record<SubScoreKey, number> = {
    consistency: clamp(consistency),
    gumCare: clamp(gumCare),
    cleaning: clamp(cleaning),
    sensitivityCare: clamp(sensitivityCare),
    preventiveCare: clamp(preventiveCare),
  };

  const values = Object.values(subScores);
  const overall = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

  return {
    overall,
    tier: tierFor(overall),
    basis: 'declared',
    subScores,
    trend: undefined,
  };
}
