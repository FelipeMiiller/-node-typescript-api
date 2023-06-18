import { Response } from "express";
import mongoose from "mongoose";
import ApiError, { IApiError, IFormatedAPIError } from "../util/errors/api-error";
import logger from "../logger";


export abstract class BaseController  {

    protected sendGenericError(res: Response, apiError: IApiError): void{
        const formatedError = ApiError.format(apiError);
       res.status(formatedError.code).send(formatedError)
    }

    protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {

        if (error instanceof mongoose.Error.ValidationError) {
        
            const clientErrors = this.handleClientErrors(error)

            res.status(clientErrors.code).send(clientErrors)
        } else {
            const formatedError = this.sendUnknownError(error)
            res.status(formatedError.code).send(formatedError)
        }
    }


    private sendUnknownError(error: unknown): IFormatedAPIError {
        logger.error(JSON.stringify(error))
        return ApiError.format({ code: 500, message: 'Something went wrong!' })
    }


    private handleClientErrors(error: mongoose.Error.ValidationError): IFormatedAPIError {

        const errorMessages = Object.values(error.errors)
            .map((error) => ({
                king: error.kind,
                path: error.path,
                message: error.message
            }));

        return ApiError.format({
            code: 400,
            description: 'Validation failed!',
            message: JSON.stringify(errorMessages)
        })
    }



}