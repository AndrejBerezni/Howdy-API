require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const passport = require("passport");

module.exports = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { oAuthId: profile.id },
          {
            nickname: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          }
        ); //adding update in case user changed display name or email on google, so we can display them correctly

        if (!user) {
          //creating a new try/catch block, since in case user is unable to be created,
          //which will happen if email or nickname already exist,
          //we don't want to proceed with standard error handling which will return json,
          //but we want to proceed to client oauth page that will display error and explain that it was not possible to authenticate using this method,
          //so we are not passing err, but null, and false for user
          try {
            const newUser = await User.create({
              nickname: profile.displayName,
              email: profile.emails[0].value,
              authMethod: "google",
              oAuthId: profile.id,
              profilePicture: profile.photos[0].value,
            });

            return done(null, newUser);
          } catch (err) {
            return done(null, false);
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
