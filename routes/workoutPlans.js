const express = require("express");
const router = express.Router();
const { workoutPlanSchema } = require("../Schemas");
const { isLoggedIn } = require("../middleware");
const tryCatchAsync = require("../utils/tryCatchAsync");
const ExpressError = require("../utils/ExpressError");
const {
  goals,
  categories,
  trainingLevels,
  daysPerWeek,
  genders,
} = require("../utils/selectOption");
const WorkoutPlan = require("../models/workoutPlan");

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

router.get(
  "/",
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

router.get("/new", isLoggedIn, (req, res) => {
  res.render("workoutPlans/new.ejs", {
    goals,
    categories,
    trainingLevels,
    daysPerWeek,
    genders,
  });
});

router.post(
  "/",
  isLoggedIn,
  validateWorkout,
  tryCatchAsync(async (req, res, next) => {
    const workout = new WorkoutPlan(req.body.workout);
    await workout.save();
    req.flash("success", "New workout plan has been added");
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

router.get(
  "/:id",
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findById(id).populate("reviews");
    if (!workout) {
      req.flash("error", "Cannot find that workout plan");
      return res.redirect("/workoutplans");
    }
    res.render("workoutplans/show.ejs", { workout });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findById(id);
    if (!workout) {
      req.flash("error", "Cannot find that workout plan");
      return res.redirect("/workoutplans");
    }
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

router.put(
  "/:id",
  isLoggedIn,
  validateWorkout,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findByIdAndUpdate(id, {
      ...req.body.workout,
    });
    req.flash("success", "Workout plan has been updated");
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    await WorkoutPlan.findByIdAndDelete(id);
    req.flash("success", "Workout plan has been deleted");
    res.redirect("/workoutplans");
  })
);

module.exports = router;
