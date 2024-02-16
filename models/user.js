const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handeleMongooseError = require("../helpers/handeleMongooseError");
const { token } = require("morgan");

const regularex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: regularex,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: {
      type: String,
      required: true,
    },

    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },

  { versionKey: false, timestamps: true }
);

userSchema.post("save", handeleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(regularex).required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password must be longer than 6 symbols",
  }),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(regularex).required().messages({
    "any.required": "Enter email",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Enter password",
  }),
});

const favoriteSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.required":
      "subscription must be only one of 3 categorii: starter, pro, business",
  }),
});

const schemas = {
  userSchema,
  registerSchema,
  loginSchema,
  favoriteSchema,
};

const User = model("user", userSchema);

model.experts = User;

module.exports = { User, schemas };
