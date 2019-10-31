
import { SensorBL } from '../bl/Sensor'
import { Sensor } from '../models/Sensor';
/**
 * UserController
 */
export class SensorController {
    app = null;
    constructor(app) {
        this.app = app
    }
    init() {
        return new Promise((res, rej) => {
            this.app.post("/api/v1/sensors", async (req, res) => {
                try {
                    let { body } = req;
                    const sensor = new Sensor(body);
                    const { status, errorMessage } = sensor.isValid(sensor);
                    if (status) {
                        await SensorBL.addSensor(sensor);
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

            this.app.get("/api/v1/sensors", async (req, res) => {
                try {
                    const response = await SensorBL.getSensors();
                    // TODO: Need to format proper message response
                    res.send(response);
                } catch (err) {
                    //TODO: need to handle proper exception with http status code
                    res.send({ status: 'fail', message: err });
                }
            });

            this.app.get("/api/v1/sensors/view", async (req, res) => {
                try {
                    res.render('sensorview.html');
                } catch (err) {
                    //TODO: need to handle proper exception with http status code
                    res.send({ status: 'fail', message: err });
                }
            });
            res(true);
        })
    }
}
