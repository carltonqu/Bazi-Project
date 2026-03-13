import { Shift } from './types';

const DAY = 24 * 60 * 60 * 1000;

export type PayPeriod = {
  startISO: string;
  endISO: string;
  shifts: Shift[];
};

function toUTCDateOnlyMs(inputISO: string): number {
  const d = new Date(inputISO);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

// weekStartsOn: 1 => Monday (default), 0 => Sunday
export function weekBoundsFor(dateISO: string, weekStartsOn = 1): { startISO: string; endISO: string } {
  const d = new Date(dateISO);
  const day = d.getUTCDay();
  const diff = (day - weekStartsOn + 7) % 7;
  const startMs = toUTCDateOnlyMs(dateISO) - diff * DAY;
  const endMs = startMs + 7 * DAY;
  return {
    startISO: new Date(startMs).toISOString(),
    endISO: new Date(endMs).toISOString(),
  };
}

export function groupShiftsByWeek(shifts: Shift[], weekStartsOn = 1): PayPeriod[] {
  const buckets = new Map<string, Shift[]>();

  for (const s of shifts) {
    const { startISO, endISO } = weekBoundsFor(s.startISO, weekStartsOn);
    const key = `${startISO}_${endISO}`;
    const arr = buckets.get(key) ?? [];
    arr.push(s);
    buckets.set(key, arr);
  }

  return [...buckets.entries()]
    .map(([key, value]) => {
      const [startISO, endISO] = key.split('_');
      return {
        startISO,
        endISO,
        shifts: value.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime()),
      };
    })
    .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
}
