
import { Request, Response } from 'express';
import ForecastService from '../services/forecast.service';
import { BaseController } from '.';

import { errorController } from './error';
import { Beach } from '../models/beach';
import logger from '../logger';




const forecastService = new ForecastService();

export default class ForecastController extends BaseController {

  constructor() {
    super();
  }


  async getForecastForgeLoggedUser(req: Request, res: Response): Promise<void> {

    try {
      const beaches = await Beach.find({ user: req.decoded?.id });

      const forecasData = await forecastService.processForecastForBeaches(beaches);
      res.status(200).send(forecasData);

    } catch (error) {
      logger.error(error);
      errorController.sendGenericError(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }

  }



}
