export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
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
