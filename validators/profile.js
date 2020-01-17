const Joi = require('@hapi/joi');

exports.patchProfile = Joi.object({
  firstName: Joi
    .string()
    .alphanum()
    .allow('')
    .max(30),
  middleName: Joi
    .string()
    .alphanum()
    .allow('')
    .max(30),
  surName: Joi
    .string()
    .alphanum()
    .allow('')
    .max(30),
  oldPassword: Joi
    .string()
    .allow('')
    .max(30)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  newPassword: Joi
    .string()
    .allow('')
    .max(30)
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});