
import { AllocationSensorBL } from '../bl/AllocationSensor'
import { AllocationSensor } from '../models/AllocationSensor';
import { SensorBL } from '../bl/Sensor';
/**
 * UserController
 */
export class AllocationSensorController {
    app = null;
    constructor(app) {
        this.app = app
    }
    init() {
        return new Promise((res, rej) => {
            this.app.post("/api/v1/allocations/sensor", async (req, res) => {
                try {
                    let { body } = req;
                    const allocatedSensor = new AllocationSensor(body);
                    const { status, errorMessage } = allocatedSensor.isValid(allocatedSensor);
                    if (status) {
                        await AllocationSensorBL.allocateSensor(allocatedSensor);
                        // update sensor isAlloted
                        await  SensorBL.updateSensor(allocatedSensor.sensorId);
                        // TODO: Need to format proper message response
                        res.send({ status: 'success' });
                    } else {
                        //TODO: need to handle proper exception with http status code
                        res.send({ status: 'fail', message: errorMessage });
                    }
                } catch (err) {
                    //TODO: need to handle proper exception with http status code
                    res.send({ status: 'fail', message: err });
                }
            });

            this.app.get("/api/v1/allocations/sensors/:workout_id", async (req, res) => {
                try {
                    const workoutId = req.params['workout_id'];
                    const response = await AllocationSensorBL.getAllocateSensors(workoutId);
                    res.send(response);
                } catch (err) {
                    //TODO: need to handle proper exception with http status code
                    res.send({ status: 'fail', message: err });
                }
            });

            this.app.get("/api/v1/allocations/sensor/view", async (req, res) => {
                try {
                    //TODO: need to handle proper exception with http status code
                    res.render('sensorallocationveiw.html');
                } catch (err) {
                    //TODO: need to handle proper exception with http status code
                    res.send({ status: 'fail', message: err });
                }
            });
            res(true);
        })
    }
}
