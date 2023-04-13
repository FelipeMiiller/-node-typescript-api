import express from 'express';
import ForecastController from './forecast/forecast.controller';

export const routes = express.Router();

const forecastController = new ForecastController();

routes.get('/forecast', forecastController.getForecastForgeLoggedUser);
