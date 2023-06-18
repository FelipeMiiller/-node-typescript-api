
import cors from 'cors';
import express, { Application } from 'express';
import Routes from './routes';
import * as database from './database';
import logger from './logger';
import * as http from 'http';
import expressPino from "express-pino-logger";

export class SetupServer {
  private server?: http.Server;
  private app: Application  = express();
  constructor(private port = 3333) {

  }

  public async init(): Promise<void> {

    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();

  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(expressPino({ logger }));
    this.app.use(cors({origin: '*'}));
  
  }

  private setupControllers(): void {

    this.app.use(Routes());

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



