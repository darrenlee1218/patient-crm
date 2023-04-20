import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import moment, { Moment } from "moment";
import mongoose from "mongoose";
import { ApiError } from "../utils/api";
import { config } from "../config/config";
import { Logger } from "../config/logger";
import { UserService } from "./user.service";
import { IUser, AuthToken } from "../models";
import { AuthTokenTypes } from "../config";

/**
 * Save a token
 * @param {ObjectId} userId
 * @returns {Promise<Token>}
 */
const getToken = (userId: unknown) => AuthToken.findOne({ user: userId });

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<any> => {
  const tokenDoc = await AuthToken.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: string): Promise<any> => {
  Logger.info("Verify JWT Token");
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await AuthToken.findOne({
    token,
    type,
    user: payload.sub as string,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {Object} model
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (model: IUser): Promise<object> => {
  Logger.info(
    `Creating access token for user - ${model.username}/${model.usermail}`
  );
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    model._id,
    accessTokenExpires,
    AuthTokenTypes.ACCESS
  );

  Logger.info(`Auth tokens generated for (user / player) - ${model._id}`);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  Logger.info(`get user by email ${email}`);
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );

  const resetPasswordToken = generateToken(
    user.id,
    expires,
    AuthTokenTypes.RESET_PASSWORD
  );
  Logger.info("Generated new Token successfully", resetPasswordToken);
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    AuthTokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: any): Promise<string> => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  Logger.info(`Generate Token for ${user.name}`);
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    AuthTokenTypes.VERIFY_EMAIL
  );
  Logger.info("Verified Token successfully", verifyEmailToken);
  await saveToken(
    verifyEmailToken,
    user.id,
    expires,
    AuthTokenTypes.VERIFY_EMAIL
  );
  return verifyEmailToken;
};

export const AuthTokenService = {
  getToken,
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
