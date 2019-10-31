
import { UserController } from './src/apps/controllers/UserController';
import { DbConnect } from './src/apps/lib/dbConnection';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as nocache from 'nocache';
import * as morgan from 'morgan';
import * as  swaggerUi from 'swagger-ui-express';
import { WorkoutController } from './src/apps/controllers/WorkoutController';
import { SensorController } from './src/apps/controllers/SensorController';
import { AllocationSensorController } from './src/apps/controllers/AllocationSensoreController';
const swaggerDocument = require('../apiGateway/src/apps/swagger/swagger.json');

/**
 * AppSetup
 */
export class AppSetup {
    app;
    constructor(app) {
        this.app = app;
    }
    public async initApp() {
        try {
            // TODO : Need to add other middleware exceptions
            this.app.use((err, req, res, next) => {
                console.error(err);
                res.render('internal server error :500');
            });
            this.app.set('view engine', 'html');
            this.app.set('view option', { laylut: false });
            // Seting Up Helmet HidePoweredBy 
            this.app.use(helmet.hidePoweredBy());
            // Setting Up Http Strict Transport Security(Hsts)
            this.app.use(helmet.hsts({
                maxAge: 16000000000,
                preload: true,
                force: true
            }));
            // Setting Up FrameGuard
            this.app.use(helmet.frameguard({ action: 'deny' }));
            // Setting Up XssFilter
            this.app.use(helmet.xssFilter());
            // XssFilter for Old versions of Internet Explorer
            this.app.use(helmet.xssFilter({ setOnOldIE: true }));
            // Setting Up ieNoOpen 
            this.app.use(helmet.ieNoOpen());
            // Setting Up noSniff 
            this.app.use(helmet.noSniff());

            //Seting Up Helmet HidePoweredBy
            this.app.disable('x-powered-by');

            //Seting Up Helmet Nocache
            this.app.use(nocache());
            this.app.use(bodyParser.json());

            // Setting cors
            this.app.use(cors());
            // Setting cross Origin
            // TODO: For now allowing access origin for all domains , Need to specify access origin
            this.app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", '*');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
                res.header('Access-Control-Max-Age', '600');
                return next();
            });
            this.app.use(morgan('combined'))
            this.app.use(bodyParser.urlencoded({ extended: true }));
            await DbConnect.dbConnect();
            console.log('Data base setup');
            // TODO: we need to refactor for controller registration
            await Promise.all([new UserController(this.app).init(),
            new WorkoutController(this.app).init(),
            new SensorController(this.app).init(),
            new AllocationSensorController(this.app).init()]);
            console.log('controllers registered!');
            this.app.get("/", (req, res) => {
               // res.writeHead(200, { "Content-Type": "text/html" });
                //Passing HTML To Browser
                res.render('index.html');
                //Ending Response
            });
            // Setup swagger for api documentation
            //  this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        }
        catch (error) {
            console.log('error ', JSON.stringify(error))
            throw (error);
        }
    }
}

