# ShiftPay Lite

MVP for shift scheduling and wage calculation.

## Scope (v1)
- Add/edit/delete shifts
- Weekly pay period summary
- Wage calculation with:
  - regular hours
  - overtime (>40h/week by default)
  - night differential (22:00-06:00)
  - holiday multiplier
- CSV export-ready data model

## Defaults
- Currency: USD
- Launch: Global
- Overtime threshold: 40h/week
- Overtime multiplier: 1.5x
- Night hours: 22:00-06:00
- Night multiplier: 1.2x
- Holiday multiplier: 2.0x

## Project structure
- `src/types.ts` domain types
- `src/payEngine.ts` core wage engine
- `src/index.ts` usage example
- `test/manual-cases.ts` deterministic test scenarios
- `docs/spec.md` product/logic specification

## Next build steps
1. Wrap engine into React Native UI screens
2. Local persistence (SQLite)
3. CSV import/export utilities
4. IAP paywall (Free/Pro)
5. TestFlight packaging
