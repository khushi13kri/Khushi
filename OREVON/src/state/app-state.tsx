import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AssessmentAnswers } from '@/lib/assessment';
import type { RoutineKey, RoutineLogs } from '@/lib/routine';

/**
 * App-wide state, held in memory for V1 (no backend yet). Everything
 * here resets when the app reloads; Supabase-backed persistence is a
 * V2 concern.
 */
type AppState = {
  assessment: AssessmentAnswers | null;
  setAssessment: (answers: AssessmentAnswers) => void;
  routineLogs: RoutineLogs;
  toggleRoutineItem: (dateKey: string, key: RoutineKey) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [assessment, setAssessment] = useState<AssessmentAnswers | null>(null);
  const [routineLogs, setRoutineLogs] = useState<RoutineLogs>({});

  function toggleRoutineItem(dateKey: string, key: RoutineKey) {
    setRoutineLogs((prev) => {
      const dayLog = prev[dateKey] ?? {};
      return { ...prev, [dateKey]: { ...dayLog, [key]: !dayLog[key] } };
    });
  }

  const value = useMemo<AppState>(
    () => ({ assessment, setAssessment, routineLogs, toggleRoutineItem }),
    [assessment, routineLogs]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
