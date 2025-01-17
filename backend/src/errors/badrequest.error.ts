import { HTTP_STATUS_CODE } from '../constants';
import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
    statusCode: number = HTTP_STATUS_CODE.BAD_REQUEST;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
