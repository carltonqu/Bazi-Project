import { calculateWeeklyPay } from '../src/payEngine';
import { PayRule, Shift } from '../src/types';

const baseRule: PayRule = {
  currency: 'USD',
  baseHourlyRate: 20,
  overtimeThresholdWeeklyHours: 40,
  overtimeMultiplier: 1.5,
  nightStartMinutes: 22 * 60,
  nightEndMinutes: 6 * 60,
  nightMultiplier: 1.2,
  holidayMultiplier: 2,
};

const cases: Array<{ name: string; shifts: Shift[] }> = [
  {
    name: 'simple day shift',
    shifts: [
      {
        id: 'a',
        startISO: '2026-03-09T09:00:00.000Z',
        endISO: '2026-03-09T17:00:00.000Z',
        breakMinutes: 30,
      },
    ],
  },
  {
    name: 'cross midnight night shift',
    shifts: [
      {
        id: 'b',
        startISO: '2026-03-10T22:00:00.000Z',
        endISO: '2026-03-11T06:00:00.000Z',
        breakMinutes: 30,
      },
    ],
  },
];

for (const c of cases) {
  const result = calculateWeeklyPay(c.shifts, baseRule);
  console.log(`\nCASE: ${c.name}`);
  console.log(result);
}
