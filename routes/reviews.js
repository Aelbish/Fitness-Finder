const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../Schemas");
const tryCatchAsync = require("../utils/tryCatchAsync");
const ExpressError = require("../utils/ExpressError");
const WorkoutPlan = require("../models/workoutPlan");
const Review = require("../models/review");

//Server-side data validator middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
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

router.delete(
  "/:reviewId",
  tryCatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await WorkoutPlan.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/workoutplans/${id}`);
  })
);

module.exports = router;
