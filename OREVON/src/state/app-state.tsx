import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { SEED_MESSAGE } from '@/lib/ai-responder';
import type { AssessmentAnswers } from '@/lib/assessment';
import type { RoutineKey, RoutineLogs } from '@/lib/routine';

export type NotificationPrefs = {
  dailyReminders: boolean;
  weeklyCheckins: boolean;
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  dailyReminders: true,
  weeklyCheckins: true,
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

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
  notificationPrefs: NotificationPrefs;
  toggleNotificationPref: (key: keyof NotificationPrefs) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (role: ChatMessage['role'], text: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [assessment, setAssessment] = useState<AssessmentAnswers | null>(null);
  const [routineLogs, setRoutineLogs] = useState<RoutineLogs>({});
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'seed', role: 'assistant', text: SEED_MESSAGE },
  ]);

  function toggleRoutineItem(dateKey: string, key: RoutineKey) {
    setRoutineLogs((prev) => {
      const dayLog = prev[dateKey] ?? {};
      return { ...prev, [dateKey]: { ...dayLog, [key]: !dayLog[key] } };
    });
  }

  function toggleNotificationPref(key: keyof NotificationPrefs) {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function addChatMessage(role: ChatMessage['role'], text: string) {
    setChatMessages((prev) => [...prev, { id: generateMessageId(), role, text }]);
  }

  const value = useMemo<AppState>(
    () => ({
      assessment,
      setAssessment,
      routineLogs,
      toggleRoutineItem,
      notificationPrefs,
      toggleNotificationPref,
      chatMessages,
      addChatMessage,
    }),
    [assessment, routineLogs, notificationPrefs, chatMessages]
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
