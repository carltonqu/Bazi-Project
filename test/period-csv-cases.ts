import { groupShiftsByWeek } from '../src/period';
import { shiftsToCSV } from '../src/csv';
import { Shift } from '../src/types';

const shifts: Shift[] = [
  { id: 'w1-a', startISO: '2026-03-09T09:00:00.000Z', endISO: '2026-03-09T17:00:00.000Z' },
  { id: 'w1-b', startISO: '2026-03-12T09:00:00.000Z', endISO: '2026-03-12T17:00:00.000Z' },
  { id: 'w2-a', startISO: '2026-03-16T09:00:00.000Z', endISO: '2026-03-16T17:00:00.000Z' },
];

const periods = groupShiftsByWeek(shifts, 1);
console.log('periods:', periods.map((p) => ({ start: p.startISO, end: p.endISO, count: p.shifts.length })));

console.log('\nCSV sample:\n');
console.log(shiftsToCSV(shifts));
