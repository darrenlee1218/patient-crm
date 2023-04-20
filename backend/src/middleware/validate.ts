import Joi from "joi";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { pick } from "../utils";
import { ApiError } from "../utils/api";
import { ROLES, ACCESS } from "../config/roles";
import { AuthTokenTypes } from "../config";
import { config } from "../config/config";
import { UserService, AccessService } from "../services";

export const validate = (schema: any) => (req: any, res: any, next: any) => {
  const validSchema = pick(schema, ["params", "query", "body", "file"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export const checkAccess =
  (access: ACCESS) => async (req: any, res: any, next: any) => {
    const jwtToken = req.headers["authorization"] as string;
    if (!jwtToken || jwtToken.length === 0) {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
    } else {
      const payload = jwt.verify(jwtToken, config.jwt.secret);

      if (payload["type"] == AuthTokenTypes.ACCESS) {
        const selUser = await UserService.getUserById(payload.sub.toString());
        if (selUser.role == ROLES.ADMIN || selUser.role == ROLES.DOCTOR) {
          let hasRole = true;
          if (selUser.role == ROLES.DOCTOR) {
            const userAccess = await AccessService.getUserAccess(
              payload.sub.toString()
            );

            hasRole = userAccess.indexOf(access) >= 0;
          }

          if (hasRole) next();
          else
            next(
              new ApiError(httpStatus.UNAUTHORIZED, "Have no right to read")
            );
        } else {
          next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
        }
      } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
      }
    }
  };

export const checkAdmin = () => async (req: any, res: any, next: any) => {
  const jwtToken = req.headers["authorization"] as string;
  if (!jwtToken || jwtToken.length === 0) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
  } else {
    const payload = jwt.verify(jwtToken, config.jwt.secret);

    if (payload["type"] == AuthTokenTypes.ACCESS) {
      const selUser = await UserService.getUserById(payload.sub.toString());
      if (selUser.role == ROLES.ADMIN) {
        next();
      } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, "You are not admin"));
      }
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
    }
  }
};

export const checkLogin = () => async (req: any, res: any, next: any) => {
  const jwtToken = req.headers["authorization"] as string;
  if (!jwtToken || jwtToken.length === 0) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
  } else {
    const payload = jwt.verify(jwtToken, config.jwt.secret);

    if (payload["type"] == AuthTokenTypes.ACCESS) {
      next();
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, "Token Invalid"));
    }
  }
};
