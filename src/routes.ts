import express from 'express';
import ForecastController from './controllers/forecast.controller';
import BeachesController from './controllers/beaches.controller';
import UsersController from './controllers/users.controller';
import { authMiddleware } from './middlewares/auth';



export default function Routes(): express.Router {
    const routes = express.Router()



    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();



    routes.get('/', (_req, res) => {

        res.status(200).send("Hello from StormGlass API!");
    })

    // routers for forecast
    routes.use('/forecast', (req, res, next) => authMiddleware(req, res, next))
    routes.get('/forecast', forecastController.getForecastForgeLoggedUser);


    // routers for beaches
    routes.use('/beaches', (req, res, next) => authMiddleware(req, res, next))
    routes.post('/beaches', beachesController.create)


    // routers for users
    routes.post('/users', usersController.create)
    routes.post('/users/authorizate', usersController.authenticate)





    return routes;
}