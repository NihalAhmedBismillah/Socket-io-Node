
import { Validator,required } from "../lib/validation";
/**
 * SensorAllocation model 
 */
export class Sensor extends Validator {

    _id: string = null;
    @required
    name: string = null;
    @required
    manufName: string = null;
    description: string = null;
    status: string = null;
    SensorType: string = null;
    isUserProperty: boolean = null;
    isAlloted: boolean = false; // default free=> false
    batteryChargePercentage: number = 100 // default 100% percentage
    createdBy: string = null;
    createdOn: string = null;
    modifyBy: string = null;
    modifyOn: string = null;
    constructor(values?: Sensor) {
        super();
        if (values) Object.assign(this, values);
    }

}
