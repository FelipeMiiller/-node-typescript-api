import { Beach } from "@src/models/beach";
import { Request, Response } from "express";



export class BeachesController {
 

  async create(req:Request, res:Response): Promise<void> {
    const beach = new Beach( req.body);
    const result = await  beach.save();
    res.status(201).send(result);
  }

}