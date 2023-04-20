import compression from "compression";
import cors from "cors";
import express from "express";
import passport from "passport";
const xss = require("xss-clean");

import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import httpStatus from "http-status";
import { config } from "./config/config";
import { Morgan } from "./config/morgan";
import { Passport } from "./config/passport";
import { errorConverter, errorHandler } from "./middleware/error";
import { ApiError } from "./utils/api";
import { RouterMap } from "./routes";

export const app = express();

if (config.appEnv !== "test") {
  app.use(Morgan.successHandler);
  app.use(Morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    exposedHeaders: ["access-control-allow-origin", "authorization"],
  })
);
app.options("*", cors);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", Passport.jwtStrategy);

app.get("/", (req, res) => {
  res.send("patient-api-server");
});
app.use("/", RouterMap);

// send back a 404 error for any unknown api request
app.use((req: any, res: any, next: (arg0: any) => void) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
