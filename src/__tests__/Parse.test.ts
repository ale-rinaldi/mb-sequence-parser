import parser from "../Parse";
import ObjectType from "../ObjectType";

const TEST_PATH = "./src/__tests__/test_files";

test("Throw error on non-existing file", () => {
  expect(() => parser("./not-existing-file.dat")).toThrow();
});

const sequences = parser(`${TEST_PATH}/Sequences.test.dat`);

test("Ensure there is the right number of sequences", () => {
  expect(sequences.length).toBe(8);
});

test("Sequence ending at time", () => {
  let sequence = sequences[0];
  expect(sequence.title).toBe("Seq. 1:26 termina alle");
  expect(sequence.type).toBe("INTRATTENIMENTO");
  expect(sequence.onAirTime).toStrictEqual(new Date(5160000));
  expect(sequence.objects.length).toBe(1);
  expect(sequence.endsAtTime).toBe(true);
  expect(sequence.forced).toBe(false);
  expect(sequence.objects[0].type).toBe(ObjectType.RandomSong);
});

test("Sequence with allow rotation and remove on failure", () => {
  let sequence = sequences[1];
  expect(sequence.title).toBe("Seq 3:42 rot rim 24.26");
  expect(sequence.type).toBe("Prova");
  expect(sequence.allowRotation).toBe(true);
  expect(sequence.removeOnFailure).toBe(true);
  expect(sequence.forced).toBe(false);
  expect(sequence.maximumDuration).toBe(1466);
  expect(sequence.objects.length).toBe(0);
});

test("Sequence with a liner", () => {
  let sequence = sequences[2];
  expect(sequence.title).toBe("Seq. 7.05 liner 1");
  expect(sequence.type).toBe("Pubblicità");
  expect(sequence.liner).toBe(1);
  expect(sequence.disabled).toBe(false);
});

test("Sequence with forced set", () => {
  let sequence = sequences[3];
  expect(sequence.title).toBe("Seq. 12:28:32 forz. 4:35");
  expect(sequence.type).toBe("Pubblicità");
  expect(sequence.forced).toBe(true);
  expect(sequence.endsAtTime).toBe(false);
  expect(sequence.forcedTime).toStrictEqual(new Date(275000));
});

test("Disabled sequence", () => {
  let sequence = sequences[4];
  expect(sequence.title).toBe("Seq. 15:02 rot dis");
  expect(sequence.type).toBe("INTRATTENIMENTO");
  expect(sequence.disabled).toBe(true);
});

test("Sequence with both set and terminate at", () => {
  let sequence = sequences[5];
  expect(sequence.title).toBe("Seq. 15:02:25 forz term");
  expect(sequence.type).toBe("Prova");
  expect(sequence.onAirTime).toStrictEqual(new Date(54145000));
  expect(sequence.forced).toBe(true);
  expect(sequence.endsAtTime).toBe(true);
  expect(sequence.objects.length).toBe(2);
  expect(sequence.objects[0].type).toBe(ObjectType.StaticFile);
  expect(sequence.objects[1].type).toBe(ObjectType.StaticFile);
});

test("Sequence with allow rotation", () => {
  let sequence = sequences[6];
  expect(sequence.title).toBe("Seq. 18:04 rotaz");
  expect(sequence.onAirTime).toStrictEqual(new Date(65040000));
  expect(sequence.allowRotation).toBe(true);
  expect(sequence.removeOnFailure).toBe(false);
});

test("Sequence with remove on failure", () => {
  let sequence = sequences[7];
  expect(sequence.title).toBe("Seq. 22:02 rim");
  expect(sequence.removeOnFailure).toBe(true);
});
