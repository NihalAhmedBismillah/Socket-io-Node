
import { DbOperation } from '../lib/db'
import { User } from '../models/User';
const shortid = require('shortid'),
    COLLECTION_NAME = 'USER'


export class UserBL {
    /**
     * 
     * @param tweet 
     */
    public static async addUser(user: User): Promise<any> {
        // TODO: Logged user Id
        const loggedUserId = shortid.generate();
        user._id = shortid.generate();
        user.createdOn = new Date().toISOString();
        user.createdBy = loggedUserId// TODO: Logged user Id
        user.modifyOn = new Date().toISOString();
        user.modifyBy = loggedUserId// TODO: Logged user Id
        return await DbOperation.save(user, COLLECTION_NAME);
    }

    public static async insertMany(docs:any):Promise<boolean>{
        return await DbOperation.insertMany(docs, COLLECTION_NAME);
       }
}