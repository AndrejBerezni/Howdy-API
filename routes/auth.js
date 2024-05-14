const express = require("express");
const router = express.Router();
const passport = require("passport");

const { register, login } = require("../controllers/auth");

router.route("/register").post(register);

router.route("/login").post(login);

// router
//   .route("/test")
//   .get(passport.authenticate("jwt", { session: false }), (req, res) => {
//     res.send("jwt works");
//   });

module.exports = router;
