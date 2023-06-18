import config from 'config';
import { SetupServer } from "./server";
import logger from './logger';

enum ExitStatus {
  Success = 0,
  Failure = 1
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});

async function bootstrap(): Promise<void> {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    for (const signal of exitSignals) {

      process.on(signal, async () => {
        try {
          logger.info(`Received signal ${signal}, stopping server...`);
          await server.close();
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(`Error starting server: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })

    }
  } catch (error) {
    logger.error(`Error starting server: ${error}`);
    process.exit(ExitStatus.Failure);
  }


}

bootstrap();
