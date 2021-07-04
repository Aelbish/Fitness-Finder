const WorkoutPlan = require("../models/workoutPlan");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const workout = await WorkoutPlan.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  workout.reviews.push(review);
  await review.save();
  await workout.save();
  req.flash("success", "Your review has been added");
  res.redirect(`/workoutplans/${workout._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await WorkoutPlan.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Your review has been deleted");
  res.redirect(`/workoutplans/${id}`);
};
