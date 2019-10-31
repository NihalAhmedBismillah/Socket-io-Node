import { Validator,required } from "../lib/validation";

/**
  *Workout model
  */
export class Workout extends Validator {
   
    _id: string = null;
    @required
    title: string = null;
    description: string = null;
    @required
    startDateTime: string = null;
    @required
    endDateTime: string = null;
    planUser: number = null;
    actualUser: number = null;
    workoutType: string = null;
    createdBy: string = null;
    createdOn: string = null;
    modifyBy: string = null;
    modifyOn: string = null;
    constructor(values?: Workout) {
        super();
        if (values) Object.assign(this, values);
    }
}