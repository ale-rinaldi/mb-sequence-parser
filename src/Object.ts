import ObjectType from "./ObjectType";

class SequenceObject {
  public type: ObjectType = ObjectType.Null;
  public fileName: string = "";
  public filePath: string = "";

  constructor(type: ObjectType) {
    this.type = type;
  }
}

export default SequenceObject;
