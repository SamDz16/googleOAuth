const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user-model");

require("dotenv").config();

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

const createUser = ({ displayName, id, photos }) => {
  return new User({
    username: displayName,
    googleId: id,
    thumbnail: photos[0].value,
  });
};

const addUser = (user) => {
  user.save().then((newUser) => {
    return newUser;
  });
};

passport.use(
  new GoogleStrategy(
    {
      // Options for the strategy
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      let user = null;
      // Check if user already exists in database

      User.findOne({ googleId: profile.id })
        .then((currentUser) => {
          // match ?
          if (currentUser) {
            // already have the usser (Truthy value)
            done(null, currentUser);
          } else {
            // the user doesn't exist in the database (Falsy value)
            const newUser = addUser(createUser(profile));
            done(null, newUser);
          }
        })
        .catch((err) => console.log("ERROR w/ databse", err));
    }
  )
);
