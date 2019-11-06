
import { DbOperation } from '../lib/db'
import { Workout } from '../models/Workout';
const shortid = require('shortid'),
    COLLECTION_NAME = 'WORKOUT'


export class WorkoutBL {
    /**
     * 
     * @param tweet 
     */
    public static async addWorkout(workout: Workout): Promise<any> {
        // TODO: Logged user Id
        const loggedUserId = shortid.generate();
        workout._id = shortid.generate();
        workout.createdOn = new Date().toISOString();
        workout.createdBy = loggedUserId// TODO: Logged user Id
        workout.modifyOn = new Date().toISOString();
        workout.modifyBy = loggedUserId// TODO: Logged user Id
        return await DbOperation.save(workout, COLLECTION_NAME);
    }

    public static async insertMany(docs:any):Promise<boolean>{
        return await DbOperation.insertMany(docs, COLLECTION_NAME);
       }
}