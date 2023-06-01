import { SetupServer } from "./server";




async function bootstrap() {
  const server = new SetupServer();
  await server.start();

}

bootstrap();
