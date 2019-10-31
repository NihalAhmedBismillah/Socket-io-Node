
import { WorkoutBL } from '../bl/Workout'
import { Workout } from '../models/Workout';
/**
 * WorkoutController
 */
export class WorkoutController {
    app = null;
    constructor(app) {
        this.app = app
    }
    init() {
        return new Promise((res, rej) => {
            this.app.post("/api/v1/workouts", async (req, res) => {
                try {
                    let { body } = req;
                    const workload = new Workout(body);
                    const { status, errorMessage } = workload.isValid(workload);
                    if (status) {
                        await WorkoutBL.addWorkout(workload);
                        // TODO: Need to format proper message response
                        res.send({ status: 'success' });
                    } else {
                        //TODO: need to handle proper exception with http status code
                        res.send({ status: 'fail', message: errorMessage });
                    }

                } catch (err) {
                    res.send({ status: 'fail', message: err });
                }
            });
            res(true);
        })
    }
}
