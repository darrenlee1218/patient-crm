import { Router } from "express";
import { AuthValidate } from "../validations";
import { UserController } from "../controller";
import { validate, checkAdmin, checkLogin } from "../middleware/validate";

const router = Router();

router.post("/login", validate(AuthValidate.login), UserController.login);
router.post(
  "/register",
  validate(AuthValidate.register),
  UserController.register
);

router.get("/list", checkAdmin(), UserController.list);

router.get("/", checkLogin(), UserController.countUser);

router.get(
  "/access",
  checkAdmin(),
  validate(AuthValidate.access),
  UserController.userAccess
);

router.post(
  "/update-access",
  checkAdmin(),
  validate(AuthValidate.updateAccess),
  UserController.updateAccess
);

router.delete(
  "/remove",
  checkAdmin(),
  validate(AuthValidate.remove),
  UserController.removeDoctor
);

export const UserRoute = {
  router,
};
