# ShiftPay Lite Spec v1

## Core entities

### Shift
- id
- start (ISO datetime)
- end (ISO datetime)
- breakMinutes
- isHoliday
- note (optional)

### PayRule
- baseHourlyRate
- overtimeThresholdWeeklyHours (default 40)
- overtimeMultiplier (default 1.5)
- nightStartMinutes (default 22:00 => 1320)
- nightEndMinutes (default 06:00 => 360)
- nightMultiplier (default 1.2)
- holidayMultiplier (default 2.0)

### PayPeriod
- start (ISO datetime)
- end (ISO datetime)
- shifts[]

## Computation order
For each paid minute in a shift:
1. Determine whether the minute belongs to night window
2. Determine whether it belongs to overtime bucket (after regular weekly bucket exhausted)
3. Determine holiday multiplier from shift flag
4. Minute pay = baseRatePerMinute × overtime × night × holiday

Break minutes are deducted proportionally from the shift before categorization.

## Outputs
- totalMinutes
- regularMinutes
- overtimeMinutes
- nightMinutes
- holidayMinutes
- grossPay
- itemized list per shift

## Edge cases
- Cross-midnight shifts
- Break longer than shift duration (clamp to shift duration)
- Invalid shift end <= start (error)
- Multiple shifts in a week crossing overtime threshold
