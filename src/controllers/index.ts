import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(res: Response,error: unknown): void 
    {
        console.log(error);
       
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErrors = this.handleClientErrors(error);
            res.status(clientErrors.code)
                .send({ code: clientErrors.code, error: clientErrors.error });
        } else {
            res.status(500).send({ code: 500, error: 'Something went wrong!' });
        }
    }

    private handleClientErrors(error: mongoose.Error.ValidationError): { code: number; error: string } 
    {
        console.log(Object.values(error.errors));
        const duplicatedKindErrors = Object.values(error.errors)
        .filter((err) => err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED
        );
        if (duplicatedKindErrors.length) {
            return { code: 409, error: error.message };
        }else{
        return { code: 422, error: error.message };
        }
    }
}