import ObjectType from "./ObjectType";
import { Calendar } from "./Calendar";

class SequenceObject {
  public type: ObjectType = ObjectType.Null;
  public fileName: string = "";
  public filePath: string = "";
  public calendar: Calendar = <Calendar>{};

  constructor(type: ObjectType) {
    this.type = type;
  }
}

export default SequenceObject;
