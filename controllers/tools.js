module.exports.renderBmrCalculator = (req, res) => {
  res.render("tools/bmr.ejs");
};

module.exports.renderBmiCalculator = (req, res) => {
  res.render("tools/bmi.ejs");
};

module.exports.renderCalorieCalculator = (req, res) => {
  res.render("tools/calorieCalculator.ejs");
};

module.exports.renderAllTools = (req, res) => {
  res.render("tools/index.ejs");
};
