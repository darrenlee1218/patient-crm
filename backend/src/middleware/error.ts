import mongoose from "mongoose";
import httpStatus from "http-status";
import { uResponse } from "../services/types";
import { config } from "../config/config";
import { ApiError } from "../utils/api";

export const errorConverter = (err: any, req: any, res: any, next: any) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let { statusCode, message } = err;
  if (config.appEnv === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  req.logger?.error(err);

  uResponse(res, {}, statusCode, err.message);
};
