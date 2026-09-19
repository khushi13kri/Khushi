import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { SEED_MESSAGE } from '@/lib/ai-responder';
import type { AssessmentAnswers } from '@/lib/assessment';
import type { RoutineKey, RoutineLogs } from '@/lib/routine';
import {
  DEFAULT_NOTIFICATION_PREFS,
  ensureAnonymousUserId,
  fetchAssessment,
  fetchNotificationPrefs,
  fetchRoutineLogs,
  saveAssessment,
  saveNotificationPrefs,
  saveRoutineLog,
  type NotificationPrefs,
} from '@/lib/sync';

export type { NotificationPrefs };

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * App-wide state. Assessment answers, routine logs, and notification
 * preferences sync to Supabase (V2) under an anonymous per-device
 * user — no login screens, but data now survives a reload. Chat
 * history stays local-only; it isn't part of personalization and
 * keeping it out keeps this persistence pass small. If Supabase isn't
 * configured (see .env.example), everything falls back to the V1
 * in-memory-only behavior.
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
  const [userId, setUserId] = useState<string | null>(null);
  const [assessment, setAssessmentState] = useState<AssessmentAnswers | null>(null);
  const [routineLogs, setRoutineLogs] = useState<RoutineLogs>({});
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'seed', role: 'assistant', text: SEED_MESSAGE },
  ]);

  // Hydrate once from Supabase on launch: sign in anonymously, then pull
  // down whatever this device already saved. Safe to skip entirely if
  // Supabase isn't configured (ensureAnonymousUserId returns null).
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const id = await ensureAnonymousUserId();
      if (cancelled || !id) return;
      setUserId(id);

      const [serverAssessment, serverRoutineLogs, serverNotificationPrefs] = await Promise.all([
        fetchAssessment(id),
        fetchRoutineLogs(id),
        fetchNotificationPrefs(id),
      ]);
      if (cancelled) return;

      if (serverAssessment) setAssessmentState(serverAssessment);
      if (Object.keys(serverRoutineLogs).length > 0) setRoutineLogs(serverRoutineLogs);
      if (serverNotificationPrefs) setNotificationPrefs(serverNotificationPrefs);
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const setAssessment = useCallback(
    (answers: AssessmentAnswers) => {
      setAssessmentState(answers);
      if (userId) {
        saveAssessment(userId, answers).catch(() => {});
      }
    },
    [userId]
  );

  const toggleRoutineItem = useCallback(
    (dateKey: string, key: RoutineKey) => {
      const dayLog = routineLogs[dateKey] ?? {};
      const updatedLog = { ...dayLog, [key]: !dayLog[key] };
      setRoutineLogs((prev) => ({ ...prev, [dateKey]: updatedLog }));
      if (userId) {
        saveRoutineLog(userId, dateKey, updatedLog).catch(() => {});
      }
    },
    [routineLogs, userId]
  );

  const toggleNotificationPref = useCallback(
    (key: keyof NotificationPrefs) => {
      const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
      setNotificationPrefs(next);
      if (userId) {
        saveNotificationPrefs(userId, next).catch(() => {});
      }
    },
    [notificationPrefs, userId]
  );

  const addChatMessage = useCallback((role: ChatMessage['role'], text: string) => {
    setChatMessages((prev) => [...prev, { id: generateMessageId(), role, text }]);
  }, []);

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
    [
      assessment,
      setAssessment,
      routineLogs,
      toggleRoutineItem,
      notificationPrefs,
      toggleNotificationPref,
      chatMessages,
      addChatMessage,
    ]
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
