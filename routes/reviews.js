const express = require("express");
const router = express.Router({ mergeParams: true });
const tryCatchAsync = require("../utils/tryCatchAsync");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  tryCatchAsync(reviews.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  tryCatchAsync(reviews.deleteReview)
);

module.exports = router;
