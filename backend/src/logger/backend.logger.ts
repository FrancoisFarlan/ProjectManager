// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pine from 'pine';
const logger = pine();


export class BackendLogger {
    info(message: string, data: any = undefined) {
        logger.info(`${message}   ${undefined != data ? JSON.stringify(data) : ''}`);
    }

    error(message: string) {
        logger.error(message);
    }
}