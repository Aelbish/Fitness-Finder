const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { workoutPlanSchema, reviewSchema } = require("./Schemas");
const tryCatchAsync = require("./utils/tryCatchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const WorkoutPlan = require("./models/workoutPlan");
const Review = require("./models/review");

//Connecting to Mongo
mongoose.connect("mongodb://localhost:27017/fitness-finder", {
  useNewUrlParser: true,
  useFindAndModify: false,
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

//Server-side data validator middleware
const validateWorkout = (req, res, next) => {
  const { error } = workoutPlanSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get(
  "/workoutplans",
  tryCatchAsync(async (req, res) => {
    const { category } = req.query;
    if (category) {
      const workout = await WorkoutPlan.find({ category });
      res.render("workoutPlans/index.ejs", { workout, category });
    } else {
      const workout = await WorkoutPlan.find({});
      res.render("workoutPlans/index.ejs", { workout, category: "All" });
    }
  })
);

app.get("/workoutplans/new", (req, res) => {
  const goals = [
    "Build Muscle",
    "Increase Strength",
    "Increase Endurance/Stamina",
    "Lose Fat/Tone Up",
  ];
  const categories = [
    "Single Muscle Group",
    "Full Body",
    "Cardio/HITT",
    "Push/Pull/Leg",
    "3-Day Split",
    "4-Day Split",
    "5-Day Split",
    "Custom Split",
  ];
  const trainingLevels = ["Beginner", "Intermediate", "Advanced"];
  const daysPerWeek = ["1", "2", "3", "4", "5", "6", "7"];
  const genders = ["Male", "Female", "All Genders"];
  res.render("workoutPlans/new.ejs", {
    goals,
    categories,
    trainingLevels,
    daysPerWeek,
    genders,
  });
});

app.post(
  "/workoutplans",
  validateWorkout,
  tryCatchAsync(async (req, res, next) => {
    const workout = new WorkoutPlan(req.body.workout);
    await workout.save();
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

app.get(
  "/workoutplans/:id",
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findById(id).populate("reviews");
    res.render("workoutplans/show.ejs", { workout });
  })
);

app.get(
  "/workoutplans/:id/edit",
  tryCatchAsync(async (req, res) => {
    const goals = [
      "Build Muscle",
      "Increase Strength",
      "Increase Endurance/Stamina",
      "Lose Fat/Tone Up",
    ];
    const categories = [
      "Single Muscle Group",
      "Full Body",
      "Cardio/HITT",
      "Push/Pull/Leg",
      "3-Day Split",
      "4-Day Split",
      "5-Day Split",
      "Custom Split",
    ];
    const trainingLevels = ["Beginner", "Intermediate", "Advanced"];
    const daysPerWeek = ["1", "2", "3", "4", "5", "6", "7"];
    const genders = ["Male", "Female", "All Genders"];
    const { id } = req.params;
    const workout = await WorkoutPlan.findById(id);
    res.render("workoutplans/edit.ejs", {
      workout,
      goals,
      categories,
      trainingLevels,
      daysPerWeek,
      genders,
    });
  })
);

app.put(
  "/workoutplans/:id",
  validateWorkout,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findByIdAndUpdate(id, {
      ...req.body.workout,
    });
    await workout.save();
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

app.delete(
  "/workoutplans/:id",
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    await WorkoutPlan.findByIdAndDelete(id);
    res.redirect("/workoutplans");
  })
);

app.post(
  "/workoutplans/:id/reviews",
  validateReview,
  tryCatchAsync(async (req, res) => {
    const workout = await WorkoutPlan.findById(req.params.id);
    const review = new Review(req.body.review);
    workout.reviews.push(review);
    await review.save();
    await workout.save();
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

app.delete(
  "/workoutplans/:id/reviews/:reviewId",
  tryCatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await WorkoutPlan.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/workoutplans/${id}`);
  })
);
//Catch all other undefined routes, order of this is important, this is at the end
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Custom error handler (middleware)
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
