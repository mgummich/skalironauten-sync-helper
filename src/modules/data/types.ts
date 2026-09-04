export interface YearInfo {
  date: string;       // e.g. "01.01.2026"
  weekday: string;    // e.g. "Donnerstag"
  full: string;       // e.g. "Donnerstag, 01.01.2026"
  is_workday: boolean;
}

export interface ActionDay {
  name: string;
  category: string;
  charakter: string;
  region: string;
  day_str: string;    // e.g. "01.01."
  month: number;      // 1-12
  day: number;        // 1-31
  beschreibung: string;
  quelle: string;
  "2026"?: YearInfo;
  "2027"?: YearInfo;
  [year: string]: YearInfo | string | number | undefined;
}

export interface CalendarDaySummary {
  date: Date;
  dateStr: string;     // YYYY-MM-DD
  formattedDate: string; // DD.MM.YYYY
  dayNumber: number;
  monthNumber: number;
  yearNumber: number;
  isWorkday: boolean;
  isFirstWorkdayOfWeek: boolean;
  isFirstWorkdayOfMonth: boolean;
  isToday: boolean;
  actionDays: ActionDay[];
}
