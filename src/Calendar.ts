enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

class Calendar {
  public days: Day[] = [];
  public months: Month[] = [];
  public evenDays: boolean = false;
  public oddDays: boolean = false;
  public evenWeeks: boolean = false;
  public oddWeeks: boolean = false;
  public weekDays: boolean = false;
  public holidays: boolean = false;
  public startDate: Date = new Date(0);
  public endDate: Date = new Date(0);
}

export { Calendar, Day, Month };
