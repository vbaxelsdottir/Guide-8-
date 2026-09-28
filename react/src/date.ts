// DEVELOPMENT ONLY: set to null to use the real date in development.
// Production builds always use the real date, regardless of this setting.
export const DEVELOPMENT_DAY: number | null = 10;
export const isSimulated = import.meta.env.DEV && DEVELOPMENT_DAY !== null;

export function getCalendarDate(): Date {
  const now = new Date();
  return isSimulated ? new Date(now.getFullYear(), 11, DEVELOPMENT_DAY!) : now;
}

// The calendar is for December of the current year; January–November are locked.
export function getAvailableDay(date: Date): number {
  return date.getMonth() === 11 ? Math.min(date.getDate(), 24) : 0;
}

export function daysUntilChristmas(date: Date): number {
  // UTC calendar-day arithmetic avoids daylight-saving time differences.
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const christmas = Date.UTC(date.getFullYear(), 11, 25);
  return Math.max(0, Math.round((christmas - today) / 86_400_000));
}
