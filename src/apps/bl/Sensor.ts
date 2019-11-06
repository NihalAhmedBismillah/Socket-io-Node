
import { DbOperation } from '../lib/db'
import { Sensor } from '../models/Sensor';
const shortid = require('shortid');
const COLLECTION_NAME = 'SENSOR';


export class SensorBL {
    /**
     * 
     * @param tweet 
     */
    public static async addSensor(sensor: Sensor): Promise<any> {
        // TODO: Logged user Id
        const loggedUserId = shortid.generate();
        sensor._id = shortid.generate();
        sensor.createdOn = new Date().toISOString();
        sensor.createdBy = loggedUserId// TODO: Logged user Id
        sensor.modifyOn = new Date().toISOString();
        sensor.modifyBy = loggedUserId// TODO: Logged user Id
        return await DbOperation.save(sensor, COLLECTION_NAME);
    }

    public static async insertMany(docs:any):Promise<boolean>{
     return await DbOperation.insertMany(docs, COLLECTION_NAME);
    }

    public static async updateSensor(sensorId: string): Promise<any> {
        const updateObject = { query: { _id: sensorId }, updateFields: { isAlloted: true, } }
        return await DbOperation.updateFields(updateObject, COLLECTION_NAME);
    }

    public static async getSensorById(sensorId: string): Promise<any> {
        const query = { _id: sensorId };
        return await DbOperation.find(query, COLLECTION_NAME);
    }
    public static async getSensors(): Promise<any> {
        const query = {};
        return await DbOperation.find(query, COLLECTION_NAME);
    }
    public static async getNonAllocatedSensors(): Promise<any> {
        const query = { isAlloted: false, status: "ACTIVE" };
        return await DbOperation.find(query, COLLECTION_NAME);
    }
}