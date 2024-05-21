const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getUsers } = require("../controllers/users");

router.use(passport.authenticate("jwt", { session: false }));

router.route("/search").get(getUsers);

module.exports = router;
