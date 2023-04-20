import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { uResponse } from "../services/types";
import { wrapRequestAsync } from "../utils/api";
import { config } from "../config/config";
import { UserService, PatientService } from "../services";
import { ROLES } from "../config/roles";

const list = wrapRequestAsync(async (req: Request, res: Response) => {
  const { query } = req;
  const patients = await PatientService.getList(query);

  uResponse(res, { patients }, httpStatus.OK);
});

const getInfo = wrapRequestAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;
  const patient = await UserService.getUserById(
    userId.toString(),
    ROLES.PATIENT
  );

  uResponse(res, { patient }, httpStatus.OK);
});

const register = wrapRequestAsync(async (req: Request, res: Response) => {
  const jwtToken = req.headers["authorization"] as string;
  const payload = jwt.verify(jwtToken, config.jwt.secret);
  const creatorId = payload.sub.toString();

  const user = await UserService.createPatient(req.body, creatorId);

  uResponse(res, { user }, httpStatus.OK);
});

const removeItem = wrapRequestAsync(async (req: Request, res: Response) => {
  const { patientId } = req.body;
  await UserService.removeUserByID(patientId);

  uResponse(res, {}, httpStatus.OK);
});

const updateItem = wrapRequestAsync(async (req: Request, res: Response) => {
  const user = await UserService.updatePatient(req.body);

  uResponse(res, { user }, httpStatus.OK);
});

export const PatientController = {
  list,
  getInfo,
  register,
  removeItem,
  updateItem,
};
