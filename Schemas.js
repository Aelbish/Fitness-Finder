const Joi = require("joi");
module.exports.workoutPlanSchema = Joi.object({
  workout: Joi.object({
    title: Joi.string().required(),
    goal: Joi.string()
      .valid(
        "Build Muscle",
        "Increase Strength",
        "Lose Fat/Tone Up",
        "Increase Endurance/Stamina"
      )
      .required(),
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
      .required(),
    trainingLevel: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      .required(),
    programDuration: Joi.string().required(),
    daysPerWeek: Joi.string()
      .valid("1", "2", "3", "4", "5", "6", "7")
      .required(),
    timePerWorkout: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female", "All Genders").required(),
    summary: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
