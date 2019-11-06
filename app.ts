
import * as express from 'express';
const config = require('./src/apps/lib/config.json');
import { AppSetup } from './appsetUp';
import { SocketConnection } from './socketconnection';
import { FakeDataGenerator } from './src/apps/bl/DummyDataGenerator';
export const app = express();

/**
 * Application
 */
class Application {

    public static async run(): Promise<boolean> {
        try {

            app.engine('html', require('ejs').renderFile);
            app.use(express.static('files'))
            app.use(express.static('views'))
            await new AppSetup(app).initApp();
            //Telling Express+Socket.io App To Listen To Port
            const io = require('socket.io').listen(app.listen(config['PORT']));
            // check if dummy record is true
            if (config['isFakesRecord']) {
                const iteration: number = +config['fakeRecordNo']
                await FakeDataGenerator.run(iteration);
            }
            SocketConnection.connectSocket(io);
            return Promise.resolve(true);
        }
        catch (error) {
            return error;
        }
    }
}
Application.run().then(() => {
    console.log(`server started in port No 3001 and db connected!`);
}).catch((error) => {
    console.log('Error : ', JSON.stringify(error));
    process.exit(1)
})