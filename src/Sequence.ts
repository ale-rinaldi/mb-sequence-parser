import SequenceObject from "./Object";

class Sequence {
  public title: string = "";
  public type: string = "";
  public onAirTime: Date = new Date();
  public liner: number = 0;
  public forced: boolean = false;
  public endsAtTime: boolean = false;
  public forcedTime: Date = new Date();
  public allowRotation: boolean = false;
  public deleteOnFailure: boolean = false;
  public maximumDuration: number = 0;
  public disabled: boolean = false;
  public objects: SequenceObject[] = [];
}

export default Sequence;
