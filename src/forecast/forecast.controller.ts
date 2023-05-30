import { Request, Response } from 'express';

import ForecastService from './forescast.service';
import { Beach } from '../models/beach';


const forecast = new ForecastService



export default class ForecastController {
  async getForecastForgeLoggedUser(request: Request, response: Response): Promise<Response> {
    const beaches = await Beach.find({})
    const forecasData = await forecast.processForecastForBeaches(beaches);
    return response.status(200).json(forecasData);
  }
}
