const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateWorkout } = require("../middleware");
const tryCatchAsync = require("../utils/tryCatchAsync");
const {
  goals,
  categories,
  trainingLevels,
  daysPerWeek,
  genders,
} = require("../utils/selectOption");
const WorkoutPlan = require("../models/workoutPlan");
const User = require("../models/user");

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
    workout.author = req.user._id;
    await workout.save();
    req.flash("success", "New workout plan has been added");
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

router.get(
  "/saved",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate("savedWorkouts");
    res.render("workoutplans/save.ejs", { user });
  })
);

router.get(
  "/:id/save",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const workout = await WorkoutPlan.findById(id);
    var duplicateSave = false;
    for (let work of user.savedWorkouts) {
      if (work._id.equals(id)) {
        duplicateSave = true;
      }
    }
    if (!duplicateSave) {
      user.savedWorkouts.push(workout._id);
      await user.save();
      req.flash("success", "Workout plan has been saved to your profile");
      res.redirect(`/workoutplans/${workout._id}`);
    } else {
      req.flash(
        "error",
        "Workout plan has been previously saved to your profile"
      );
      res.redirect(`/workoutplans/${workout._id}`);
    }
  })
);

router.delete(
  "/:id/save",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    await User.updateMany({}, { $pull: { savedWorkouts: id } });
    req.flash("success", "Workout plan has been removed from your saved workouts");
    res.redirect("/workoutplans");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
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

router.get(
  "/:id",
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await WorkoutPlan.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!workout) {
      req.flash("error", "Cannot find that workout plan");
      return res.redirect("/workoutplans");
    }
    res.render("workoutplans/show.ejs", { workout });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
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
  isAuthor,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    await User.updateMany({}, { $pull: { savedWorkouts: id } });
    await WorkoutPlan.findByIdAndDelete(id);
    req.flash("success", "Workout plan has been deleted");
    res.redirect("/workoutplans");
  })
);

module.exports = router;
