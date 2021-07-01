const Joi = require("joi");
module.exports.workoutPlanSchema = Joi.object({
  workout: Joi.object({
    title: Joi.string().required(),
    duration: Joi.string().required(),
    daysPerWeek: Joi.string()
      .valid("1", "2", "3", "4", "5", "6", "7")
      .required(),
    category: Joi.string()
      .valid(
        "Single body part Workout",
        "Whole-body Split",
        "Upper and Lower body Split",
        "Push/Pull/Leg",
        "4-Day Split",
        "5-day Split",
        "Custom Split"
      )
      .required(),
    gender: Joi.string().valid("Male", "Female", "Both").required(),
    description: Joi.string().required(),
    summary: Joi.string().required(),
  }).required(),
});
