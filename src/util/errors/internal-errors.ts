export class InternalError extends Error {
    public readonly message: string;
    protected readonly code: number;
    protected readonly description?: string;



    constructor(
        message: string,
        code = 500,
        description?: string,
    ) {
        super(message);
        this.message = message;
        this.code = code;
        this.description = description;

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}   