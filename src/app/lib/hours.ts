// Structured opening hours: stored in the place's `openingHours` field as JSON.
// Shape: { mon:{open,close,closed}, tue:{...}, ... }. Times are "HH:MM" (24h).

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export interface DayHours { open: string; close: string; closed: boolean; }
export type WeekHours = Record<DayKey, DayHours>;

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
export const DAY_SHORT: Record<DayKey, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

export function defaultWeek(): WeekHours {
  const w = {} as WeekHours;
  for (const d of DAY_KEYS) w[d] = { open: '09:00', close: '18:00', closed: d === 'sun' };
  return w;
}

/** Parse the stored field. Returns null when it isn't structured JSON (legacy free text). */
export function parseHours(raw?: string | null): WeekHours | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    if (o && typeof o === 'object' && o.mon && o.sun) {
      const w = {} as WeekHours;
      for (const d of DAY_KEYS) {
        const x = o[d] || {};
        w[d] = { open: x.open || '09:00', close: x.close || '18:00', closed: !!x.closed };
      }
      return w;
    }
  } catch { /* not JSON */ }
  return null;
}

export function serializeHours(w: WeekHours): string {
  return JSON.stringify(w);
}

const isTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/** Returns an error message if invalid, otherwise null. */
export function validateWeek(w: WeekHours): string | null {
  for (const d of DAY_KEYS) {
    const day = w[d];
    if (day.closed) continue;
    if (!isTime(day.open) || !isTime(day.close)) return `Invalid time for ${DAY_LABELS[d]}`;
    if (day.open >= day.close) return `${DAY_LABELS[d]}: closing time must be after opening time`;
  }
  return null;
}

const todayKey = (): DayKey => DAY_KEYS[(new Date().getDay() + 6) % 7]; // JS: 0=Sun

/** true=open, false=closed, null=unknown (no structured hours). */
export function isOpenNow(raw?: string | null): boolean | null {
  const w = parseHours(raw);
  if (!w) return null;
  const day = w[todayKey()];
  if (day.closed) return false;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return hhmm >= day.open && hhmm < day.close;
}

/** Today's hours as a short string, e.g. "09:00 – 18:00" or "Closed". */
export function todayHours(raw?: string | null): string | null {
  const w = parseHours(raw);
  if (!w) return null;
  const day = w[todayKey()];
  return day.closed ? 'Closed today' : `${day.open} – ${day.close}`;
}
