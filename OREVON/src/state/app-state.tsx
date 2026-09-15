import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AssessmentAnswers } from '@/lib/assessment';

/**
 * App-wide state, held in memory for V1 (no backend yet — see AGENTS
 * notes). Everything here resets when the app reloads; Supabase-backed
 * persistence is a V2 concern.
 */
type AppState = {
  assessment: AssessmentAnswers | null;
  setAssessment: (answers: AssessmentAnswers) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [assessment, setAssessment] = useState<AssessmentAnswers | null>(null);

  const value = useMemo<AppState>(() => ({ assessment, setAssessment }), [assessment]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
