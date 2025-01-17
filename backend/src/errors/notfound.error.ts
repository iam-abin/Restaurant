import { HTTP_STATUS_CODE } from '../constants';
import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
    statusCode: number = HTTP_STATUS_CODE.NOT_FOUND;

    constructor(public message: string = 'Route not found') {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
