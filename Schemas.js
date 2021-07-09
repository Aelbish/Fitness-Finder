const BaseJoi = require("joi");
//package that tracks basic html tags and prevents from basic hacks
const sanitizeHtml = require("sanitize-html");

//Our custom validator to remove html tags from query
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.workoutPlanSchema = Joi.object({
  workout: Joi.object({
    title: Joi.string().required().escapeHTML(),
    goal: Joi.string()
      .valid(
        "Build Muscle",
        "Increase Strength",
        "Lose Fat/Tone Up",
        "Increase Endurance/Stamina"
      )
      .required().escapeHTML(),
    category: Joi.string()
      .valid(
        "Single Muscle Group",
        "Full Body",
        "Cardio/HITT",
        "Push/Pull/Leg",
        "3-Day Split",
        "4-Day Split",
        "5-Day Split",
        "Custom Split"
      )
      .required().escapeHTML(),
    trainingLevel: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      .required().escapeHTML(),
    programDuration: Joi.string().required().escapeHTML(),
    daysPerWeek: Joi.string()
      .valid("1", "2", "3", "4", "5", "6", "7")
      .required().escapeHTML(),
    timePerWorkout: Joi.string().required().escapeHTML(),
    gender: Joi.string().valid("Male", "Female", "All Genders").required().escapeHTML(),
    summary: Joi.string().required().escapeHTML(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).escapeHTML(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,13}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  bio: Joi.string().escapeHTML(),
  location: Joi.string().escapeHTML(),
  // images: Joi.string(),
  bench: Joi.number().integer().min(0).max(2000),
  dead: Joi.number().integer().min(0).max(2000),
  squat: Joi.number().integer().min(0).max(2000),
  deleteImages: Joi.array(),
}).required();
