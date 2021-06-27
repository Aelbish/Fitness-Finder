const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
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

//for including boilerplate
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parse req.body from a form
app.use(express.urlencoded({ extended: true }));

//to enable put request from html form
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/workoutplans", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const workout = await WorkoutPlan.find({ category });
    res.render("workoutPlans/index.ejs", { workout, category });
  } else {
    const workout = await WorkoutPlan.find({});
    res.render("workoutPlans/index.ejs", { workout, category: "All" });
  }
});

app.get("/workoutplans/new", (req, res) => {
  const daysPerWeek = ["1", "2", "3", "4", "5", "6", "7"];
  const categories = [
    "Single body part Workout",
    "Whole-body Split",
    "Upper and Lower body Split",
    "Push/Pull/Leg",
    "4-Day Split",
    "5-day Split",
    "Custom Split",
  ];
  res.render("workoutPlans/new.ejs", { daysPerWeek, categories });
});

app.post("/workoutplans", async (req, res) => {
  const workout = new WorkoutPlan(req.body.workout);
  workout.daysPerWeek = req.body.daysPerWeek;
  workout.category = req.body.category;
  await workout.save();
  res.redirect(`/workoutplans/${workout._id}`);
});

app.get("/workoutplans/:id", async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id);
  res.render("workoutplans/show.ejs", { workout });
});

app.get("/workoutplans/:id/edit", async (req, res) => {
  const daysPerWeek = ["1", "2", "3", "4", "5", "6", "7"];
  const categories = [
    "Single body part Workout",
    "Whole-body Split",
    "Upper and Lower body Split",
    "Push/Pull/Leg",
    "4-Day Split",
    "5-day Split",
    "Custom Split",
  ];
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id);
  res.render("workoutplans/edit.ejs", { workout, daysPerWeek, categories });
});

app.put("/workoutplans/:id", async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findByIdAndUpdate(id, {
    ...req.body.workout,
  });
  workout.daysPerWeek = req.body.daysPerWeek;
  workout.category = req.body.category;
  await workout.save();
  res.redirect(`/workoutplans/${workout._id}`);
});

app.delete("/workoutplans/:id", async (req, res) => {
  const { id } = req.params;
  await WorkoutPlan.findByIdAndDelete(id);
  res.redirect("/workoutplans");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
