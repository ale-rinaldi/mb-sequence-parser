import SequenceObject from "./Object";
import { Calendar } from "./Calendar";

class Sequence {
  public title: string = "";
  public type: string = "";
  public onAirTime: Date = new Date();
  public liner: number = 0;
  public forced: boolean = false;
  public endsAtTime: boolean = false;
  public forcedTime: Date = new Date();
  public allowRotation: boolean = false;
  public removeOnFailure: boolean = false;
  public maximumDuration: number = 0;
  public disabled: boolean = false;
  public objects: SequenceObject[] = [];
  public calendar: Calendar = <Calendar>{};
}

export default Sequence;
