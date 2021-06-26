const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const WorkoutPlan = require("./models/workoutPlan");

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

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parse req.body from a form
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/workoutplans", async (req, res) => {
  const workoutPlans = await WorkoutPlan.find({});
  res.render("workoutPlans/index.ejs", { workoutPlans });
});

app.get("/workoutplans/new", (req, res) => {
  res.render("workoutPlans/new.ejs");
});

app.post("/workoutplans", async (req, res) => {
  const workout = new WorkoutPlan(req.body.workout);
  await workout.save();
  res.redirect(`/workoutplans/${workout._id}`);
});

app.get("/workoutplans/:id", async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id);
  console.log(workout);
  res.render("workoutplans/show.ejs", { workout });
});

app.get("/workoutplans/:id/edit", async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id);
  res.render("workoutplans/edit.ejs", { workout });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
