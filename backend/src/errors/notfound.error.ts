import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
    statusCode: number = 404;

    constructor(public message: string = 'Route not found') {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ success: false, message: this.message }];
    }
}
