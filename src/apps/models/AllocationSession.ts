import { HeardBeatRate } from './AllocationSensor'

export class AllocationSession {

    _id: string = null;
    workoutId: string = null;
    userId: string = null;
    userName: string = null;
    sensorId: string = null;
    heardBeatRate: HeardBeatRate = new HeardBeatRate();
    sessionStarted: boolean = null;
    startedDateTime: string = null;
    endDateTime: string = null;
    public static assignSessionObject(data: any): AllocationSession {
        let allocationSensor: AllocationSession = new AllocationSession();
        allocationSensor._id = data._id;
        allocationSensor.sensorId = data.sensorId;
        allocationSensor.userId = data.userId;
        allocationSensor.workoutId = data.workoutId;
        allocationSensor.userName = `${data.user[0].firstName}  ${data.user[0].lastName}`;
        allocationSensor.heardBeatRate = data.heardBeatRate;
        allocationSensor.sessionStarted = data.sessionStarted;
        allocationSensor.startedDateTime = data.startedDateTime;
        allocationSensor.endDateTime = data.endDateTime;
        return allocationSensor;
    }
}