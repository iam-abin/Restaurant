import { HTTP_STATUS_CODE } from '../constants';
import { CustomError } from './custom.error';

export class ForbiddenError extends CustomError {
    statusCode: number = HTTP_STATUS_CODE.FORBIDDEN;

    constructor(public message: string = 'Access denied') {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
