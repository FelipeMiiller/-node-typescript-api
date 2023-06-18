import httpStatusCodes from 'http-status-codes';

export interface IApiError {
  message: string;
  code: number;
  codeAsString?: string; //allow to override the default error code as string
  description?: string;
  documentation?: string;
}

export interface IFormatedAPIError extends Omit<IApiError , 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error:  IApiError  ): IFormatedAPIError{
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}