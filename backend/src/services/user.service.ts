import httpStatus from "http-status";
import { Access, IUser, User } from "../models";
import { ApiError } from "../utils/api";
import { Logger } from "../config/logger";
import { ACCESS, ROLES } from "../config/roles";

interface IUserUpdate {
  username: string;
  usermail: string;
  userphone: string;
  patientId: string;
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: IUser) => {
  if (await User.isEmailTaken(userBody.usermail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  userBody.role = ROLES.DOCTOR;

  Logger.info(`Creating doctor by name - ${userBody.username}`);
  const selUser = await User.create(userBody);

  // set READ and CREATE access to new user
  await Access.create({ userid: selUser._id.toString(), access: ACCESS.READ });
  await Access.create({
    userid: selUser._id.toString(),
    access: ACCESS.CREATE,
  });

  return selUser;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createPatient = async (userBody: IUser, creatorId: string) => {
  if (await User.isEmailTaken(userBody.usermail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  userBody.creator = creatorId;
  userBody.role = ROLES.PATIENT;
  userBody.userpass = "password";
  Logger.info(`Creating patient by name - ${userBody.username}`);
  return User.create(userBody);
};

const updatePatient = async (userBody: IUserUpdate) => {
  if (await User.isEmailTaken(userBody.usermail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const userid = userBody.patientId;
  delete userBody.patientId;

  const selUser = await User.findOne({ _id: userid, role: ROLES.PATIENT });
  if (!selUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found");
  }

  Logger.info(`updating patient by id - ${userid}`);
  return User.updateOne(
    {
      _id: userid,
    },
    userBody
  );
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (usermail: string) =>
  User.findOne({ usermail, role: { $in: [ROLES.ADMIN, ROLES.DOCTOR] } });

const getUserById = async (_id: string, role = "") => {
  if (role.length === 0) return await User.findOne({ _id });
  else return await User.findOne({ _id, role });
};

const removeUserByID = async (_id: string) =>
  User.updateOne(
    { _id },
    {
      isDeleted: true,
      deletedAt: new Date(),
    }
  );

const getList = async (options) => {
  const doctors = await User.paginate({ role: ROLES.DOCTOR }, options);

  return doctors;
};

const getCount = async (role: ROLES) => {
  return await User.count({ role });
};

export const UserService = {
  getList,
  getCount,
  createUser,
  getUserByEmail,
  createPatient,
  getUserById,
  removeUserByID,
  updatePatient,
};
