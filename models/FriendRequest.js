const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
  sender: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  recipient: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: {
    type: String,
    required: true,
    default: "Howdy, please accept my friend request!",
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["accepted", "pending", "declined"],
    required: true,
    default: "pending",
  },
});

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

module.exports = FriendRequest;
