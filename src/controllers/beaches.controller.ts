import { Request, Response } from "express";

import { errorController } from "./error";
import { Beach } from "../models/beach";






export default class BeachesController  {


  public async create(req: Request, res: Response): Promise<void> {


    try {
      const beach = new Beach({ ...req.body, ...{ user: req.decoded?.id } });
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error) {
      errorController.sendCreateUpdateErrorResponse(res, error);
    }

  }

}