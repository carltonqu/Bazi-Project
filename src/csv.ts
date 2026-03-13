import { Shift, PayResult } from './types';

function esc(value: string | number | boolean | undefined): string {
  if (value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function shiftsToCSV(shifts: Shift[]): string {
  const header = ['id', 'startISO', 'endISO', 'breakMinutes', 'isHoliday', 'note'];
  const rows = shifts.map((s) => [s.id, s.startISO, s.endISO, s.breakMinutes ?? 0, !!s.isHoliday, s.note ?? '']);
  return [header, ...rows].map((row) => row.map((c) => esc(c)).join(',')).join('\n');
}

export function payResultToCSV(result: PayResult): string {
  const header = ['shiftId', 'totalMinutes', 'regularMinutes', 'overtimeMinutes', 'nightMinutes', 'holidayMinutes', 'grossPay'];
  const rows = result.shifts.map((s) => [s.shiftId, s.totalMinutes, s.regularMinutes, s.overtimeMinutes, s.nightMinutes, s.holidayMinutes, s.grossPay]);
  const footer = ['TOTAL', result.totalMinutes, result.regularMinutes, result.overtimeMinutes, result.nightMinutes, result.holidayMinutes, result.grossPay];
  return [header, ...rows, footer].map((row) => row.map((c) => esc(c)).join(',')).join('\n');
}
