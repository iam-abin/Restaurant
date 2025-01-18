import { HTTP_STATUS_CODE } from '../constants';
import { CustomError } from './custom.error';

export class NotAuthorizedError extends CustomError {
    statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;

    constructor(public message: string = 'Not authorized') {
        super(message);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
