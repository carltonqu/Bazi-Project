import { calculateWeeklyPay } from './payEngine';
import { PayRule, Shift } from './types';

const rule: PayRule = {
  currency: 'USD',
  baseHourlyRate: 15,
  overtimeThresholdWeeklyHours: 40,
  overtimeMultiplier: 1.5,
  nightStartMinutes: 22 * 60,
  nightEndMinutes: 6 * 60,
  nightMultiplier: 1.2,
  holidayMultiplier: 2.0,
};

const sampleShifts: Shift[] = [
  {
    id: 's1',
    startISO: '2026-03-09T13:00:00.000Z',
    endISO: '2026-03-09T21:00:00.000Z',
    breakMinutes: 30,
    isHoliday: false,
  },
  {
    id: 's2',
    startISO: '2026-03-10T22:00:00.000Z',
    endISO: '2026-03-11T06:00:00.000Z',
    breakMinutes: 30,
    isHoliday: false,
  },
];

console.log(JSON.stringify(calculateWeeklyPay(sampleShifts, rule), null, 2));
