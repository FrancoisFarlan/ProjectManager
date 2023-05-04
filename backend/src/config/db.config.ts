import * as Mongoose from "mongoose";
import dotenv from 'dotenv';
import {ConnectOptions} from "mongoose";
import * as console from "console";
import { BackendLogger } from "~/logger/backend.logger";

dotenv.config();

let connected: boolean;
const logger: BackendLogger = new BackendLogger();

export const connect = () => {

    const url = process.env.MONGO_CONNECTION_STRING;
    console.log("from connect: process.env.MONGO_CONNECTION_STRING :::",process.env.MONGO_CONNECTION_STRING)

    if (connected) {
        return;
    }

    Mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
        .then(() => {
            logger.info('Connected to database', null)
            connected = true;
        })
        .catch((err) => {
            logger.error(err.message);
        });
};

export const disconnect = () => {

    if (!connected) {
        return;
    }

    Mongoose.disconnect()
        .then(() => {
            logger.info('Disconnected from database', null)
            connected = false;
        })
        .catch((err) => {
            logger.error(err.message);
        });

};