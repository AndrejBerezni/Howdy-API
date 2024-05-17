require("dotenv").config();
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/User");
const passport = require("passport");

module.exports = passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/discord/redirect", //to be updated when app is deployed
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOneAndUpdate(
          { oAuthId: profile.id },
          { nickname: profile.global_name, email: profile.email }
        ); //adding update in case user changed display name or email on discord, so we can display them correctly

        if (!user) {
          //creating a new try/catch block, since in case user is unable to be created,
          //which will happen if email or nickname already exist,
          //we don't want to proceed with standard error handling which will return json,
          //but we want to proceed to client oauth page that will display error and explain that it was not possible to authenticate using this method,
          //so we are not passing err, but null, and false for user
          try {
            const newUser = await User.create({
              nickname: profile.global_name,
              email: profile.email,
              authMethod: "discord",
              oAuthId: profile.id,
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
