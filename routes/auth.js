const express = require("express");
const router = express.Router();
const passport = require("passport");

const { register, login, validate } = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

router
  .route("/validate")
  .get(passport.authenticate("jwt", { session: false }), validate);

module.exports = router;
