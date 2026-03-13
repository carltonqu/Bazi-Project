import { PayRule } from './types';

export type CountryCode = 'US' | 'PH' | 'AU' | 'CUSTOM';

export type CountryRulePreset = {
  code: CountryCode;
  name: string;
  defaultCurrency: string;
  lastUpdated: string;
  note: string;
  rule: Omit<PayRule, 'currency' | 'baseHourlyRate'>;
};

// NOTE: These are practical default presets for estimation, not legal advice.
export const COUNTRY_RULE_PRESETS: CountryRulePreset[] = [
  {
    code: 'US',
    name: 'United States (default federal-style estimate)',
    defaultCurrency: 'USD',
    lastUpdated: '2026-03-13',
    note: 'Typical estimate: overtime after 40h/week, holiday rule configurable by employer/state.',
    rule: {
      overtimeThresholdWeeklyHours: 40,
      overtimeMultiplier: 1.5,
      nightStartMinutes: 22 * 60,
      nightEndMinutes: 6 * 60,
      nightMultiplier: 1.1,
      holidayMultiplier: 2.0,
    },
  },
  {
    code: 'PH',
    name: 'Philippines (common estimate template)',
    defaultCurrency: 'PHP',
    lastUpdated: '2026-03-13',
    note: 'Night differential commonly applied 10pm-6am; exact pay depends on day type and labor rules.',
    rule: {
      overtimeThresholdWeeklyHours: 40,
      overtimeMultiplier: 1.25,
      nightStartMinutes: 22 * 60,
      nightEndMinutes: 6 * 60,
      nightMultiplier: 1.1,
      holidayMultiplier: 2.0,
    },
  },
  {
    code: 'AU',
    name: 'Australia (award-dependent estimate template)',
    defaultCurrency: 'AUD',
    lastUpdated: '2026-03-13',
    note: 'Award/enterprise agreements vary; this is a baseline estimate only.',
    rule: {
      overtimeThresholdWeeklyHours: 38,
      overtimeMultiplier: 1.5,
      nightStartMinutes: 22 * 60,
      nightEndMinutes: 6 * 60,
      nightMultiplier: 1.15,
      holidayMultiplier: 2.0,
    },
  },
];

export function getCountryPreset(code: CountryCode): CountryRulePreset | undefined {
  return COUNTRY_RULE_PRESETS.find((x) => x.code === code);
}

export function buildPayRuleFromCountry(
  code: CountryCode,
  baseHourlyRate: number,
  currency?: string,
): PayRule {
  const preset = getCountryPreset(code);
  if (!preset) {
    return {
      currency: currency ?? 'USD',
      baseHourlyRate,
      overtimeThresholdWeeklyHours: 40,
      overtimeMultiplier: 1.5,
      nightStartMinutes: 22 * 60,
      nightEndMinutes: 6 * 60,
      nightMultiplier: 1.2,
      holidayMultiplier: 2,
    };
  }

  return {
    currency: currency ?? preset.defaultCurrency,
    baseHourlyRate,
    ...preset.rule,
  };
}
