# mb-sequence-parser

A Node.js library to parse MB Studio spot `Sequences.dat` binary files. It can be useful to migrate MB Studio spot setup to another automation software.

The file format specifications are obtained with clean-room design, no copyright infringement intended.

## Status

The library is working and well-tested. It can parse most of the data of the sequences, but only the file path and name of the static file objects.
It can also parse calendar data from both sequences and objects.
Virtually, everything the `Sequences.dat` file contains can be parsed and processed by this library, but I'm adding support for the fields as I need them.
If you need to access an unsupported field, feel free to open an issue. If you can, please attach a sample `Sequences.dat` file and detail what you exactly need to parse.

## Quick start

Run: `npm install mb-sequence-parser`

Then, in your code:

```javascript
const { parseSequencesFile, ObjectType } = require("mb-sequence-parser");

sequences = parseSequencesFile("C:\\MBStudio\\Sequences\\Sequences.dat");
console.log(sequences); // A quick way to see all the fields of the Sequence object
console.log(sequences[0].objects); // A quick way to see all the fields of the SequenceObject object
console.log(sequences[0].onAirTime);
console.log(sequences[0].objects[0].type);
if (sequences[0].objects[0].type === ObjectType.StaticFile) {
  console.log("First object of first sequence is a static file!");
  console.log(sequences[0].objects[0].fileName);
}
console.log(sequences[0].calendar.startDate);
console.log(sequences[0].objects[0].calendar.days);
```

## Dates

Please note that, since MB studio doesn't save dates in UTC but in the local timezone the `Sequences.dat` file is generated on, this module returns and compares all the dates in the local timezone, too. So, for them to be correct, you'll need to ensure the timezone of the system you use the module on matches the one MB Studio is running on.

## Types

The module is written in TypeScript and compiled in JavaScript with types definitions. You should be able to easily use it in your TypeScript project, without external types definitions, and even when you use it in JavaScript projects your editor should give you some type-hinting help.

## File format specifications

In the `file-format` directory you can find some notes I'm taking while analyzing the binary files, as a help if you need to write a parser for another language or something like that.
They're constantly being updated as I add support to new fields.
