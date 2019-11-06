
import { DbOperation } from '../lib/db'
import { AllocationSensor, HeardBeatRate } from '../models/AllocationSensor';
import { AllocationSession } from '../models/AllocationSession';
import { SensorBL } from './Sensor';
const shortid = require('shortid'),
    COLLECTION_NAME = 'ALLOCATIONSENSOR'


export class AllocationSensorBL {
    /**
     * 
     * @param  Allocate Sensor
     */
    public static async allocateSensor(allocationSensor: AllocationSensor): Promise<any> {
        // TODO: Logged user Id
        const loggedUserId = shortid.generate();
        allocationSensor._id = shortid.generate();
        allocationSensor.createdOn = new Date().toISOString();
        allocationSensor.createdBy = loggedUserId// TODO: Logged user Id
        allocationSensor.modifyOn = new Date().toISOString();
        allocationSensor.modifyBy = loggedUserId// TODO: Logged user Id
        return await DbOperation.save(allocationSensor, COLLECTION_NAME);
    }

    public static async insertMany(docs: any): Promise<boolean> {
        return await DbOperation.insertMany(docs, COLLECTION_NAME);
    }

    /**
    * 
    * @param Get Allocate Sensors 
    */
    public static async getAllocateSensors(workoutId: string): Promise<any> {
        return await DbOperation.findAggregate({ workoutId: workoutId }, COLLECTION_NAME);
    }

    /**
    * 
    * @param Get Allocate Sensors  by id
    */
    public static async getAllocatedSensorById(sensorId: string): Promise<any> {
        return await DbOperation.find({ _id: sensorId }, COLLECTION_NAME);
    }


    public static async startSession(): Promise<AllocationSession> {

        const query = { sessionStarted: false, status: 'ACTIVE' }
        let response = await DbOperation.findSessionUser(query, COLLECTION_NAME);
        if (response && response.length) {
            response = response[0];
            await this.updateSessionStatus(response._id);
            return AllocationSession.assignSessionObject(response);
        } else {
            return null;
        }
    }

    public static async allocateNewSensor(data: AllocationSession): Promise<AllocationSensor> {

        let response = await SensorBL.getNonAllocatedSensors();
        if (response && response.length) {
            response = response[0];
            let newAllocatedSensor: AllocationSensor = new AllocationSensor();
            newAllocatedSensor.userId = data.userId;
            newAllocatedSensor.workoutId = data.workoutId;
            newAllocatedSensor.status = "ACTIVE";
            newAllocatedSensor.startedDateTime = new Date().toISOString();
            newAllocatedSensor.sessionStarted = true;
            newAllocatedSensor.sensorId = response._id;
            newAllocatedSensor.heardBeatRate = data.heardBeatRate;
            newAllocatedSensor.endDateTime = new Date().toISOString();
            await this.allocateSensor(newAllocatedSensor);
            return Promise.resolve(response);
        } else {
            return null;
        }
    }

    public static async updateSessionStatus(id: string): Promise<any> {
        let endTime = new Date();
        endTime.setHours(endTime.getHours() + 4);// default workout time 2 hours
        const updateObject = { query: { _id: id }, updateFields: { sessionStarted: true, startedDateTime: new Date().toISOString(), endDateTime: endTime.toISOString() } };
        return await DbOperation.updateFields(updateObject, COLLECTION_NAME);
    }

    public static async updateAllocatedSensor(id: string): Promise<any> {
        const updateObject = { query: { _id: id }, updateFields: { sessionStarted: false, startedDateTime: new Date().toISOString(), endDateTime: new Date().toISOString(), status: 'INACTIVE' } };
        return await DbOperation.updateFields(updateObject, COLLECTION_NAME);
    }
    //
    public static async updateHeartBeatPulse(id: string, heardBeatRate: HeardBeatRate): Promise<any> {
        const updateObject = { query: { _id: id }, updateFields: { heardBeatRate: heardBeatRate } };
        return await DbOperation.updateFields(updateObject, COLLECTION_NAME);
    }

}