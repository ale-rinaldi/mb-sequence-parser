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
| 0E-0E   | Delete in case of failure (boolean)                                                   |
| 0F-13   | ?                                                                                     |
| 14-17   | Maximum duration (in seconds, it's a float32 but seems to be always an integer value) |
| 18-18   | Sequence disabled                                                                     |
| 19-188  | ?                                                                                     |
| 189-1A8 | Title                                                                                 |
| 1A9-1C0 | Type                                                                                  |
| 1C1-3E7 | ?                                                                                     |

From 3E8, a series of 40 objects begin, each of them has a length of 972 bytes (hex 3CC). At the end of each object, another one begins, with no separators.
It seems that the last object is different all the other ones (it's composed by "00"s only), so I'm not sure if it can be used or if it's just a padding.

## Object structure (WIP)

| Hex   | Content                                                                                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00-00 | Type of object (01=random song, 02=minilist, 04=static file, 05=event or time/date announcement, 08=executable, 09=external stream, 0A=YouTube, 0B=synthetized voice) |
