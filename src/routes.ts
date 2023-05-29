import express from 'express';
import ForecastController from './forecast/forecast.controller';
import { BeachesController } from './beaches/beaches.controller';

export const routes = express.Router();

const forecastController = new ForecastController();
const beachesController = new BeachesController();



// routers for forecast
routes.get('/forecast', forecastController.getForecastForgeLoggedUser);


// routers for beaches
routes.post('/beaches', beachesController.create)