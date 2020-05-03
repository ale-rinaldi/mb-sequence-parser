import FileReader from "../FileReader";

const TEST_PATH = "./src/__tests__/test_files";

test("Throw error on non-existing file", () => {
  expect(() => new FileReader("./not-existing-file.dat")).toThrow();
});

test("Correctly skip bytes", () => {
  let file = new FileReader(`${TEST_PATH}/26-bytes-file.dat`);
  let string = file.readBytes(5, true).toString();
  expect(string).toBe("ABCDE");
  file.skipBytes(8);
  string = file.readBytes(6, true).toString();
  expect(string).toBe("NOPQRS");
  file.close();
});

test("Don't throw on overflow if exact not set", () => {
  let file = new FileReader(`${TEST_PATH}/26-bytes-file.dat`);
  file.skipBytes(20);
  let buf = file.readBytes(10, false);
  expect(buf.length).toBe(6);
  expect(buf.toString()).toBe("UVWXYZ");
});

test("Don't throw on overflow if exact set", () => {
  let file = new FileReader(`${TEST_PATH}/26-bytes-file.dat`);
  file.skipBytes(20);
  expect(() => file.readBytes(10, true)).toThrow("Unexpected EOF");
});

test("Don't throw if skipped over end of file", () => {
  let file = new FileReader(`${TEST_PATH}/26-bytes-file.dat`);
  file.skipBytes(30);
  let buf = file.readBytes(10, false);
  expect(buf.length).toBe(0);
  expect(buf.toString()).toBe("");
});
