const Joi = require('@hapi/joi');

exports.postNews = Joi.object({
  text: Joi
    .string()
    .min(5)
    .required(),
  title: Joi
    .string()
    .min(2)
    .required(),
});

exports.patchNews = Joi.object({
  text: Joi
    .string()
    .min(5)
    .required(),
  title: Joi
    .string()
    .min(2)
    .required(),
});