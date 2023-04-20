import httpStatus from "http-status";
import { Request, Response } from "express";
import { uResponse } from "../services/types";
import { wrapRequestAsync } from "../utils/api";
import {
  AuthService,
  UserService,
  AccessService,
  AuthTokenService,
} from "../services";
import { ROLES } from "../config/roles";

const login = wrapRequestAsync(async (req: Request, res: Response) => {
  const { usermail, userpass } = req.body;
  const user = await AuthService.loginUserWithEmailAndPassword(
    usermail,
    userpass
  );

  const tokens = await AuthTokenService.generateAuthTokens(user);
  const access = await AccessService.getUserAccess(user._id);

  uResponse(res, { user, tokens, access });
});

const register = wrapRequestAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  // const tokens = await AuthTokenService.generateAuthTokens(user);

  uResponse(res, { user }, httpStatus.CREATED);
});

const list = wrapRequestAsync(async (req: Request, res: Response) => {
  const { query } = req;
  const doctors = await UserService.getList(query);

  uResponse(res, { doctors }, httpStatus.OK);
});

const removeDoctor = wrapRequestAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.body;
  await UserService.removeUserByID(doctorId);

  uResponse(res, {}, httpStatus.OK);
});

const userAccess = wrapRequestAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;
  const access = await AccessService.getUserAccess(userId.toString());

  uResponse(res, { access }, httpStatus.OK);
});

const updateAccess = wrapRequestAsync(async (req: Request, res: Response) => {
  await AccessService.updateAcccess(req.body);

  uResponse(res, {}, httpStatus.OK);
});

const countUser = wrapRequestAsync(async (req: Request, res: Response) => {
  const doctorCnt = await UserService.getCount(ROLES.DOCTOR);
  const patientCnt = await UserService.getCount(ROLES.PATIENT);

  uResponse(res, { doctorCnt, patientCnt }, httpStatus.OK);
});

export const UserController = {
  list,
  login,
  register,
  countUser,
  removeDoctor,
  userAccess,
  updateAccess,
};
