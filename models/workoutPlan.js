const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkoutPlanSchema = new Schema({
  title: String,
  duration: String,
  category: {
    type: String,
    enum: [
      "Whole-body Split",
      "Upper and Lower body Split",
      "Push/Pull/Leg",
      "4-Day Split",
      "5-day Split",
    ],
  },
  description: String,
  notes: String,
});

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
