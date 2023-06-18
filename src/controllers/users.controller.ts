
import { User } from "../models/user";
import { Request, Response } from "express";

import { AuthMethods } from "../util/authMethods";

import logger from "../logger";
import { BaseController } from ".";
import { errorController } from "./error";







export default class UsersController extends BaseController {


    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();

            res.status(201).send(newUser);
        } catch (error) {

            errorController.sendCreateUpdateErrorResponse(res, error);

        }
    }



    async authenticate(req: Request, res: Response): Promise<void> {

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            errorController.sendGenericError(res, { code: 401, description: "Authentication failed!", message: 'User not found' });

        } else if (!(await AuthMethods.comparePasswords(password, user.password))) {

            errorController.sendGenericError(res, { code: 401, description: "Authentication failed!", message: 'Password is incorrect' });

        } else {
            const token = AuthMethods.generateToken(user.toJSON());

            res.status(200).send({ ...user.toJSON(), ...{ token } })
        }




    }





}

