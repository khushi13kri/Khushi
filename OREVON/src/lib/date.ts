/**
 * Local calendar date as YYYY-MM-DD. Deliberately uses the local
 * getters (not toISOString, which is UTC) so an evening routine
 * check-in never gets bucketed under tomorrow just because UTC has
 * already rolled over in timezones behind it.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** The last `n` date keys, most recent first (today included). */
export function lastNDateKeys(n: number, from: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    const day = new Date(from);
    day.setDate(day.getDate() - i);
    keys.push(toDateKey(day));
  }
  return keys;
}
