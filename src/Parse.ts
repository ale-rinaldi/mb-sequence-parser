import Sequence from "./Sequence";
import * as fs from "fs";
import FileReader from "./FileReader";
import { FILE } from "dns";
import SequenceObject from "./Object";
import ObjectType from "./ObjectType";
import * as iconv from "iconv-lite";

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
    sequence.onAirTime = new Date(onAirDateInt * 1000);

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
    sequence.forcedTime = new Date(forcedTimeInt * 1000);

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

    // 1C1-3E7: ?
    file.skipBytes(0x227);

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
    let obj = new SequenceObject(objType);
    // TODO: parse the object information. Skip all of its byte for now
    file.skipBytes(0x3cb);
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

export default parseSequencesFile;
