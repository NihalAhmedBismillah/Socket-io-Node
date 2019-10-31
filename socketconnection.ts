
import { AllocationSensorBL } from './src/apps/bl/AllocationSensor'
import { AllocationSession } from './src/apps/models/AllocationSession';
import { HeardBeatRate } from './src/apps/models/AllocationSensor';

export class SocketConnection {

    public static connectSocket(io: any) {
        let data: AllocationSession = new AllocationSession();
        let intervalId: any = null;
        let allocatedSensorId: string = null;
        io.sockets.on("connection", async (socket) => {
            //TODO: Need to remove from here
            data = await AllocationSensorBL.startSession();
            socket.emit("sessionstarted", data);
            //On Event HEARTBEATPULSE
            socket.on("heartbeatpulse", async (data) => {
                console.log('heartbeatpulse ', data);
                // check if client is live or not
                if (data && data.id) {
                    allocatedSensorId = data.id;
                    // update HEARTBEATPULSE
                    let heardBeatRate: HeardBeatRate = new HeardBeatRate();
                    heardBeatRate.beatTime = new Date().toISOString();
                    heardBeatRate.count = +data.count + 1;
                    await AllocationSensorBL.updateHeartBeatPulse(data.id, heardBeatRate);
                }
            });

            intervalId = setInterval(async () => {
                //console.log('allocatedSensorId', allocatedSensorId);
                if (allocatedSensorId) {
                    const allocatedSensor = await AllocationSensorBL.getAllocatedSensorById(data._id);
                    socket.emit("heartbeatpulseupdted", allocatedSensor[0]);
                }
            }, 1000)
        });
        io.socket.on('disconnect', async () => {
            //TODO: Need to remove from here
            // update old sensor 
            await AllocationSensorBL.updateAllocatedSensor(data._id);
            //   allocate new sensor of discuss user
            await AllocationSensorBL.allocateNewSensor(data);
        });
    }
}