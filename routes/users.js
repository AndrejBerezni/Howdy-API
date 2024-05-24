const express = require("express");
const router = express.Router();
const passport = require("passport");
const { searchUsers, getUser } = require("../controllers/users");

router.use(passport.authenticate("jwt", { session: false }));

router.route("/search").get(searchUsers);
router.route("/:id").get(getUser);

module.exports = router;
