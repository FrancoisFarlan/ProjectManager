import * as bodyParser from "body-parser";
import express, {Request, Response} from "express";
import {BackendLogger} from "./logger/backend.logger";
import { userRouter } from '~/router/user.router';
import {auth} from "~/middleware/auth";

class App {

    public express: express.Application;
    public logger: BackendLogger;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new BackendLogger();
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