import Joi from "joi";

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    usermail: Joi.string().required().email(),
    userphone: Joi.string().required(),
  }),
};

const update = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    usermail: Joi.string().required().email(),
    userphone: Joi.string().required(),
    patientId: Joi.string().required(),
  }),
};

const remove = {
  body: Joi.object().keys({
    patientId: Joi.string().required(),
  }),
};

const info = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

export const PatientValdate = {
  register,
  update,
  remove,
  info,
};
