import { InMemoryShiftStore } from '../src/store';
import { buildPeriodSummaries, enforcePlan, isUpgradeRequired } from '../src/plan';
import { PayRule } from '../src/types';

const rule: PayRule = {
  currency: 'USD',
  baseHourlyRate: 15,
  overtimeThresholdWeeklyHours: 40,
  overtimeMultiplier: 1.5,
  nightStartMinutes: 22 * 60,
  nightEndMinutes: 6 * 60,
  nightMultiplier: 1.2,
  holidayMultiplier: 2,
};

async function run() {
  const store = new InMemoryShiftStore();

  await store.upsert({ id: '1', startISO: '2026-03-09T09:00:00.000Z', endISO: '2026-03-09T17:00:00.000Z' });
  await store.upsert({ id: '2', startISO: '2026-03-16T09:00:00.000Z', endISO: '2026-03-16T17:00:00.000Z' });

  const shifts = await store.list();
  const periods = buildPeriodSummaries(shifts, rule);

  console.log('periodCount', periods.length);
  console.log('upgradeNeeded(free:1)', isUpgradeRequired(periods.length, { tier: 'free', maxPeriodsForFree: 1 }));
  console.log('freeVisible', enforcePlan(periods, { tier: 'free', maxPeriodsForFree: 1 }).length);
  console.log('proVisible', enforcePlan(periods, { tier: 'pro', maxPeriodsForFree: 1 }).length);
}

run();
