import * as http from "http";
import cors from 'cors'
import App from "./app";
import { BackendLogger } from "./logger/backend.logger";
import dotenv from 'dotenv';
import {connect, disconnect} from './config/db.config';

//dotenv configuration
dotenv.config();

//port configuration
const normalizePort = (val: string | number) => {
    return (typeof val === "string" ? parseInt(val, 10) : val);
};

const port = normalizePort(process.env.PORT || 3080);

App.set("port", port);

//cors configuration
App.use(cors({
    origin: '*'
}));

//server configuration
const server = http.createServer(App);

const logger = new BackendLogger();

server.on('error', (error:Error) => {
    logger.error(`Erreur: ${error.name}, Message:${error.message}`);
});

server.on("listening", function(): void {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ${bind}`, null);
});

server.listen(port);

//db connexion
connect();




module.exports = App;
