import { describe, expect, it } from 'vitest';
import {
  addDays,
  formatDateToISO,
  isFirstWorkdayOfMonth,
  isFirstWorkdayOfWeek,
  isHoliday,
  isSameDay,
  isWorkday,
  parseISODate as iso
} from './dateUtils';

describe('formatDateToISO / parseISODate', () => {
  it('pads month and day', () => {
    expect(formatDateToISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('round-trips in local time, not UTC', () => {
    // A UTC-based implementation shifts this by a day in negative offsets.
    expect(formatDateToISO(iso('2026-03-01'))).toBe('2026-03-01');
  });
});

describe('addDays', () => {
  it('crosses a month boundary', () => {
    expect(formatDateToISO(addDays(iso('2026-01-31'), 1))).toBe('2026-02-01');
  });

  it('crosses a year boundary backwards', () => {
    expect(formatDateToISO(addDays(iso('2026-01-01'), -1))).toBe('2025-12-31');
  });

  it('does not mutate its argument', () => {
    const d = iso('2026-01-31');
    addDays(d, 5);
    expect(formatDateToISO(d)).toBe('2026-01-31');
  });

  it('handles the DST spring-forward day', () => {
    // Germany switches on 2026-03-29; day arithmetic must stay calendar-based.
    expect(formatDateToISO(addDays(iso('2026-03-28'), 1))).toBe('2026-03-29');
    expect(formatDateToISO(addDays(iso('2026-03-29'), 1))).toBe('2026-03-30');
  });
});

describe('isSameDay', () => {
  it('ignores the time of day', () => {
    expect(isSameDay(new Date(2026, 5, 1, 0, 0), new Date(2026, 5, 1, 23, 59))).toBe(true);
  });

  it('separates the same day-of-month in different years', () => {
    expect(isSameDay(new Date(2026, 5, 1), new Date(2027, 5, 1))).toBe(false);
  });
});

describe('isHoliday', () => {
  // Bundesweite Feiertage per the design handoff.
  const holidays2026 = [
    '2026-01-01', // Neujahr
    '2026-04-03', // Karfreitag
    '2026-04-06', // Ostermontag
    '2026-05-01', // Tag der Arbeit
    '2026-05-14', // Christi Himmelfahrt
    '2026-05-25', // Pfingstmontag
    '2026-10-03', // Tag der Deutschen Einheit
    '2026-12-25',
    '2026-12-26'
  ];

  it.each(holidays2026)('%s is a holiday', (day) => {
    expect(isHoliday(iso(day))).toBe(true);
  });

  it('marks no other day in 2026 as a holiday', () => {
    const found: string[] = [];
    for (let d = iso('2026-01-01'); d.getFullYear() === 2026; d = addDays(d, 1)) {
      if (isHoliday(d)) found.push(formatDateToISO(d));
    }
    expect(found).toEqual(holidays2026);
  });

  it('tracks Easter into other years', () => {
    expect(isHoliday(iso('2027-03-26'))).toBe(true); // Karfreitag 2027
    expect(isHoliday(iso('2025-04-18'))).toBe(true); // Karfreitag 2025
    expect(isHoliday(iso('2027-04-03'))).toBe(false);
  });

  it('does not treat regional holidays as bundesweit', () => {
    expect(isHoliday(iso('2026-01-06'))).toBe(false); // Heilige Drei Könige
    expect(isHoliday(iso('2026-11-01'))).toBe(false); // Allerheiligen
  });
});

describe('isWorkday', () => {
  it('accepts Mon-Fri', () => {
    expect(isWorkday(iso('2026-09-07'))).toBe(true); // Monday
    expect(isWorkday(iso('2026-09-11'))).toBe(true); // Friday
  });

  it('rejects the weekend', () => {
    expect(isWorkday(iso('2026-09-05'))).toBe(false); // Saturday
    expect(isWorkday(iso('2026-09-06'))).toBe(false); // Sunday
  });

  it('rejects a holiday that falls on a weekday', () => {
    expect(isWorkday(iso('2026-05-01'))).toBe(false); // Friday, Tag der Arbeit
  });
});

describe('isFirstWorkdayOfWeek', () => {
  it('is the Monday of an ordinary week', () => {
    expect(isFirstWorkdayOfWeek(iso('2026-09-07'))).toBe(true);
    expect(isFirstWorkdayOfWeek(iso('2026-09-08'))).toBe(false);
  });

  it('moves to Tuesday when the Monday is a holiday', () => {
    expect(isFirstWorkdayOfWeek(iso('2026-04-06'))).toBe(false); // Ostermontag
    expect(isFirstWorkdayOfWeek(iso('2026-04-07'))).toBe(true);
    expect(isFirstWorkdayOfWeek(iso('2026-04-08'))).toBe(false);
  });

  it('is never a weekend day', () => {
    expect(isFirstWorkdayOfWeek(iso('2026-09-06'))).toBe(false); // Sunday
  });

  it('does not look back past Monday into the previous week', () => {
    // Friday 2026-05-01 is a holiday, so the week Mon 2026-04-27.. still starts
    // on its own Monday and the following Monday is unaffected.
    expect(isFirstWorkdayOfWeek(iso('2026-05-04'))).toBe(true);
  });
});

describe('isFirstWorkdayOfMonth', () => {
  it('is the 1st when it is a workday', () => {
    expect(isFirstWorkdayOfMonth(iso('2026-09-01'))).toBe(true); // Tuesday
    expect(isFirstWorkdayOfMonth(iso('2026-09-02'))).toBe(false);
  });

  it('skips a weekend at the start of the month', () => {
    expect(isFirstWorkdayOfMonth(iso('2026-08-01'))).toBe(false); // Saturday
    expect(isFirstWorkdayOfMonth(iso('2026-08-03'))).toBe(true); // Monday
  });

  it('skips a holiday on the 1st', () => {
    expect(isFirstWorkdayOfMonth(iso('2026-01-01'))).toBe(false); // Neujahr, Thursday
    expect(isFirstWorkdayOfMonth(iso('2026-01-02'))).toBe(true); // Friday
  });
});
