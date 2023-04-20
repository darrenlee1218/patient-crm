import httpStatus from "http-status";
import { ApiError } from "../utils/api";
import { Logger } from "../config/logger";
import { UserService } from "./user.service";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<any> => {
  const user = await UserService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  Logger.info(`User - ${user._id}/${user.role} was found`);
  return user;
};

export const AuthService = {
  loginUserWithEmailAndPassword,
};
