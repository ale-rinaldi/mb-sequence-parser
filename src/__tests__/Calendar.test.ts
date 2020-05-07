import { Calendar, Day, Month } from "../Calendar";

let emptyCalendar = new Calendar();
let startEndDate = new Calendar();
startEndDate.startDate = new Date("2020-05-04T00:00:00");
startEndDate.endDate = new Date("2020-05-18T00:00:00");

test("Calendar is started on", () => {
  expect(emptyCalendar.isStartedOn(new Date("2002-05-14T08:33:42"))).toBe(true);
  expect(startEndDate.isStartedOn(new Date("2020-03-02T01:25:33"))).toBe(false);
  expect(startEndDate.isStartedOn(new Date("2020-05-03T16:23:33"))).toBe(false);
  expect(startEndDate.isStartedOn(new Date("2020-05-03T23:59:59"))).toBe(false);
  expect(startEndDate.isStartedOn(new Date("2020-05-04T00:00:00"))).toBe(true);
  expect(startEndDate.isStartedOn(new Date("2020-05-04T14:23:42"))).toBe(true);
  expect(startEndDate.isStartedOn(new Date("2020-07-14T15:42:16"))).toBe(true);
});

test("Calendar is ended on", () => {
  expect(emptyCalendar.isEndedOn(new Date("2026-05-14T08:33:42"))).toBe(false);
  expect(startEndDate.isEndedOn(new Date("2020-03-02T01:25:33"))).toBe(false);
  expect(startEndDate.isEndedOn(new Date("2020-05-18T16:23:33"))).toBe(false);
  expect(startEndDate.isEndedOn(new Date("2020-05-18T23:59:59"))).toBe(false);
  expect(startEndDate.isEndedOn(new Date("2020-05-19T00:00:00"))).toBe(true);
  expect(startEndDate.isEndedOn(new Date("2020-05-19T14:23:42"))).toBe(true);
  expect(startEndDate.isEndedOn(new Date("2020-07-14T15:42:16"))).toBe(true);
});

test("On odd days", () => {
  const calendar = new Calendar();
  expect(calendar.onOddDays()).toBe(true);
  calendar.evenDays = true;
  expect(calendar.onOddDays()).toBe(false);
  calendar.oddDays = true;
  expect(calendar.onOddDays()).toBe(true);
  calendar.evenDays = false;
  expect(calendar.onOddDays()).toBe(true);
});

test("On even days", () => {
  const calendar = new Calendar();
  expect(calendar.onEvenDays()).toBe(true);
  calendar.oddDays = true;
  expect(calendar.onEvenDays()).toBe(false);
  calendar.evenDays = true;
  expect(calendar.onEvenDays()).toBe(true);
  calendar.oddDays = false;
  expect(calendar.onEvenDays()).toBe(true);
});

test("On odd weeks", () => {
  const calendar = new Calendar();
  expect(calendar.onOddWeeks()).toBe(true);
  calendar.evenWeeks = true;
  expect(calendar.onOddWeeks()).toBe(false);
  calendar.oddWeeks = true;
  expect(calendar.onOddWeeks()).toBe(true);
  calendar.evenWeeks = false;
  expect(calendar.onOddWeeks()).toBe(true);
});

test("On even days", () => {
  const calendar = new Calendar();
  expect(calendar.onEvenWeeks()).toBe(true);
  calendar.oddWeeks = true;
  expect(calendar.onEvenWeeks()).toBe(false);
  calendar.evenWeeks = true;
  expect(calendar.onEvenWeeks()).toBe(true);
  calendar.oddWeeks = false;
  expect(calendar.onEvenWeeks()).toBe(true);
});

test("On week days", () => {
  const calendar = new Calendar();
  expect(calendar.onWeekDays()).toBe(true);
  calendar.holidays = true;
  expect(calendar.onWeekDays()).toBe(false);
  calendar.weekDays = true;
  expect(calendar.onWeekDays()).toBe(true);
  calendar.holidays = false;
  expect(calendar.onWeekDays()).toBe(true);
});

test("On holidays", () => {
  const calendar = new Calendar();
  expect(calendar.onHolidays()).toBe(true);
  calendar.weekDays = true;
  expect(calendar.onHolidays()).toBe(false);
  calendar.holidays = true;
  expect(calendar.onHolidays()).toBe(true);
  calendar.weekDays = false;
  expect(calendar.onHolidays()).toBe(true);
});

