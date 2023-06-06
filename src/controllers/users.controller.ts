
import { User } from "../models/user";
import { Request, Response } from "express";
import { BaseController } from "./Base";
import { AuthMethods } from "../util/authMethods";
import mongoose from "mongoose";
import { HandleErrorsDB } from "../util/errors/handler/dataBase";





export default class UsersController extends BaseController {


    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();

            res.status(201).send(newUser);
        } catch (error) {
            HandleErrorsDB(res, error);

        }
    }



    async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;


            const user = await User.findOne({ email });
        
            if (!user) {

                res.status(401).send({
                    code: 401,
                    description: "Authentication failed!",
                    error: 'User not found'
                })
            } else if (!(await AuthMethods.comparePasswords(password, user.password))) {

                res.status(401).send({
                    code: 401,
                    description: "Authentication failed!",
                    error: 'Password is incorrect'
                });
            } else {
                const token = AuthMethods.generateToken(user.toJSON());
                
                res.status(200).send({ ...user.toJSON(), ...{ token } })
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                code: 500,

                description: 'Something went wrong!',
            });

        }



    }





}

