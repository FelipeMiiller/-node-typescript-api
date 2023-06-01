
import { CUSTOM_VALIDATION, User } from "../models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { BaseController } from ".";



export default class UsersController extends BaseController {


    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();
            res.status(201).send(newUser);
        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.name === 'ValidatorError');

                if (duplicatedKindErrors.length) {
                   

                    res.status(400).send({
                    code: 400,
                      error: duplicatedKindErrors.map((err) => { return { king: err.kind, path: err.path, message: err.message } })
                    })
                }


            } else {
                res.status(500).send({ code: 500, error: 'Something went wrong!' });
            }
        }
    }



}
