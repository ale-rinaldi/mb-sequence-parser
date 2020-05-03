import parser from "../Parse";
import ObjectType from "../ObjectType";
import Sequence from "../Sequence";

const TEST_PATH = "./src/__tests__/test_files";

test("Throw error on non-existing file", () => {
  expect(() => parser("./not-existing-file.dat")).toThrow();
});

test("Correctly parse a valid sequence", () => {
  let sequences = parser(`${TEST_PATH}/Sequences.test.dat`);
  expect(sequences.length).toBe(8);

  // Sequence 0
  let sequence = sequences[0];
  expect(sequence.title).toBe("Seq. 1:26 termina alle");
  expect(sequence.type).toBe("INTRATTENIMENTO");
  expect(sequence.onAirTime).toStrictEqual(new Date(5160000));
  expect(sequence.objects.length).toBe(1);
  expect(sequence.endsAtTime).toBe(true);
  expect(sequence.forced).toBe(false);
  expect(sequence.objects[0].type).toBe(ObjectType.RandomSong);

  // Sequence 1
  sequence = sequences[1];
  expect(sequence.title).toBe("Seq 3:42 rot rim 24.26");
  expect(sequence.type).toBe("Prova");
  expect(sequence.allowRotation).toBe(true);
  expect(sequence.deleteOnFailure).toBe(true);
  expect(sequence.forced).toBe(false);
  expect(sequence.maximumDuration).toBe(1466);
  expect(sequence.objects.length).toBe(0);

  // Sequence 2
  sequence = sequences[2];
  expect(sequence.title).toBe("Seq. 7.05 liner 1");
  expect(sequence.type).toBe("Pubblicità");
  expect(sequence.liner).toBe(1);

  // Sequence 3
  sequence = sequences[3];
  expect(sequence.title).toBe("Seq. 12:28:32 forz. 4:35");
  expect(sequence.type).toBe("Pubblicità");
  expect(sequence.forced).toBe(true);
  expect(sequence.endsAtTime).toBe(false);
  expect(sequence.forcedTime).toStrictEqual(new Date(275000));
});
