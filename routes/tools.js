const express = require("express");
const router = express.Router();
const tools = require("../controllers/tools");

router.get("/", tools.renderAllTools);

router.get("/bmr", tools.renderBmrCalculator);

router.get("/bmi", tools.renderBmiCalculator);

router.get("/caloriecalculator", tools.renderCalorieCalculator);

module.exports = router;
