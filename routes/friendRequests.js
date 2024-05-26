const express = require("express");
const router = express.Router();
const passport = require("passport");
const { createFriendRequest } = require("../controllers/friendRequests");

// router.use(passport.authenticate("jwt", { session: false }));

router.route("/create").post(createFriendRequest);

module.exports = router;
