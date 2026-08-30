export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function formatCheckInLabel(date: Date | null): string {
  if (!date) return 'No recent check-in';
  const now = new Date();
  const prefix = isSameDay(date, now) ? 'Today' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${prefix}, ${formatClockTime(date)}`;
}

export function formatDuration(start: Date, end: Date): string {
  const totalSeconds = Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}
