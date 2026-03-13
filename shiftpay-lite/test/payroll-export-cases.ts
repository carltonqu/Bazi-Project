import { exportPayrollCSV } from '../src/payrollExport';
import { Shift } from '../src/types';

const shifts: Shift[] = [
  { id: '1', startISO: '2026-03-10T09:00:00.000Z', endISO: '2026-03-10T17:00:00.000Z', breakMinutes: 30 },
  { id: '2', startISO: '2026-03-11T09:00:00.000Z', endISO: '2026-03-11T17:00:00.000Z', breakMinutes: 30, isHoliday: true },
];

const employee = { employeeId: 'EMP-001' };

console.log('--- GENERIC ---');
console.log(exportPayrollCSV('GENERIC', shifts, employee));
console.log('\n--- ADP ---');
console.log(exportPayrollCSV('ADP_CSV', shifts, employee));
console.log('\n--- GUSTO ---');
console.log(exportPayrollCSV('GUSTO_CSV', shifts, employee));
