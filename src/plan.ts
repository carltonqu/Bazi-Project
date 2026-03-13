import { calculateWeeklyPay } from './payEngine';
import { groupShiftsByWeek } from './period';
import { PayRule, PayResult, Shift } from './types';

export type PlanTier = 'free' | 'pro';

export type PlanConstraints = {
  tier: PlanTier;
  maxPeriodsForFree: number;
};

export type PeriodSummary = {
  startISO: string;
  endISO: string;
  result: PayResult;
};

export function buildPeriodSummaries(shifts: Shift[], rule: PayRule, weekStartsOn = 1): PeriodSummary[] {
  const periods = groupShiftsByWeek(shifts, weekStartsOn);
  return periods.map((p) => ({
    startISO: p.startISO,
    endISO: p.endISO,
    result: calculateWeeklyPay(p.shifts, rule),
  }));
}

export function enforcePlan(periods: PeriodSummary[], constraints: PlanConstraints): PeriodSummary[] {
  if (constraints.tier === 'pro') return periods;
  const max = Math.max(1, constraints.maxPeriodsForFree);
  return periods.slice(-max);
}

export function isUpgradeRequired(periodCount: number, constraints: PlanConstraints): boolean {
  if (constraints.tier === 'pro') return false;
  return periodCount > constraints.maxPeriodsForFree;
}
