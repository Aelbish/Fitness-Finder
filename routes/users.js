const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const tryCatchAsync = require("../utils/tryCatchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post(
  "/register",
  tryCatchAsync(async (req, res, next) => {
    try {
      const { email, username, password} = req.body;
      const user = new User({ email, username});
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Fitness Finder");
        res.redirect("/workoutplans");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/workoutplans";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/workoutplans");
});

router.get(
  "/users/:id/edit",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("users/edit.ejs", { user });
  })
);

router.put(
  "/users/:id/edit",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Profile has been updated");
    res.redirect(`/users/${id}`);
  })
);

router.get(
  "/users/:id",
  isLoggedIn,
  tryCatchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("users/show.ejs", { user });
  })
);

module.exports = router;
