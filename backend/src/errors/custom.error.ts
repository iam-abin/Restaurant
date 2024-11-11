export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);
        // To make sure prototype inheritance(prototype chain) worke properly.
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): {
        message: string;
        field?: string; // To show form validation error fields
    }[];
}
