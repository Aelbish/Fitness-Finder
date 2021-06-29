const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkoutPlanSchema = new Schema({
  title: String,
  duration: String,
  daysPerWeek: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7"],
  },
  category: {
    type: String,
    enum: [
      "Single body part Workout",
      "Whole-body Split",
      "Upper and Lower body Split",
      "Push/Pull/Leg",
      "4-Day Split",
      "5-day Split",
      "Custom Split",
    ],
  },
  description: String,
  notes: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Both"],
  },
});

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
