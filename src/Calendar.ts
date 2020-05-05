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

  public isStartedOn(date: Date): boolean {
    // If the event has not start date, it's always started
    if (this.startDate.getTime() === 0) {
      return true;
    }
    return date.getTime() >= new Date(this.startDate).setHours(0, 0, 0, 0);
  }

  public isEndedOn(date: Date): boolean {
    // If the event has not end date, it's never ended
    if (this.endDate.getTime() === 0) {
      return false;
    }
    return date.getTime() >= new Date(this.endDate).setHours(24, 0, 0, 0);
  }

  public isStartedAndNotEndedOn(date: Date): boolean {
    return this.isStartedOn(date) && !this.isEndedOn(date);
  }
}

export { Calendar, Day, Month };
