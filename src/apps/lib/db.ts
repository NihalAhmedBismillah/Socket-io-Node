
/**
 * Import npm packages
 */

export class DbOperation {

    /**
     * 
     * @param data 
     * @param collectionName 
     */
    public static save(data: any, collectionName: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!data || !collectionName) return reject('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.save(data, (error, result) => {
                return (!error) ? resolve(result.result) : reject(error);
            });
        });
    }
    /**
     * 
     * @param updateOptions 
     * @param collectionName 
     */
    public static updateFields(updateOptions, collectionName) {

        return new Promise((res, rej) => {

            if (!updateOptions || !collectionName) return rej('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.update(updateOptions.query, { $set: updateOptions.updateFields }, { upsert: true }, (error, result) => {
                if (!error) {
                    res(result.result);
                } else {
                    rej(error);
                }
            });
        });
    }
    /**
     * 
     * @param query 
     * @param collectionName 
     */
    public static find(query, collectionName):Promise<any> {

        return new Promise((res, rej) => {

            if (!query || !collectionName) return rej('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.find(query).toArray((error, result) => {
                return (!error) ? res(result) : rej(error);
            });
        });
    }

    /**
        * 
        * @param query 
        * @param collectionName 
        */
    public static findAggregate(query, collectionName) {

        return new Promise((res, rej) => {

            if (!query || !collectionName) return rej('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.aggregate([
                { $match : query },
                {
                    $lookup:
                    {
                        from: "USER",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $lookup:
                    {
                        from: "WORKOUT",
                        localField: "workoutId",
                        foreignField: "_id",
                        as: "workout"
                    }
                },
                {
                    $lookup:
                    {
                        from: "SENSOR",
                        localField: "sensorId",
                        foreignField: "_id",
                        as: "sensor"
                    }
                }
            ]).toArray((error, result) => {
                return (!error) ? res(result) : rej(error);
            });
        });
    }


    /**
        * 
        * @param query 
        * @param collectionName 
        */
       public static findSessionUser(query, collectionName):Promise<any> {

        return new Promise((res, rej) => {

            if (!query || !collectionName) return rej('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.aggregate([
                { $match : query },
                {
                    $lookup:
                    {
                        from: "USER",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $lookup:
                    {
                        from: "SENSOR",
                        localField: "sensorId",
                        foreignField: "_id",
                        as: "sensor"
                    }
                }
            ]).toArray((error, result) => {
                return (!error) ? res(result) : rej(error);
            });
        });
    }


    /**
     * 
     * @param pageNo 
     * @param pageSize 
     * @param collectionName 
     */
    static findWithPaginantion(pageNo: number, pageSize: number, collectionName) {

        return new Promise((resolve, reject) => {

            if (!collectionName) return reject('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.find({}).count((error, count) => {
                if (!error) {
                    collection.find({})
                        .skip((pageSize * pageNo) - pageSize)

                        .limit(pageSize).toArray((error, result) => {
                            if (!error) {
                                resolve({ data: result, currentPage: pageNo, totalPages: Math.ceil(count / pageSize) });
                            } else {
                                reject(error);
                            }
                        });
                } else {
                    reject(error);
                }
            });
        });
    }
    /**
     * 
     * @param query 
     * @param collectionName 
     */
    public static remove(query, collectionName) {

        return new Promise((res, rej) => {

            if (!query || !collectionName) return rej('Invalid paramater');
            let db = global['locator'].get('db');
            let collection = db.collection(collectionName);
            collection.remove(query, (error, result) => {
                return (!error) ? res(result.result) : rej(error);
            });
        });
    }
}
