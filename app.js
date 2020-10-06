const express = require("express");
const authRoutes = require("./routes/auth-route");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

// View engine setup
app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.KEY_SESSION],
  })
);

// Initialize passport
app.use(passport.initialize());

app.use(passport.session());

// Connect to MongoDb
mongoose.connect(
  "mongodb://localhost:27017/ninja-oauth",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDb");
  }
);

// Set ip routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () =>
  console.log("Server is up and running at http://localhost:3000")
);
