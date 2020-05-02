# mb-sequence-parser

A Node.js library to parse MB Studio spot Sequences.dat binary files. It can be useful to migrate MB Studio spot setup to another automation software.

The file format specifications are obtained with clean-room design, no copyright infringement intended.

## Status

This is currently a work-in-progress. It's not intended to parse everything the file contains from the beginning, but I will expand the information it exctracts as I'll need them. If you need to extract something that isn't implemented yet, feel free to open an issue or (even better) a pull request.  
In the `file-format` directory I'm also uploading some notes I'm taking while analyzing the binary files, as a help if you need to write a parser for another language or something like that.  
Editing files is currently not planned to be supported, if you need it please open an issue.
