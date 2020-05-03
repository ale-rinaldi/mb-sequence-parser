# Sequence.dat

The file is Little Endian.

| Hex   | Content                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------- |
| 00-02 | Version identification (I didn't investigate about the format, MB SPOT 8.64.5.1 sets 7B 14 0A) |
| 03-03 | Seems to be always 41 ("A")                                                                    |

From 04 a list of sequences begins.
Each sequence is 39880 bytes (hex 9BC8).  
At the end of each sequence, another one begins, with no separators.

## Sequence structure

| Hex     | Content                                                                               |
| ------- | ------------------------------------------------------------------------------------- |
| 00-03   | On air time (Unix timestamp, the date is always 01/01/1970)                           |
| 04-04   | Liner identifier (int)                                                                |
| 05-05   | bitwise AND (1: forced, 2: ends at time)                                              |
| 06-07   | ?                                                                                     |
| 08-0B   | Forced time (Unix timestamp, the date is always 01/01/1970)                           |
| 0C-0C   | Allow rotation (boolean)                                                              |
| 0D-0D   | ?                                                                                     |
| 0E-0E   | Remove in case of failure (boolean)                                                   |
| 0F-13   | ?                                                                                     |
| 14-17   | Maximum duration (in seconds, it's a float32 but seems to be always an integer value) |
| 18-18   | Sequence disabled                                                                     |
| 19-188  | ?                                                                                     |
| 189-1A8 | Title                                                                                 |
| 1A9-1C0 | Type                                                                                  |
| 1C1-1D3 | ?                                                                                     |
| 1D4-1E1 | Calendar (see section)                                                                |
| 1E2-3E7 | ?                                                                                     |

From 3E8, a series of 40 objects begin, each of them has a length of 972 bytes (hex 3CC). At the end of each object, another one begins, with no separators.
It seems that the last object is different all the other ones (it's composed by "00"s only), so I'm not sure if it can be used or if it's just a padding.

## Object structure

The object structure is different between each object type. The object type is identified from the first byte.
For now only the type 04, static file, is (really partially) documented.

### Type 04: static file

| Hex     | Content                                                                                                                                                               |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00-00   | Type of object (01=random song, 02=minilist, 04=static file, 05=event or time/date announcement, 08=executable, 09=external stream, 0A=YouTube, 0B=synthetized voice) |
| 01-0B   | ?                                                                                                                                                                     |
| 0C-8B   | File name                                                                                                                                                             |
| 8C-10B  | File path                                                                                                                                                             |
| 10C-1B7 | ?                                                                                                                                                                     |
| 1B8-1C5 | Calendar (see section)                                                                                                                                                |
| 1C6-3CB | ?                                                                                                                                                                     |

## Calendar structure

The calendar settings has a common format in both sequences and objects. Its length is 14 bytes (hex: E).

| Hex   | Content                                                                                                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------ |
| 00-03 | ? (Someting related to calendar, it's FF FF FF 7F before saving the first time and becomes 00 00 00 00 after first save) |
| 04-04 | 1: Sunday, 2: Monday, 4: Tuesday, 8: Wednesday, 16: Thursday, 32: Friday, 64: Saturday, 128: Even days                   |
| 05-05 | 1: Odd day, 2: even weeks, 4: odd weeks, 8: weekdays, 16: holidays                                                       |
| 06-06 | 1: January, 2: February, 4: March, 8: April, 16: May, 32: June, 64: July, 128: August                                    |
| 07-07 | 1: September, 2: October, 4: November, 8: December                                                                       |
| 08-09 | Start date (number of days since Dec 30, 1899), or 00 00 for null (always active)                                        |
| 0A-0B | ?                                                                                                                        |
| 0C-0D | End date (number of days since Dec 30, 1899), or 00 00 for null (always active)                                          |
