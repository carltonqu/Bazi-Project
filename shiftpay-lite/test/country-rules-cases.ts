import { buildPayRuleFromCountry, COUNTRY_RULE_PRESETS } from '../src/countryRules';

console.log('presets:', COUNTRY_RULE_PRESETS.map((x) => x.code));
console.log('US:', buildPayRuleFromCountry('US', 20, 'USD'));
console.log('PH:', buildPayRuleFromCountry('PH', 20, 'USD'));
console.log('AU:', buildPayRuleFromCountry('AU', 20, 'USD'));
