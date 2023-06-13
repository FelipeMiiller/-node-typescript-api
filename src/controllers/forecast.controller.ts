import { Request, Response } from 'express';

import ForecastService from '../services/forecast.service';
import { Beach } from '../models/beach';



const forecastService = new ForecastService();


export default class ForecastController {

  constructor() { }
  async getForecastForgeLoggedUser(req: Request, resp: Response): Promise<void> {

    try {
      const beaches = await Beach.find({user: req.decoded?.id});

      const forecasData = await forecastService.processForecastForBeaches(beaches);
      resp.status(200).send(forecasData);

    } catch (error) {

      resp.status(500).send({ error: 'Internal Server Error' });

    }


  }
}
