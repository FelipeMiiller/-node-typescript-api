import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import { routes } from './routes';

export const app = express();

async function bootstrap() {
  dotenv.config();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  // await Setups();

  app.listen(process.env.PORT || 3333, () => {
    console.log('HTTP server on running!');
  });
}
bootstrap();
