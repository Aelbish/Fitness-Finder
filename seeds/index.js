const mongoose = require("mongoose");
const WorkoutPlan = require("../models/workoutPlan");

//Connecting to Mongo
mongoose.connect("mongodb://localhost:27017/fitness-finder", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//Handling connection error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
  console.log("Connected to database");
});

const workoutPlanTypes = [
  "Single Muscle Group",
  "Full Body",
  "Cardio/HITT",
  "Push/Pull/Leg",
  "3-Day Split",
  "4-Day Split",
  "5-Day Split",
  "Custom Split",
];
const goals = [
  "Build Muscle",
  "Increase Strength",
  "Lose Fat/Tone Up",
  "Increase Endurance/Stamina",
];
const trainingLevels = ["Beginner", "Intermediate", "Advanced"];
const days = ["4", "5", "6"];
const genders = ["Male", "Female", "All Genders"];

const seedDB = async () => {
  await WorkoutPlan.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random8 = Math.floor(Math.random() * 8);
    const random3 = Math.floor(Math.random() * 3);
    const random4 = Math.floor(Math.random() * 4);
    const work = new WorkoutPlan({
      title: workoutPlanTypes[random8],
      goal: goals[random4],
      category: workoutPlanTypes[random8],
      trainingLevel: trainingLevels[random3],
      programDuration: "8 weeks",
      daysPerWeek: days[random3],
      timePerWorkout: "1 hr",
      gender: genders[random3],
      summary: `${workoutPlanTypes[random8]} program generated randomly. This is a fake workout plan. This fake program is an eight week program.`,
      description: "The full workout will go here.",
      author: "60df7721e35c7a2b4ca6b50f",
    });
    await work.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
