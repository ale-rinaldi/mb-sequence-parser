import { Greeter } from "../SequencesFile";

test("My Greeter", () => {
  expect(Greeter("Carl")).toBe("Hello Carl");
});
