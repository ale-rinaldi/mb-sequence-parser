import * as fs from "fs";

class FileReader {
  private fd: number | undefined;
  private offset: number = 0;

  constructor(path: string) {
    this.fd = fs.openSync(path, "r");
  }

  readBytes(bytes: number, exact: boolean): Buffer {
    let result = Buffer.alloc(bytes);
    if (this.fd === undefined) {
      throw "No file opened";
    }
    let read = fs.readSync(this.fd, result, 0, bytes, this.offset);
    this.offset += bytes;
    if (read === bytes) {
      return result;
    }
    if (exact) {
      this.close();
      throw "Unexpected EOF";
    }
    return result.slice(0, read);
  }

  skipBytes(bytes: number) {
    this.offset += bytes;
  }

  close() {
    if (this.fd === undefined) {
      throw "No file opened";
    }
    fs.closeSync(this.fd);
  }
}

export default FileReader;
