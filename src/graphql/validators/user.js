import Joi from "@hapi/joi";

const name = Joi.string().max(255).required().label("Name");
const email = Joi.string().email().required().label("Email");
const username = Joi.string().max(255).min(6).required().label("Username");
const password = Joi.string()
  .max(30)
  .min(8)
  .required()
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
  .label("Password")
  .messages({
    "string.pattern.base": `"Password" must have atleast one lowercase letter, one uppercase letter and one digit.`,
  });

export const loginRules = Joi.object({
  username,
  password,
});

export const registerRules = Joi.object({
  name,
  email,
  username,
  password,
});
