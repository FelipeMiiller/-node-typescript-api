export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}


export class ExternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 400,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}



export class dataBaseError extends Error {
  constructor(
    public message: string,
    protected code: number = 400,
    protected description?: string,
    protected listDescription?: Array<{path: string, message: string}>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}




