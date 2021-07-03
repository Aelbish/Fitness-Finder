const { workoutPlanSchema, reviewSchema } = require("./Schemas");
const ExpressError = require("./utils/ExpressError");
const WorkoutPlan = require("./models/workoutPlan");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

//Server-side data validator middleware
module.exports.validateWorkout = (req, res, next) => {
  const { error } = workoutPlanSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const workout = await WorkoutPlan.findById(id);
  if (!workout.author.equals(req.user._id)) {
    req.flash("error", "You do not have that permission");
    return res.redirect(`/workoutplans/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have that permission");
    return res.redirect(`/workoutplans/${id}`);
  }
  next();
};

//Server-side data validator middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
