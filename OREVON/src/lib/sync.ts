/**
 * Supabase read/write layer for OREVON V2 persistence. Mirrors the
 * same three pieces of state app-state.tsx already manages locally —
 * this file is purely the data-access layer; app-state.tsx decides
 * when to call it. Every function is a no-op-safe best effort: a
 * failure here logs a warning and leaves local state as the source of
 * truth rather than crashing the app (this app worked fully offline
 * in V1, and staying resilient when Supabase is unreachable matters
 * more than surfacing a sync error to the user).
 */

import type { AssessmentAnswers } from '@/lib/assessment';
import type { RoutineKey, RoutineLog, RoutineLogs } from '@/lib/routine';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type NotificationPrefs = {
  dailyReminders: boolean;
  weeklyCheckins: boolean;
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  dailyReminders: true,
  weeklyCheckins: true,
};

/** Returns the current (or newly created) anonymous user id, or null if Supabase isn't configured. */
export async function ensureAnonymousUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    return sessionData.session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('Supabase anonymous sign-in failed:', error.message);
    return null;
  }
  return data.user?.id ?? null;
}

export async function fetchAssessment(userId: string): Promise<AssessmentAnswers | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('answers')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.warn('Failed to fetch assessment:', error.message);
    return null;
  }
  return (data?.answers as AssessmentAnswers | undefined) ?? null;
}

export async function saveAssessment(userId: string, answers: AssessmentAnswers): Promise<void> {
  const { error } = await supabase
    .from('assessments')
    .upsert({ user_id: userId, answers, updated_at: new Date().toISOString() });
  if (error) console.warn('Failed to save assessment:', error.message);
}

const ROUTINE_COLUMNS: Record<RoutineKey, string> = {
  morningBrush: 'morning_brush',
  nightBrush: 'night_brush',
  tongueClean: 'tongue_clean',
  floss: 'floss',
  mouthwash: 'mouthwash',
};

const ROUTINE_KEYS = Object.keys(ROUTINE_COLUMNS) as RoutineKey[];

function rowToRoutineLog(row: Record<string, unknown>): RoutineLog {
  const log: RoutineLog = {};
  for (const key of ROUTINE_KEYS) {
    if (row[ROUTINE_COLUMNS[key]] === true) log[key] = true;
  }
  return log;
}

export async function fetchRoutineLogs(userId: string): Promise<RoutineLogs> {
  const { data, error } = await supabase.from('routine_logs').select('*').eq('user_id', userId);
  if (error) {
    console.warn('Failed to fetch routine logs:', error.message);
    return {};
  }
  const logs: RoutineLogs = {};
  for (const row of data ?? []) {
    logs[row.log_date as string] = rowToRoutineLog(row);
  }
  return logs;
}

export async function saveRoutineLog(userId: string, dateKey: string, log: RoutineLog): Promise<void> {
  const row: Record<string, unknown> = {
    user_id: userId,
    log_date: dateKey,
    updated_at: new Date().toISOString(),
  };
  for (const key of ROUTINE_KEYS) {
    row[ROUTINE_COLUMNS[key]] = log[key] === true;
  }
  const { error } = await supabase.from('routine_logs').upsert(row);
  if (error) console.warn('Failed to save routine log:', error.message);
}

export async function fetchNotificationPrefs(userId: string): Promise<NotificationPrefs | null> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('daily_reminders, weekly_checkins')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.warn('Failed to fetch notification preferences:', error.message);
    return null;
  }
  if (!data) return null;
  return { dailyReminders: data.daily_reminders, weeklyCheckins: data.weekly_checkins };
}

export async function saveNotificationPrefs(userId: string, prefs: NotificationPrefs): Promise<void> {
  const { error } = await supabase.from('notification_preferences').upsert({
    user_id: userId,
    daily_reminders: prefs.dailyReminders,
    weekly_checkins: prefs.weeklyCheckins,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn('Failed to save notification preferences:', error.message);
}
