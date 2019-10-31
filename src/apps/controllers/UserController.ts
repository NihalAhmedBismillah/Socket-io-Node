
import { UserBL } from '../bl/User'
import { User } from '../models/User';
/**
 * UserController
 */
export class UserController {
    app = null;
    constructor(app) {
        this.app = app
    }
    init() {
        return new Promise((res, rej) => {
            this.app.post("/api/v1/users", async (req, res) => {
                try {
                    let { body } = req;
                    const user = new User(body);
                    const { status, errorMessage } = user.isValid(user);
                    if (status) {
                        await UserBL.addUser(user);
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
            res(true);
        })
    }
}
