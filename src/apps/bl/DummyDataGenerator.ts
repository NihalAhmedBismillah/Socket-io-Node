
import { DbOperation } from './../lib/db';
import { Sensor } from './../models/Sensor';
import { User, Address, ContractNo } from './../models/User';
import { Workout } from './../models/Workout';
import * as shortid from 'shortid';
import * as  faker from 'faker';
import { SensorBL } from './Sensor';
import { WorkoutBL } from './Workout';
import { UserBL } from './User';
import { AllocationSensor, HeardBeatRate } from '../models/AllocationSensor';
import { AllocationSensorBL } from './AllocationSensor';

export class FakeDataGenerator {

    static collectionsName: Array<string> = ["SENSOR", "USER", "WORKOUT", "ALLOCATIONSENSOR"];
    static sensors: Array<Sensor> = [];
    static users: Array<User> = [];
    static workouts: Array<Workout> = [];
    static allocationSensors: Array<AllocationSensor> = [];
    constructor() {

    }
    public static async run(iteration: number): Promise<boolean> {
        await this.removeDocuments();
        await Promise.all([this.insertUser(iteration), this.insertSensors(iteration), this.insertWorkout(iteration)]);
        await this.insertAllocationSensor(iteration);
        await this.updateSensorStatus();
        return Promise.resolve(true);

    }

    private static async removeDocuments(): Promise<boolean> {

        this.collectionsName.forEach(async (item: string) => {
            await DbOperation.deleteAllDocuments(item);
        });
        return Promise.resolve(true);
    }

    private static async insertSensors(iteration: number): Promise<boolean> {
        console.log('insert Sensors docs   : ', iteration);
        iteration = iteration + 20;
        for (let index = 0; index < iteration + 20; index++) {
            let sensor: Sensor = new Sensor();
            sensor._id = shortid.generate();
            sensor.createdBy = shortid.generate();
            sensor.createdOn = new Date().toISOString();
            sensor.modifyBy = shortid.generate();
            sensor.modifyOn = new Date().toISOString();
            sensor.description = faker.lorem.sentence();
            sensor.isAlloted = false;
            sensor.isUserProperty = faker.random.boolean();
            sensor.manufName = faker.name.findName();
            sensor.status = "ACTIVE";
            sensor.name = faker.name.findName();
            sensor.SensorType = faker.random.word();
            sensor.batteryChargePercentage = Math.floor(Math.random() * 100);
            this.sensors.push(sensor);
        }
        await SensorBL.insertMany(this.sensors)
        return Promise.resolve(true);
    }

    private static async insertWorkout(iteration: number): Promise<boolean> {
        console.log('insertWorkout docs  : ', iteration);
        for (let index = 0; index < iteration; index++) {
            let workout: Workout = new Workout();
            workout._id = shortid.generate();
            workout.createdBy = shortid.generate();
            workout.createdOn = new Date().toISOString();
            workout.modifyBy = shortid.generate();
            workout.modifyOn = new Date().toISOString();
            workout.description = faker.lorem.text();
            workout.actualUser = Math.floor(Math.random() * 200);
            workout.planUser = Math.floor(Math.random() * 250);
            workout.title = faker.name.findName();
            workout.startDateTime = new Date().toISOString()
            workout.endDateTime = new Date().toISOString();
            workout.workoutType = faker.random.word();
            this.workouts = [...this.workouts, workout];
        }
        await WorkoutBL.insertMany(this.workouts)
        return Promise.resolve(true);
    }

    private static async insertUser(iteration: number): Promise<boolean> {
        console.log('insertUser docs  : ', iteration);
        for (let index = 0; index < iteration; index++) {
            let user: User = new User();
            user.firstName = faker.name.firstName();
            user.lastName = faker.name.lastName();
            user._id = shortid.generate();
            user.dob = new Date().toISOString();
            user.gender = 'MALE';
            user.status = "ACTIVE";
            user.userType = faker.name.findName();
            user.contractNos = [new ContractNo({ contNo: faker.phone.phoneNumber(), contType: "Home" }), new ContractNo({ contNo: faker.phone.phoneNumber(), contType: "Office" })]
            user.createdBy = shortid.generate();
            user.createdOn = new Date().toISOString();
            user.modifyBy = shortid.generate();
            user.modifyOn = new Date().toISOString();
            user.address = [new Address({
                addressLine1: faker.address.streetAddress(),
                addressLine2: faker.address.secondaryAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zipCode: faker.address.zipCode(),
                countryCode: faker.address.countryCode(),
                isDefault: false

            })]
            this.users = [...this.users, user];
        }
        this.users[0].address[0].isDefault = true;
        await UserBL.insertMany(this.users)
        return Promise.resolve(true);
    }

    private static async insertAllocationSensor(iteration: number): Promise<boolean> {
        console.log('insert Allocation Sensor docs   : ', iteration);
        for (let index = 0; index < iteration; index++) {
            let allocationSensor: AllocationSensor = new AllocationSensor();
            allocationSensor._id = shortid.generate();
            allocationSensor.createdBy = shortid.generate();
            allocationSensor.createdOn = new Date().toISOString();
            allocationSensor.modifyBy = shortid.generate();
            allocationSensor.modifyOn = new Date().toISOString();
            allocationSensor.sessionStarted = false;
            allocationSensor.status = "ACTIVE";
            allocationSensor.heardBeatRate = new HeardBeatRate();
            allocationSensor.sensorId = this.sensors[index]._id;
            allocationSensor.workoutId = this.workouts[0]._id;
            allocationSensor.userId = this.users[index]._id
            allocationSensor.startedDateTime = new Date().toISOString();
            allocationSensor.endDateTime = new Date().toISOString();
            this.allocationSensors = [...this.allocationSensors, allocationSensor];
        }
        await AllocationSensorBL.insertMany(this.allocationSensors)
        return Promise.resolve(true);
    }

    private static async  updateSensorStatus(): Promise<boolean> {
        this.allocationSensors.forEach(async (item) => {
            console.log('updateSensor: ',item.sensorId);
            await SensorBL.updateSensor(item.sensorId);
        });
        return Promise.resolve(true);
    }
} 