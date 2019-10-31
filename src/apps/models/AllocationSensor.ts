import { Validator, required } from "../lib/validation";

/**
  * Heard Beat Rate model
  */
export class HeardBeatRate {
  beatTime: string = null;
  count: number = null;
}

/**
 * Sensor Allocation model 
 */
export class AllocationSensor extends Validator {
  _id: string = null;
  @required
  workoutId: string = null;
  @required
  userId: string = null;
  @required
  sensorId: string = null;
  status: string = null // ACTIVE, INACTIVE
  heardBeatRate: HeardBeatRate = new HeardBeatRate();
  createdBy: string = null;
  createdOn: string = null;
  modifyBy: string = null;
  modifyOn: string = null;
  sessionStarted = false // By default false
  startedDateTime:string= null;
  endDateTime:string = null;
  constructor(values?: AllocationSensor) {
    super();
    if (values) Object.assign(this, values);
  }

}

