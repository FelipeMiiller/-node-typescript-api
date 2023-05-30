import { Request, Response } from 'express';

import ForecastService from './forescast.service';
import { Beach } from '../models/beach';


const forecast = new ForecastService



export default class ForecastController {
  async getForecastForgeLoggedUser(request: Request, response: Response): Promise<void> {

    try {
      const beaches = await Beach.find({})
      const forecasData = await forecast.processForecastForBeaches(beaches);
      response.status(200).send(forecasData);
    } catch (error) {
      response.status(500).send({ error: 'Something went wrong' });

    }


  }
}
