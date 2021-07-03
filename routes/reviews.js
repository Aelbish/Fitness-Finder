const express = require("express");
const router = express.Router({ mergeParams: true });
const tryCatchAsync = require("../utils/tryCatchAsync");
const WorkoutPlan = require("../models/workoutPlan");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  tryCatchAsync(async (req, res) => {
    const workout = await WorkoutPlan.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    workout.reviews.push(review);
    await review.save();
    await workout.save();
    req.flash("success", "Your review has been added");
    res.redirect(`/workoutplans/${workout._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  tryCatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await WorkoutPlan.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your review has been deleted");
    res.redirect(`/workoutplans/${id}`);
  })
);

module.exports = router;
