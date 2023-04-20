import Joi from "joi";
import { password } from "./custom.validate";
import { ACCESS } from "../config/roles";

const verifyLogin = {
  query: Joi.object().keys({
    ot: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    usermail: Joi.string().required(),
    userpass: Joi.string().required(),
  }),
};

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    usermail: Joi.string().required().email(),
    userpass: Joi.string().required().custom(password),
  }),
};

const remove = {
  body: Joi.object().keys({
    doctorId: Joi.string().required(),
  }),
};

const access = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateAccess = {
  body: Joi.object().keys({
    [ACCESS.CREATE]: Joi.boolean().required(),
    [ACCESS.READ]: Joi.boolean().required(),
    [ACCESS.UPDATE]: Joi.boolean().required(),
    [ACCESS.DELETE]: Joi.boolean().required(),
    userId: Joi.string().required(),
  }),
};

export const AuthValidate = {
  login,
  register,
  verifyLogin,
  remove,
  access,
  updateAccess,
};
