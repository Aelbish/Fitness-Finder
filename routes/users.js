const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn, validateUser, isOwner } = require("../middleware");
const tryCatchAsync = require("../utils/tryCatchAsync");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(validateUser, tryCatchAsync(users.register));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

router.get("/users/usermapcluster", isLoggedIn, users.viewUserClusterMap);

router.get(
  "/users/:id/findagym",
  isLoggedIn,
  isOwner,
  tryCatchAsync(users.renderGymMap)
);

router
  .route("/users/:id/edit")
  .get(isLoggedIn, isOwner, tryCatchAsync(users.renderUserEditForm))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateUser,
    tryCatchAsync(users.updateUser)
  );

router.get("/users/:id", isLoggedIn, tryCatchAsync(users.viewUser));

module.exports = router;
