import { Shift } from './types';

export type PayrollProvider = 'GENERIC' | 'ADP_CSV' | 'GUSTO_CSV';

export type EmployeeProfile = {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

function esc(v: string | number | boolean | undefined): string {
  if (v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toHours(startISO: string, endISO: string, breakMinutes = 0): number {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const mins = Math.max(0, Math.floor((end - start) / 60000) - Math.max(0, breakMinutes));
  return Math.round((mins / 60) * 100) / 100;
}

export function exportPayrollCSV(
  provider: PayrollProvider,
  shifts: Shift[],
  employee: EmployeeProfile,
): string {
  const sorted = [...shifts].sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());

  if (provider === 'ADP_CSV') {
    const header = ['Employee ID', 'Date', 'Hours', 'Earnings Code', 'Notes'];
    const rows = sorted.map((s) => {
      const hours = toHours(s.startISO, s.endISO, s.breakMinutes ?? 0);
      const date = s.startISO.slice(0, 10);
      const code = s.isHoliday ? 'HOL' : 'REG';
      return [employee.employeeId, date, hours, code, s.note ?? ''];
    });
    return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  }

  if (provider === 'GUSTO_CSV') {
    const header = ['employee_id', 'work_date', 'hours', 'job', 'memo'];
    const rows = sorted.map((s) => {
      const hours = toHours(s.startISO, s.endISO, s.breakMinutes ?? 0);
      const date = s.startISO.slice(0, 10);
      return [employee.employeeId, date, hours, 'General', s.note ?? ''];
    });
    return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  }

  // GENERIC
  const header = ['employeeId', 'startISO', 'endISO', 'breakMinutes', 'hours', 'isHoliday', 'note'];
  const rows = sorted.map((s) => [
    employee.employeeId,
    s.startISO,
    s.endISO,
    s.breakMinutes ?? 0,
    toHours(s.startISO, s.endISO, s.breakMinutes ?? 0),
    !!s.isHoliday,
    s.note ?? '',
  ]);
  return [header, ...rows].map((r) => r.map(esc).join(',')).join('\n');
}
