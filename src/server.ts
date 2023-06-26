
import cors from 'cors';
import express, { Application } from 'express';
import Routes from './routes';
import * as database from './database';
import logger from './logger';

import apiSchema from './api-schema.json';
import swaggerUi from 'swagger-ui-express'
import * as http from 'http';
import expressPino from "express-pino-logger";
import * as OpenApiValidator from 'express-openapi-validator';

import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { apiErrorValidator } from './middlewares/api-error-validator';
export class SetupServer {
  private server?: http.Server;
  private app: Application = express();
  constructor(private port = 3333) {

  }

  public async init(): Promise<void> {

    this.setupExpress();
   await this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();

  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(expressPino({ logger }));
    this.app.use(cors({ origin: '*' }));
    this.app.use(apiErrorValidator)

  }



  private setupControllers(): void {

    this.app.use(Routes());

  }


  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
   // this.app.use(OpenApiValidator.middleware({
    //  apiSpec: apiSchema as OpenAPIV3.Document,
    //  validateRequests: true, 
    //  validateResponses: true, 
   //}));
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {

    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          logger.info('Process of closed server is completed.');
          resolve(true);
        });
      });
    }
  }

  public async start(): Promise<void> {
    await this.init();
    this.app.listen(this.port, () => {


      logger.info('Server listening on port: ' + this.port);
    });
  }
}



