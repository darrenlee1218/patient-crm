import { Router } from "express";
import { ACCESS } from "../config/roles";
import { PatientController } from "../controller";
import { validate, checkAccess } from "../middleware/validate";
import { PatientValdate } from "../validations/patient.validate";

const router = Router();

router.get("/", checkAccess(ACCESS.READ), PatientController.list);

router.get(
  "/info",
  checkAccess(ACCESS.READ),
  validate(PatientValdate.info),
  PatientController.getInfo
);

router.post(
  "/register",
  checkAccess(ACCESS.CREATE),
  validate(PatientValdate.register),
  PatientController.register
);

router.post(
  "/update",
  checkAccess(ACCESS.UPDATE),
  validate(PatientValdate.update),
  PatientController.updateItem
);

router.delete(
  "/remove",
  checkAccess(ACCESS.DELETE),
  validate(PatientValdate.remove),
  PatientController.removeItem
);

export const PatientRoute = {
  router,
};
