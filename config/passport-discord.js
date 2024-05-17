require("dotenv").config();
const DiscordStrategy = require("passport-discord").Strategy;
const DiscordUser = require("../models/DiscordUser");
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
        const user = await DiscordUser.findOne({ discordId: profile.id });
        if (!user) {
          const newUser = await DiscordUser.create({ discordId: profile.id });
          return done(null, {
            uid: newUser._id,
            nickname: profile.global_name,
          });
        }
        return done(null, {
          uid: user._id,
          nickname: profile.global_name,
        });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
