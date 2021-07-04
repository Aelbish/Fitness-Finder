const WorkoutPlan = require("../models/workoutPlan");
const User = require("../models/user");
const {
  goals,
  categories,
  trainingLevels,
  daysPerWeek,
  genders,
} = require("../utils/selectOption");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  if (category) {
    const workout = await WorkoutPlan.find({ category });
    res.render("workoutPlans/index.ejs", { workout, category });
  } else {
    const workout = await WorkoutPlan.find({});
    res.render("workoutPlans/index.ejs", { workout, category: "All" });
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("workoutPlans/new.ejs", {
    goals,
    categories,
    trainingLevels,
    daysPerWeek,
    genders,
  });
};

module.exports.createWorkoutPlan = async (req, res, next) => {
  const workout = new WorkoutPlan(req.body.workout);
  workout.author = req.user._id;
  await workout.save();
  req.flash("success", "New workout plan has been added");
  res.redirect(`/workoutplans/${workout._id}`);
};

module.exports.renderSavedWorkouts = async (req, res) => {
  const user = await User.findById(req.user._id).populate("savedWorkouts");
  res.render("workoutplans/save.ejs", { user });
};

module.exports.saveWorkout = async (req, res) => {
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
};

module.exports.removeSavedWorkout = async (req, res) => {
  const { id } = req.params;
  await User.updateMany({}, { $pull: { savedWorkouts: id } });
  req.flash(
    "success",
    "Workout plan has been removed from your saved workouts"
  );
  res.redirect("/workoutplans");
};

module.exports.renderEditForm = async (req, res) => {
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
};

module.exports.showWorkoutPlan = async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!workout) {
    req.flash("error", "Cannot find that workout plan");
    return res.redirect("/workoutplans");
  }
  res.render("workoutplans/show.ejs", { workout });
};

module.exports.updateWorkoutPlan = async (req, res) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findByIdAndUpdate(id, {
    ...req.body.workout,
  });
  req.flash("success", "Workout plan has been updated");
  res.redirect(`/workoutplans/${workout._id}`);
};

module.exports.deleteWorkoutPlan = async (req, res) => {
  const { id } = req.params;
  await User.updateMany({}, { $pull: { savedWorkouts: id } });
  await WorkoutPlan.findByIdAndDelete(id);
  req.flash("success", "Workout plan has been deleted");
  res.redirect("/workoutplans");
};
