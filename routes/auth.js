const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  oAuthLogin,
  validate,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/discord/login").get(passport.authenticate("discord"));

router.route("/discord/redirect").get(
  passport.authenticate("discord", {
    session: false,
    failureRedirect: "http://localhost:5173/oauth",
  }), //without search params in oauth URL, client will display error saying that it was not possible to complete login with this auth method
  oAuthLogin
);

router.route("/google/login").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/google/redirect").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/oauth",
  }),
  oAuthLogin
);

router
  .route("/validate")
  .get(passport.authenticate("jwt", { session: false }), validate);

module.exports = router;
