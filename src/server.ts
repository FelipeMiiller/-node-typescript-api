import { SetupServer } from "./configServer";




async function bootstrap() {
  const server: SetupServer = new SetupServer();
  await server.init();

}

bootstrap();
