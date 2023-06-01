import dotenv from 'dotenv';
import cors from 'cors';
import express, { Application } from 'express';
import Routes from './routes';
import * as database from './database';


export class SetupServer {
  private app: Application = express();
  constructor(private port = 3333) {

  }

  public async init(): Promise<void> {
    console.log('initialize server!!!!');
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
    console.log('Server is started!!!!');
  }

  private setupExpress(): void {
    console.log('init: setup Express');
    dotenv.config();
    this.app.use(cors());
    this.app.use(express.json());
    console.log('Terminate: setup Express');
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
  }

  public async start(): Promise<void> {
   await this.init();
    this.app.listen(this.port, () => {
      console.log(`HTTP server on running, port:${this.port}`);
    });
  }
}



