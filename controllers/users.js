const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Fitness Finder");
      req.flash(
        "success",
        ` by default your location is set to ${user.location}`
      );
      req.flash(
        "success",
        " update your location in the edit profile page to optimize user experience"
      );
      res.redirect("/workoutplans");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectUrl = req.session.returnTo || "/workoutplans";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/workoutplans");
};

module.exports.renderUserEditForm = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("users/edit.ejs", { user });
};

module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body });
  req.flash("success", "Profile has been updated");
  res.redirect(`/users/${id}`);
};

module.exports.viewUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("users/show.ejs", { user });
};
