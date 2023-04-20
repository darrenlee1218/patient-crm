import httpStatus from "http-status";
import { ApiError } from "../utils/api";
import { Access } from "../models";
import { UserService } from "./user.service";
import { ROLES } from "../config/roles";

const getUserAccess = async (userid: string) => {
  const accesses = await Access.find({ userid });

  let accessArr = [];
  if (accesses.length > 0) {
    for (const accessItem of accesses) {
      accessArr.push(accessItem.access);
    }
  }

  return accessArr;
};

const updateAcccess = async (userInfo: any) => {
  const { userId } = userInfo;
  delete userInfo.userId;

  const user = await UserService.getUserById(userId, ROLES.DOCTOR);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found");
  }

  await Access.deleteMany({ userid: userId });
  for (const accessRole in userInfo) {
    if (userInfo[accessRole])
      await Access.create({ userid: userId, access: accessRole });
  }
};

export const AccessService = {
  getUserAccess,
  updateAcccess,
};
