// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const User = require("./models/user");

//Router objects for routes
const workoutPlanRoutes = require("./routes/workoutPlans");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const toolRoutes = require("./routes/tools");

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

//Disable basic mongo injection
app.use(mongoSanitize());

const sessionConfig = {
  name: "xor",
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

//Helmet configurations for CSP(Content-Security-Policy)
const scriptSrcUrls = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css",
  `https://cdn.tiny.cloud/1/${process.env.TINYMCE_KEY}/tinymce/5/tinymce.min.js`,
  `https://cdn.tiny.cloud/1/${process.env.TINYMCE_KEY}/tinymce/`,
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
  `https://cdn.tiny.cloud/1/${process.env.TINYMCE_KEY}/tinymce/`,
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["data:", "https://www.mealpro.net/"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com/",
        "https://img.icons8.com/",
        "https://sp.tinymce.com/",
        `https://cdn.tiny.cloud/1/${process.env.TINYMCE_KEY}/tinymce/5/tinymce.min.js`,
        "https://ak.picdn.net/shutterstock/videos/1027807277/thumb/6.jpg",
        "https://www.mealpro.net/wp-content/uploads/2017/05/BMI-Widget-Chart.png",
        "https://www.mealpro.net/wp-content/uploads/2017/05/BMI-Widget-Children-Chart.png",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//Store and remove user from a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for flash
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Use routes for workoutplans and set the prefix as /workoutplans
app.use("/workoutplans", workoutPlanRoutes);
//Use routes for reviews and set the prefix as /workoutplans/:id/reviews
app.use("/workoutplans/:id/reviews", reviewRoutes);

app.use("/", userRoutes);
app.use("/tools", toolRoutes);

app.get("/fakeuser", async (req, res) => {
  const user = new User({ username: "admin", email: "admin@gmail.com" });
  const newUser = await User.register(user, "admin");
  res.send(newUser);
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
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
