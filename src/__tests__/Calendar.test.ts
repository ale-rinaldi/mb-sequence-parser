import { Calendar } from "../Calendar";

const emptyCalendar = new Calendar();
const startEndDate = new Calendar();
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
