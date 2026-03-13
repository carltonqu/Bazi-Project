export type Shift = {
  id: string;
  startISO: string;
  endISO: string;
  breakMinutes?: number;
  isHoliday?: boolean;
  note?: string;
};

export type PayRule = {
  currency: 'USD' | string;
  baseHourlyRate: number;
  overtimeThresholdWeeklyHours: number;
  overtimeMultiplier: number;
  nightStartMinutes: number; // minutes from midnight
  nightEndMinutes: number;   // minutes from midnight
  nightMultiplier: number;
  holidayMultiplier: number;
};

export type PayBreakdown = {
  totalMinutes: number;
  regularMinutes: number;
  overtimeMinutes: number;
  nightMinutes: number;
  holidayMinutes: number;
  grossPay: number;
};

export type ShiftBreakdown = PayBreakdown & {
  shiftId: string;
};

export type PayResult = PayBreakdown & {
  shifts: ShiftBreakdown[];
};
