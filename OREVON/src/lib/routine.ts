/**
 * The five things OREVON tracks every day. This is the shared
 * vocabulary between the Plan Engine (which picks 2-3 of these as
 * "today's actions" for the current focus) and the Routine screen
 * (which tracks all five) — both read/write the same keys so they
 * always agree with each other.
 */

export type RoutineKey = 'morningBrush' | 'nightBrush' | 'tongueClean' | 'floss' | 'mouthwash';

export const ROUTINE_ITEMS: { key: RoutineKey; label: string }[] = [
  { key: 'morningBrush', label: 'Morning brush' },
  { key: 'nightBrush', label: 'Night brush' },
  { key: 'tongueClean', label: 'Tongue cleaning' },
  { key: 'floss', label: 'Floss / interdental clean' },
  { key: 'mouthwash', label: 'Mouthwash' },
];

export function routineLabel(key: RoutineKey): string {
  return ROUTINE_ITEMS.find((item) => item.key === key)?.label ?? key;
}

/** One day's log: which routine keys were completed that day. */
export type RoutineLog = Partial<Record<RoutineKey, boolean>>;

/** All logs, keyed by date (YYYY-MM-DD). */
export type RoutineLogs = Record<string, RoutineLog>;

/** How many of the given days had every one of `targetKeys` completed. */
export function weeklyCompletionCount(logs: RoutineLogs, targetKeys: RoutineKey[], dateKeys: string[]): number {
  return dateKeys.filter((day) => {
    const log = logs[day];
    if (!log) return false;
    return targetKeys.every((key) => log[key] === true);
  }).length;
}
