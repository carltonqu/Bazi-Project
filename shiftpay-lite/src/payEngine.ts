import { PayResult, PayRule, Shift, ShiftBreakdown } from './types';

const MINUTE = 60_000;

function toMs(iso: string): number {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) throw new Error(`Invalid ISO date: ${iso}`);
  return ms;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function minuteOfDay(ms: number): number {
  const d = new Date(ms);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

function isNightMinute(minute: number, start: number, end: number): boolean {
  // supports windows crossing midnight, e.g. 22:00-06:00
  if (start === end) return true;
  if (start < end) return minute >= start && minute < end;
  return minute >= start || minute < end;
}

export function calculateWeeklyPay(shifts: Shift[], rule: PayRule): PayResult {
  const basePerMinute = rule.baseHourlyRate / 60;
  let regularBudget = Math.max(0, Math.floor(rule.overtimeThresholdWeeklyHours * 60));

  const sorted = [...shifts].sort((a, b) => toMs(a.startISO) - toMs(b.startISO));

  const shiftRows: ShiftBreakdown[] = [];
  let totalMinutes = 0;
  let regularMinutes = 0;
  let overtimeMinutes = 0;
  let nightMinutes = 0;
  let holidayMinutes = 0;
  let grossPay = 0;

  for (const s of sorted) {
    const start = toMs(s.startISO);
    const end = toMs(s.endISO);
    if (end <= start) throw new Error(`Shift ${s.id}: end must be after start`);

    const rawMinutes = Math.floor((end - start) / MINUTE);
    const breakMinutes = Math.min(Math.max(0, s.breakMinutes ?? 0), rawMinutes);
    const paidMinutes = rawMinutes - breakMinutes;

    let srTotal = 0;
    let srRegular = 0;
    let srOvertime = 0;
    let srNight = 0;
    let srHoliday = 0;
    let srPay = 0;

    for (let i = 0; i < paidMinutes; i++) {
      const t = start + i * MINUTE;
      const m = minuteOfDay(t);

      const overtime = regularBudget > 0 ? 1 : rule.overtimeMultiplier;
      if (regularBudget > 0) {
        regularBudget -= 1;
        srRegular += 1;
      } else {
        srOvertime += 1;
      }

      const night = isNightMinute(m, rule.nightStartMinutes, rule.nightEndMinutes)
        ? rule.nightMultiplier
        : 1;
      if (night > 1) srNight += 1;

      const holiday = s.isHoliday ? rule.holidayMultiplier : 1;
      if (holiday > 1) srHoliday += 1;

      srPay += basePerMinute * overtime * night * holiday;
      srTotal += 1;
    }

    totalMinutes += srTotal;
    regularMinutes += srRegular;
    overtimeMinutes += srOvertime;
    nightMinutes += srNight;
    holidayMinutes += srHoliday;
    grossPay += srPay;

    shiftRows.push({
      shiftId: s.id,
      totalMinutes: srTotal,
      regularMinutes: srRegular,
      overtimeMinutes: srOvertime,
      nightMinutes: srNight,
      holidayMinutes: srHoliday,
      grossPay: round2(srPay),
    });
  }

  return {
    totalMinutes,
    regularMinutes,
    overtimeMinutes,
    nightMinutes,
    holidayMinutes,
    grossPay: round2(grossPay),
    shifts: shiftRows,
  };
}
