# Socket-io-Node
# Description : 
Design an API endpoint that allocates heart rate sensors to participants for a workout.  
Background  Imagine we want to run a workout. For each of our workouts, all participants need to wear a heart rate sensor. We have to know which participant wears which sensor, so that we don't mix up the heart rate measures.  
Most of the participants get one of our sensors when they arrive, but some also bring their own sensor (but all information about all sensors are kept in a single database).  
Task  We need an API that creates and maintains sensor-to-participant allocations for each workout. All allocations should be done before the workout starts: When a participant enters the gym, he directly wants to grab the right sensor (the sensors are labeled with a unique number and there could be another app, that displays the allocations to the users when he enters the gym). The allocation process could be kicked-off for example with POSTing to an endpoint (see below: POST /allocations)  
Now something can go wrong: A participants grabs his sensor, but the sensor fails (eg. battery is empty). We want to be able to on-the-fly reallocate a new sensor to him (a sensor that is free and not already allocated to someone else in that workout).  
Clients connecting to this API want to be informed live about updates to the allocations (eg. the user whos sensor failed, instantly wants to know which replacement sensor he should grab).  
The focus should be on creating and maintaining the sensor allocations. The database of the users, participants and workouts can be simple/static values/simulated.  

# Setup

```bash
$ git clone https://github.com/NihalAhmedBismillah/Socket-io-Node.git
$ cd Socket-io-Node
$ npm install
```

# NPM scripts

- `$ npm run start` to start local development server.
- `$ npm run test` to start test.

