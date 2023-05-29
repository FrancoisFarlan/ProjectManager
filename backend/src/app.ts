import * as bodyParser from "body-parser";
import express, {Request, Response} from "express";
import {BackendLogger} from "./logger/backend.logger";
import { userRouter } from '~/router/user.router';
import {auth} from "~/middleware/auth";
import cors from 'cors';

class App {

    public express: express.Application;
    public logger: BackendLogger;
    private corsOptions ={
        origin:'http://localhost:8081',
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
        methods: "GET, POST"
    }

    constructor() {
        this.express = express();
        this.cors();
        this.middleware();
        this.routes();
        this.logger = new BackendLogger();
    }

    private cors(): void {
        this.express.use(cors(this.corsOptions));
    }
    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        //this.express.use(express.static(path.join(__dirname, '../ui/build')));
    }

    private routes(): void {

        //Auth routes
        this.express.use(userRouter);

        // handle undefined routes
        this.express.use("/", auth, (req: Request, res: Response) => {
            res.send("Home");
        });
    }
}

export default new App().express;