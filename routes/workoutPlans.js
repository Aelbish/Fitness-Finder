const express = require("express");
const router = express.Router();
const workoutPlans = require("../controllers/workoutPlans");
const { isLoggedIn, isAuthor, validateWorkout } = require("../middleware");
const tryCatchAsync = require("../utils/tryCatchAsync");

router
  .route("/")
  .get(tryCatchAsync(workoutPlans.index))
  .post(
    isLoggedIn,
    validateWorkout,
    tryCatchAsync(workoutPlans.createWorkoutPlan)
  );

router.get("/category", tryCatchAsync(workoutPlans.indexCategory));

router.get("/goal", tryCatchAsync(workoutPlans.indexGoal));

router.get("/categorized", workoutPlans.indexHome);

router.get("/new", isLoggedIn, workoutPlans.renderNewForm);

router.get(
  "/saved",
  isLoggedIn,
  tryCatchAsync(workoutPlans.renderSavedWorkouts)
);

router.get(
  "/posted",
  isLoggedIn,
  tryCatchAsync(workoutPlans.renderPostedWorkouts)
);

router
  .route("/:id/save")
  .get(isLoggedIn, tryCatchAsync(workoutPlans.saveWorkout))
  .delete(isLoggedIn, tryCatchAsync(workoutPlans.removeSavedWorkout));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  tryCatchAsync(workoutPlans.renderEditForm)
);

router
  .route("/:id")
  .get(tryCatchAsync(workoutPlans.showWorkoutPlan))
  .put(
    isLoggedIn,
    isAuthor,
    validateWorkout,
    tryCatchAsync(workoutPlans.updateWorkoutPlan)
  )
  .delete(isLoggedIn, isAuthor, tryCatchAsync(workoutPlans.deleteWorkoutPlan));

module.exports = router;
