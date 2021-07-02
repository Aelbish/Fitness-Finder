const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

//Router objects for routes
const workoutPlans = require("./routes/workoutPlans");
const reviews = require("./routes/reviews");

//Connecting to Mongo
mongoose.connect("mongodb://localhost:27017/fitness-finder", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//Handling connection error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
  console.log("Connected to database");
});

const app = express();

//for including boilerplate
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//parse req.body from a form
app.use(express.urlencoded({ extended: true }));

//to enable put request from html form
app.use(methodOverride("_method"));

//to serve static files (scripts and css) in our html files
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//Middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Use routes for workoutplans and set the prefix as /workoutplans
app.use("/workoutplans", workoutPlans);
//Use routes for reviews and set the prefix as /workoutplans/:id/reviews
app.use("/workoutplans/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

//Catch all other undefined routes, order of this is important, this is at the end
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Custom error handler (middleware)
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
