import Sequence from "./Sequence";
import FileReader from "./FileReader";
import SequenceObject from "./Object";
import ObjectType from "./ObjectType";
import { Calendar, Day, Month } from "./Calendar";
import * as iconv from "iconv-lite";

// Add days to a date
function addDays(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseSequencesFile(path: string): Sequence[] {
  // Open the file
  let file = new FileReader(path);

  // Ignore the first 3 bytes (version info)
  file.readBytes(3, true);

  let fileType = file.readBytes(1, true);
  if (fileType.length != 1 || fileType[0] != 0x41) {
    throw `Wrong file type ${fileType[0]}: are you sure this is a Sequences.dat file?`;
  }

  return parseSequences(file);
}

function parseSequences(file: FileReader): Sequence[] {
  let result: Sequence[] = [];
  while (true) {
    // Parse the on air date
    let buf = file.readBytes(4, false);
    // If there are 0 bytes left, the file is ended
    if (buf.length === 0) {
      file.close();
      return result;
    }

    // 00-03: On air time (Unix timestamp, the date is always 01/01/1970)
    if (buf.length !== 4) {
      file.close();
      throw "Cannot read sequence start date";
    }
    let sequence = new Sequence();
    let onAirDateInt = buf.readInt32LE();
    let offset = new Date(0).getTimezoneOffset() * 60;
    sequence.onAirTime = new Date((onAirDateInt + offset) * 1000);

    // 04-04: Liner identifier (int)
    buf = file.readBytes(1, true);
    sequence.liner = buf.readInt8();

    // 05-05: bitwise AND (1: forced, 2: ends at time)
    buf = file.readBytes(1, true);
    sequence.forced = (buf[0] & 1) === 1;
    sequence.endsAtTime = (buf[0] & 2) === 2;

    // 06-07: ?
    file.skipBytes(2);

    // 08-0B: Forced time (Unix timestamp, the date is always 01/01/1970)
    buf = file.readBytes(4, true);
    let forcedTimeInt = buf.readInt32LE();
    sequence.forcedTime = new Date((forcedTimeInt + offset) * 1000);

    // 0C-0C: Allow rotation (boolean)
    buf = file.readBytes(1, true);
    sequence.allowRotation = buf[0] !== 0;

    // 0D-0D: ?
    file.skipBytes(1);

    // 0E-0E: Remove in case of failure (boolean)
    buf = file.readBytes(1, true);
    sequence.removeOnFailure = buf[0] !== 0;

    // 0F-13: ?
    file.skipBytes(5);

    // 14-17: Maximum duration (in seconds, it's a float32 but seems to be always an integer value)
    buf = file.readBytes(4, true);
    let maxDurationFloat = buf.readFloatLE();
    sequence.maximumDuration = Math.round(maxDurationFloat);

    // 18-18: Sequence disabled
    buf = file.readBytes(1, true);
    sequence.disabled = buf[0] !== 0;

    // 19-188: ?
    file.skipBytes(0x170);

    // 189-1A8: Title
    buf = file.readBytes(0x20, true);
    sequence.title = iconv.decode(buf, "ISO-8859-1").trim();

    // 1A9-1C0: Type
    buf = file.readBytes(0x18, true);
    sequence.type = iconv.decode(buf, "ISO-8859-1").trim();

    // 1C1-1D3: ?
    file.skipBytes(0x13);

    // 1D4-1E1: Calendar
    sequence.calendar = parseCalendar(file);

    // 1E2-3E7: ?
    file.skipBytes(0x206);

    sequence.objects = parseSequenceObjects(file);

    result.push(sequence);
  }
}

function parseSequenceObjects(file: FileReader): SequenceObject[] {
  let result: SequenceObject[] = [];
  for (let x = 0; x < 40; x++) {
    // Get the object type
    let buf = file.readBytes(1, true);
    let objType = parseObjectType(buf.readInt8());
    // Skip if null
    if (objType === ObjectType.Null) {
      file.skipBytes(0x3cb);
      continue;
    }
    let obj: SequenceObject;
    // For now, only static files are parsed.
    switch (objType) {
      case ObjectType.StaticFile:
        obj = parseStaticFileObject(file);
        break;
      default:
        obj = new SequenceObject(objType);
        file.skipBytes(0x3cb);
    }
    result.push(obj);
  }
  return result;
}

function parseObjectType(type: number): ObjectType {
  switch (type) {
    case 1:
      return ObjectType.RandomSong;
    case 2:
      return ObjectType.MiniList;
    case 4:
      return ObjectType.StaticFile;
    case 5:
      return ObjectType.Event;
    case 8:
      return ObjectType.Executable;
    case 9:
      return ObjectType.ExternalStream;
    case 10:
      return ObjectType.YouTube;
    case 11:
      return ObjectType.SynthVoice;
  }
  return ObjectType.Null;
}

// For now, parses file name and path only
function parseStaticFileObject(file: FileReader): SequenceObject {
  let obj = new SequenceObject(ObjectType.StaticFile);

  // 01-0B: ?
  file.skipBytes(11);

  // 0C-8B: File name
  let buf = file.readBytes(0x80, true);
  obj.fileName = iconv.decode(buf, "ISO-8859-1").trim();

  // 8C-10B: File path
  buf = file.readBytes(0x80, true);
  obj.filePath = iconv.decode(buf, "ISO-8859-1").trim();

  // 10C-1B7: ?
  file.skipBytes(0xac);

  // 1B8-1C5: Calendar
  obj.calendar = parseCalendar(file);

  // 1C6-3CB: ?
  file.skipBytes(0x206);
  return obj;
}

function parseCalendar(file: FileReader): Calendar {
  let cal = new Calendar();

  // 00-03: ? (Someting related to calendar, it's FF FF FF 7F before saving the first time and becomes 00 00 00 00 after first save)
  file.skipBytes(4);

  // 04-04: 1: Sunday, 2: Monday, 4: Tuesday, 8: Wednesday, 16: Thursday, 32: Friday, 64: Saturday, 128: Even days
  let buf = file.readBytes(1, true);
  (buf[0] & 1) === 1 && cal.days.push(Day.Sunday);
  (buf[0] & 2) === 2 && cal.days.push(Day.Monday);
  (buf[0] & 4) === 4 && cal.days.push(Day.Tuesday);
  (buf[0] & 8) === 8 && cal.days.push(Day.Wednesday);
  (buf[0] & 16) === 16 && cal.days.push(Day.Thursday);
  (buf[0] & 32) === 32 && cal.days.push(Day.Friday);
  (buf[0] & 64) === 64 && cal.days.push(Day.Saturday);
  cal.evenDays = (buf[0] & 128) === 128;

  // 05-05: 1: Odd day, 2: even weeks, 4: odd weeks, 8: weekdays, 16: holidays
  buf = file.readBytes(1, true);
  cal.oddDays = (buf[0] & 1) === 1;
  cal.evenWeeks = (buf[0] & 2) === 2;
  cal.oddWeeks = (buf[0] & 4) === 4;
  cal.weekDays = (buf[0] & 8) === 8;
  cal.holidays = (buf[0] & 16) === 16;

  // 06-06: 1: January, 2: February, 4: March, 8: April, 16: May, 32: June, 64: July, 128: August
  buf = file.readBytes(1, true);
  (buf[0] & 1) === 1 && cal.months.push(Month.January);
  (buf[0] & 2) === 2 && cal.months.push(Month.February);
  (buf[0] & 4) === 4 && cal.months.push(Month.March);
  (buf[0] & 8) === 8 && cal.months.push(Month.April);
  (buf[0] & 16) === 16 && cal.months.push(Month.May);
  (buf[0] & 32) === 32 && cal.months.push(Month.June);
  (buf[0] & 64) === 64 && cal.months.push(Month.July);
  (buf[0] & 128) === 128 && cal.months.push(Month.August);

  // 07-07: 1: September, 2: October, 4: November, 8: December
  buf = file.readBytes(1, true);
  (buf[0] & 1) === 1 && cal.months.push(Month.September);
  (buf[0] & 2) === 2 && cal.months.push(Month.October);
  (buf[0] & 4) === 4 && cal.months.push(Month.November);
  (buf[0] & 8) === 8 && cal.months.push(Month.December);

  // 08-09: Start date (number of days since Dec 30, 1899), or 00 00 for null (always active)
  buf = file.readBytes(2, true);
  let days = buf.readUInt16LE();
  if (days === 0) {
    cal.startDate = new Date(0);
  } else {
    cal.startDate = addDays(new Date("1899-12-30T00:00:00"), days);
  }

  // 0A-0B: ?
  file.skipBytes(2);

  // 0C-0D: End date (number of days since Dec 30, 1899), or 00 00 for null (always active)
  buf = file.readBytes(2, true);
  days = buf.readUInt16LE();
  if (days === 0) {
    cal.endDate = new Date(0);
  } else {
    cal.endDate = addDays(new Date("1899-12-30T00:00:00"), days);
  }

  return cal;
}

export default parseSequencesFile;
