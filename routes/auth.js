const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  discordLogin,
  validate,
} = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/discord/login").get(passport.authenticate("discord"));

router
  .route("/discord/redirect")
  .get(passport.authenticate("discord", { session: false }), discordLogin);

router
  .route("/validate")
  .get(passport.authenticate("jwt", { session: false }), validate);

module.exports = router;
