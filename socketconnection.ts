
import { AllocationSensorBL } from './src/apps/bl/AllocationSensor'
import { AllocationSession } from './src/apps/models/AllocationSession';
import { HeardBeatRate, AllocationSensor } from './src/apps/models/AllocationSensor';
import { SensorBL } from './src/apps/bl/Sensor';

export class SocketConnection {

    public static connectSocket(io: any) {

        io.sockets.on("connection", async (socket) => {
            //TODO: Need to remove from here
            let data: AllocationSession = await AllocationSensorBL.startSession();
            socket.emit("sessionstarted", data);
            //On Event HEARTBEATPULSE
            socket.on("heartbeatpulse", async (messages) => {
                console.log('heartbeatpulse======> ', messages);
                // check if client is live or not
                if (messages && messages.id) {
                    let heardBeatRate: HeardBeatRate = new HeardBeatRate();
                    heardBeatRate.beatTime = new Date().toISOString();
                    heardBeatRate.count = +messages.count + 1;
                    // update heart beat pulse
                    await AllocationSensorBL.updateHeartBeatPulse(messages.id, heardBeatRate);
                    const allocatedSensor = await AllocationSensorBL.getAllocatedSensorById(data._id);
                    if(allocatedSensor && allocatedSensor.length){
                        // emit new heart beat pulse
                        socket.emit("heartbeatpulseupdted", allocatedSensor[0]);
                    }
                }
            });
            socket.on('disconnect', async () => {
                //  update old sensor 
                await AllocationSensorBL.updateAllocatedSensor(data._id);
                //   allocate new sensor of discuss user
                const allocatedSensor: AllocationSensor = await AllocationSensorBL.allocateNewSensor(data);
                //   update new sensor status
                console.log('allocatedSensor._id: ', allocatedSensor._id);
                await SensorBL.updateSensor(allocatedSensor._id);
            });
        });
    }
}