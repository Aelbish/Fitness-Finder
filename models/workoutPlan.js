const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const WorkoutPlanSchema = new Schema({
  title: String,
  goal: {
    type: String,
    enum: [
      "Build Muscle",
      "Increase Strength",
      "Lose Fat/Tone Up",
      "Increase Endurance/Stamina",
    ],
  },
  category: {
    type: String,
    enum: [
      "Single Muscle Group",
      "Full Body",
      "Cardio/HITT",
      "Push/Pull/Leg",
      "3-Day Split",
      "4-Day Split",
      "5-Day Split",
      "Custom Split",
    ],
  },
  trainingLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  programDuration: String,
  daysPerWeek: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7"],
  },
  timePerWorkout: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "All Genders"],
  },
  summary: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//This middleware will be executed every time we findByIdAndDelete() according to mongoose docs
//In delete route for workoutplans and reviews
//.post means after findByIdAndDelete()
WorkoutPlanSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
