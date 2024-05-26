const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createFriendRequest,
  respondToFriendRequest,
} = require("../controllers/friendRequests");

router.use(passport.authenticate("jwt", { session: false }));

router.route("/").post(createFriendRequest).patch(respondToFriendRequest);

module.exports = router;
