import { CustomError } from './custom.error';

export class ForbiddenError extends CustomError {
    statusCode: number = 403;

    constructor(public message: string = 'Access denied') {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
