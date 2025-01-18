import { ValidationError } from 'express-validator';
import { CustomError } from './custom.error';
import { HTTP_STATUS_CODE } from '../constants';

export class RequestValidationError extends CustomError {
    statusCode = HTTP_STATUS_CODE.BAD_REQUEST;

    constructor(public errors: ValidationError[]) {
        super('invalid request parameters');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { success: false, message: err.msg, field: err.path };
            }
            return { success: false, message: err.msg };
        });
    }
}
