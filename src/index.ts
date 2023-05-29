import { SetupServer } from "./server";




async function bootstrap() {
  const server: SetupServer = new SetupServer();
  await server.init();

}

bootstrap();
