import * as express from 'express';
import {Server} from 'typescript-rest';
import * as http from 'http';
import * as path from 'path';
import * as cors from 'cors';
import startUpModuleControllers from './controllers/index';
import Logger from './middlewares/logger';
import * as morgan from "morgan";
import {setting} from './setting/setting';
import Filter from './middlewares/filter';
import * as helmet from "helmet";
import * as compression from "compression";

export class ApiServer {

    private app: express.Application;
    private server: http.Server = null;
    private PORT: string = setting.NODE_SERVER_PORT || '3000';
    private HOST: string = setting.NODE_SERVER_HOST || 'localhost';
    private HOST_ADDRESS = this.HOST + ':' + this.PORT;
    private filter: Filter;
    private accessLog = new Logger();

    constructor() {
        this.app = express();
        this.filter = new Filter();
        this.config();

        //Enable IoC container
        Server.useIoC();
        Server.buildServices(this.app,
            ...startUpModuleControllers);

        //Swagger generation
        Server.loadServices(this.app,'/controllers/startUp', __dirname);


        Server.swagger(
            this.app,
            './dist/swagger.json',
            '/api-docs',
            this.HOST_ADDRESS,
            ['http']
        );

    }

    /**
     * Configure the express app.
     */
     private config(): void {
        let logger = this.accessLog.getWinstonLogger();
        // Native Express configuration
        // this.app.use( bodyParser.urlencoded( { extended: false } ) );
        // this.app.use( bodyParser.json( { limit: '1mb' } ) );
         // User morganLogger middleware
        this.app.use(morgan("common", {
             stream: {
             write: (message:any) => {
                 logger.info(message);
                 }
             }
         }));

        this.app.use(helmet());
        this.app.use(helmet.noCache());
        this.app.use(helmet.frameguard());
        this.app.disable('x-powered-by');

        this.app.use(cors({
            methods: ["GET", "POST", "PUT", "DELETE"]
        }));

        this.app.use(compression());

        this.filter.getAllRoutes(this.app); // Applying filter

        this.app.set("json spaces", 4);//json format
        this.app.set('case sensitive routing', true);
        this.app.set('strict routing', true);

        this.app.use(express.static(path.join(__dirname, 'public'),
            {maxAge: 31557600000}));

    }


    /**
     * Start the server
     * @returns {Promise<any>}
     */
    public start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(+this.PORT, this.HOST, (err: any) => {
                if (err) {
                    return reject(err);
                }
                // tslint:disable-next-line:no-console
                console.info('swagger documentation on: http://' + this.HOST_ADDRESS + '/api-docs/');
                console.info('Main server running on  : http://' + this.HOST_ADDRESS);
                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

}
