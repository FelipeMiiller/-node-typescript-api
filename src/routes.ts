import express, { RouterOptions } from 'express';
import ForecastController from './controllers/forecast.controller';
import BeachesController from './controllers/beaches.controller';
import UsersController from './controllers/users.controller';


export default function Routes(router?: express.Router): express.Router {
    const routes = express.Router() || router;

    console.log('init: setupControllers');
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();


    // routers for forecast
    routes.get('/forecast', forecastController.getForecastForgeLoggedUser);


    // routers for beaches
    routes.post('/beaches', beachesController.create)


    // routers for users
    routes.post('/users', usersController.create)




    console.log('Terminate: setupControllers');
    return routes;
}