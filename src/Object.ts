import ObjectType from "./ObjectType";

class SequenceObject {
  public type: ObjectType = ObjectType.Null;

  constructor(type: ObjectType) {
    this.type = type;
  }
}

export default SequenceObject;
