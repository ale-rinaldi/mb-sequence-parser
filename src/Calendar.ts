var Holidays = require("date-holidays");
var hd = new Holidays("IT");

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

enum InvalidDayReason {
  NotStarted,
  Ended,
  DisabledDay,
  DisabledMonth,
  OddEvenDay,
  OddEvenWeek,
  WeekDayHoliday,
}

const Holidayys = [
  new Date("1970-01-01T00:00:00"),
  new Date("1970-01-06T00:00:00"),
  new Date("1970-04-25T00:00:00"),
  new Date("1970-05-01T00:00:00"),
  new Date("1970-06-02T00:00:00"),
  new Date("1970-08-15T00:00:00"),
  new Date("1970-11-01T00:00:00"),
  new Date("1970-12-08T00:00:00"),
  new Date("1970-12-25T00:00:00"),
  new Date("1970-12-26T00:00:00"),
];

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

  private trueIfEqualsOrFirst(first: boolean, second: boolean) {
    if (first === second) {
      return true;
    }
    return first;
  }

  public static getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return weekNo;
  }

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

  public isEnabledDayOn(date: Date): boolean {
    return this.days.indexOf(date.getDay()) > -1;
  }

  public isEnabledMonthOn(date: Date): boolean {
    return this.months.indexOf(date.getMonth()) > -1;
  }

  public onEvenDays() {
    return this.trueIfEqualsOrFirst(this.evenDays, this.oddDays);
  }

  public onOddDays() {
    return this.trueIfEqualsOrFirst(this.oddDays, this.evenDays);
  }

  public onEvenWeeks() {
    return this.trueIfEqualsOrFirst(this.evenWeeks, this.oddWeeks);
  }

  public onOddWeeks() {
    return this.trueIfEqualsOrFirst(this.oddWeeks, this.evenWeeks);
  }

  public onWeekDays() {
    return this.trueIfEqualsOrFirst(this.weekDays, this.holidays);
  }

  public onHolidays() {
    return this.trueIfEqualsOrFirst(this.holidays, this.weekDays);
  }

  public static isHolidayOn(date: Date) {
    if ([0, 6].indexOf(date.getDay()) > -1) {
      return true;
    }
    return !!hd.isHoliday(date);
  }

  public getInvalidDayReasonsOn(date: Date) {
    let reasons: InvalidDayReason[] = [];

    if (!this.isStartedOn(date)) reasons.push(InvalidDayReason.NotStarted);

    if (this.isEndedOn(date)) reasons.push(InvalidDayReason.Ended);

    if (!this.isEnabledDayOn(date)) reasons.push(InvalidDayReason.DisabledDay);

    if (!this.isEnabledMonthOn(date))
      reasons.push(InvalidDayReason.DisabledMonth);

    if (!(date.getDate() % 2 === 0 ? this.onEvenDays() : this.onOddDays()))
      reasons.push(InvalidDayReason.OddEvenDay);

    if (
      !(Calendar.getWeekNumber(date) % 2 === 0
        ? this.onEvenWeeks()
        : this.onOddWeeks())
    )
      reasons.push(InvalidDayReason.OddEvenWeek);

    if (!(Calendar.isHolidayOn(date) ? this.onHolidays() : this.onWeekDays()))
      reasons.push(InvalidDayReason.WeekDayHoliday);

    return reasons;
  }

  public isValidDayOn(date: Date) {
    return this.getInvalidDayReasonsOn(date).length === 0;
  }

  public getInvalidDayReasons() {
    return this.getInvalidDayReasonsOn(new Date());
  }

  public isValidDay() {
    return this.isValidDayOn(new Date());
  }
}

export { Calendar, Day, Month, InvalidDayReason };
