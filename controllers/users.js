const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

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
      res.redirect("/workoutplans/categorized");
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
  const redirectUrl = req.session.returnTo || "/workoutplans/categorized";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/workoutplans/categorized");
};

module.exports.renderUserEditForm = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "Cannot find that user");
    return res.redirect("/workoutplans/categorized");
  }
  res.render("users/edit.ejs", { user });
};

module.exports.updateUser = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body });
  if (!user) {
    req.flash("error", "Cannot find that user");
    return res.redirect("/workoutplans/categorized");
  }
  user.geometry = geoData.body.features[0].geometry;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  user.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await user.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await user.save();
  req.flash("success", "Profile has been updated");
  res.redirect(`/users/${id}`);
};

module.exports.viewUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "Cannot find that user");
    return res.redirect("/workoutplans/categorized");
  }
  res.render("users/show.ejs", { user });
};

module.exports.viewUserClusterMap = async (req, res) => {
  const users = await User.find({});
  res.render("users/userClusterMap.ejs", { users });
};

module.exports.renderGymMap = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "Cannot find that user");
    return res.redirect("/workoutplans/categorized");
  }
  res.render("users/gymMap.ejs", {user});
};
