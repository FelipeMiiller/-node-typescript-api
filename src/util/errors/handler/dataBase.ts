import { Response } from "express";
import mongoose from "mongoose";





export function HandleErrorsDB(res: Response, error: unknown): void {


    if (error instanceof mongoose.Error.ValidationError) {
        const response = handleValidationError(error)
        res.status(response.code).send(response);

    } else {

        res.status(500).send({
            code: 500,
            description: 'Something went wrong!',
        })

    }
}




function handleValidationError(error: mongoose.Error.ValidationError): { code: number, description: string, error: Array<{ path: string, message: string }> } {

    const errorMessages = Object.values(error.errors)
        .map((error) => ({
            king: error.kind,
            path: error.path,
            message: error.message
        }));
    return {
        code: 400,
        description: 'Validation failed!',
        error: errorMessages,
    }
}