test("Is holiday on", () => {
  // Ultimo dell'anno (non festivo)
  expect(Calendar.isHolidayOn(new Date("2015-12-31T23:59:59"))).toBe(false);
  // Capodanno (festivo)
  expect(Calendar.isHolidayOn(new Date("2016-01-01T00:00:00"))).toBe(true);
  // 25 aprile (festivo)
  expect(Calendar.isHolidayOn(new Date("2014-04-25T15:23:42"))).toBe(true);
  // 5 maggio (non festivo)
  expect(Calendar.isHolidayOn(new Date("2020-05-05T15:23:42"))).toBe(false);
  // 19 aprile (domenica)
  expect(Calendar.isHolidayOn(new Date("2020-04-19T15:23:42"))).toBe(true);
  // 25 aprile (domenica, festivo)
  expect(Calendar.isHolidayOn(new Date("2020-04-25T23:23:42"))).toBe(true);
  // Pasquetta (festivo)
  expect(Calendar.isHolidayOn(new Date("2014-04-21T15:42:16"))).toBe(true);
});

test("Get week number", () => {
  expect(Calendar.getWeekNumber(new Date("2015-12-31T23:59:59"))).toBe(53);
  // First days of year belong to the week of the previous one
  expect(Calendar.getWeekNumber(new Date("2016-01-01T00:00:00"))).toBe(53);
  expect(Calendar.getWeekNumber(new Date("2016-01-02T00:00:00"))).toBe(53);
  // From next monday, it should be week 1
  expect(Calendar.getWeekNumber(new Date("2016-01-03T23:59:59"))).toBe(53);
  expect(Calendar.getWeekNumber(new Date("2016-01-04T00:00:00"))).toBe(1);
  expect(Calendar.getWeekNumber(new Date("2018-07-15T00:00:00"))).toBe(28);
});

test("Is enabled day on", () => {
  let saturdayAndWednesday = new Calendar();
  saturdayAndWednesday.days = [Day.Wednesday, Day.Saturday];
  expect(
    saturdayAndWednesday.isEnabledDayOn(new Date("2016-06-18T15:24:31"))
  ).toBe(true);
  expect(
    saturdayAndWednesday.isEnabledDayOn(new Date("2016-06-18T23:59:59"))
  ).toBe(true);
  expect(
    saturdayAndWednesday.isEnabledDayOn(new Date("2016-06-19T00:00:00"))
  ).toBe(false);
  expect(
    saturdayAndWednesday.isEnabledDayOn(new Date("2016-05-11T06:41:03"))
  ).toBe(true);
  expect(
    saturdayAndWednesday.isEnabledDayOn(new Date("2020-05-06T13:23:11"))
  ).toBe(true);
});

test("Is enabled month on", () => {
  let aprilAndNovember = new Calendar();
  aprilAndNovember.months = [Month.April, Month.November];
  expect(
    aprilAndNovember.isEnabledMonthOn(new Date("2010-06-18T15:24:31"))
  ).toBe(false);
  expect(
    aprilAndNovember.isEnabledMonthOn(new Date("2016-11-18T23:59:59"))
  ).toBe(true);
  expect(
    aprilAndNovember.isEnabledMonthOn(new Date("2013-05-19T00:00:00"))
  ).toBe(false);
  expect(
    aprilAndNovember.isEnabledMonthOn(new Date("2015-05-11T06:41:03"))
  ).toBe(false);
  expect(
    aprilAndNovember.isEnabledMonthOn(new Date("2020-04-06T13:23:11"))
  ).toBe(true);
});

test("Is right day on", () => {
  let calendar = new Calendar();
  calendar.days = [Day.Sunday, Day.Thursday, Day.Friday];
  calendar.months = [Month.January, Month.October];
  calendar.oddDays = true;
  calendar.evenWeeks = true;
  calendar.weekDays = true;
  calendar.startDate = new Date("2020-03-21T00:00:00");
  calendar.endDate = new Date("2021-05-11T00:00:00");
  expect(calendar.isValidDayOn(new Date("2020-10-15T00:00:00"))).toBe(true);
  expect(calendar.isValidDayOn(new Date("2020-10-16T00:00:00"))).toBe(false);
});
