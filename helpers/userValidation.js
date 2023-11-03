const Joi = require("joi");
const { regex } = require("../constants");

exports.createUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(30).required(),
      birthDate: Joi.string(),
      password: Joi.string().min(6).required(),
      email: Joi.string().regex(regex.EMAIL_REGEX).required(),
      isAdult: Joi.boolean(),
      userAuth: Joi.string(),
      userFavorite: Joi.string(),
      //   subscription: Joi.string(),
      //   token: Joi.string(),
      //   verificationToken: Joi.string(),
      //   verify: Joi.boolean(),
    })
    .validate(data);

exports.loginUserDataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      password: Joi.string().min(6).required(),
      email: Joi.string().required(),
    })
    .validate(data);

exports.emailVerifyValidator = (data) =>
  Joi.object({
    email: Joi.string().required(),
  }).validate(data);
