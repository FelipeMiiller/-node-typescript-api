import dotenv from 'dotenv';
import cors from 'cors';
import express, { Application } from 'express';
import { routes } from './routes';
import  * as database from './database';


export class SetupServer {
 private  app: Application = express();
  constructor(private port = 3333) {

  }

  public async init(): Promise<void> {
    console.log('init');
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();


    this.app.listen(this.port, () => {
      console.log(`HTTP server on running, port:${this.port}`);
    });
  }

  private setupExpress(): void {
    console.log('setupExpress');
    dotenv.config();
    this.app.use(cors());
    this.app.use(express.json());
    console.log('setupExpress');
  }

  private setupControllers(): void {
    console.log('setupControllers');
    this.app.use(routes);
    console.log('setupControllers');
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    console.log('databaseSetup');
    await database.connect();

  }

  public async close(): Promise<void> {
    console.log('close');
    await database.close();
  }
}



