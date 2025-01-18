import { HTTP_STATUS_CODE } from '../constants';
import { CustomError } from './custom.error';

export class DatabaseConnectionError extends CustomError {
    statusCode: number = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    constructor() {
        super('Error connecting to database');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
