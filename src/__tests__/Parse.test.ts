import parser from "../Parse";

test("Throw error on non-existing file", () => {
  expect(() => parser("./not-existing-file.dat")).toThrow();
});
