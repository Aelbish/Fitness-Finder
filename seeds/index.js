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
  "Whole-body Split",
  "Upper and Lower body Split",
  "Push/Pull/Leg",
  "4-Day Split",
  "5-day Split",
];
const seedDB = async () => {
  await WorkoutPlan.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random5 = Math.floor(Math.random() * 5);
    const work = new WorkoutPlan({
      title: workoutPlanTypes[random5],
      duration: "45 mins",
      daysPerWeek: "3",
      category: workoutPlanTypes[random5],
      description: "This is a randomly generated workout",
      notes: "Take about 2-3 minutes rest between each set",
    });
    await work.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
