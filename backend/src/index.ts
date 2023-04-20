import { app } from "./app";
import { Logger } from "./config/logger";
import { MongoConnector } from "./utils/db";
import { config } from "./config/config";

let server: any;
(() => {
  try {
    // it only works when we deploy to server
    // await mongoose.connect(config.mongoose.url, config.mongoose.options);
    // logger.info('Connected to MongoDB');
    server = app.listen(config.appPort, () => {
      Logger.info(
        `Starting app, in env: ${config.appEnv}, listening to port ${config.appPort}`
      );
      MongoConnector.start();
    });
  } catch (err) {
    Logger.error("Server crashed", err);
  }
})();

const unexpectedErrorHandler = (error: any) => {
  Logger.error("UNHANDLED ERROR");
  Logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  Logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
