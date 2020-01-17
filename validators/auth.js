const Joi = require('@hapi/joi');

exports.postLogin = Joi.object({
  username: Joi
    .string()
    .alphanum()
    .min(2)
    .max(30)
    .required(),
  password: Joi
    .string()
    .min(6)
    .max(30)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

exports.postRegistration = Joi.object({
  username: Joi
    .string()
    .min(2)
    .max(30)
    .required(),
  surName: Joi
    .string()
    .allow('')
    .max(30),
  firstName: Joi
    .string()
    .allow('')
    .max(30),
  middleName: Joi
    .string()
    .allow('')
    .max(30),
  password: Joi
    .string()
    .min(6)
    .max(30)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

exports.postRefreshToken = Joi.object({
  username: Joi
    .string()
    .alphanum()
    .min(2)
    .max(30)
    .required(),
});
