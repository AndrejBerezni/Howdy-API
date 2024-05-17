require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const DiscordUser = require("../models/DiscordUser");
const User = require("../models/User");
const passport = require("passport");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.uid);
      if (!user) {
        const discordUser = await DiscordUser.findById(payload.uid);
        if (!discordUser) {
          return done(null, false);
        }
        return done(null, discordUser);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);
