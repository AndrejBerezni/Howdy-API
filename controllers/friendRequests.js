const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const mongoose = require("mongoose");

const createFriendRequest = async (req, res, next) => {
  try {
    const { sender, recipient, message } = req.body;

    if (
      !sender ||
      !recipient ||
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(recipient) ||
      sender === recipient
    ) {
      throw new BadRequestError(
        "Please provide sender and recipient to create friend request"
      );
    }

    // find users, to verify if they exist
    const senderUser = await User.findById(sender);
    const recipientUser = await User.findById(recipient);

    if (!senderUser || !recipientUser) {
      throw new BadRequestError(
        "Please provide valid sender and recipient ids to create friend request"
      );
    }

    // check if users are friends already
    const areFriends =
      senderUser.friends.includes(recipient) ||
      recipientUser.friends.includes(sender);
    if (areFriends) {
      throw new BadRequestError("Users are already friends");
    }

    //check if request with same users already exists
    const requestExists = await FriendRequest.findOne({
      $or: [
        { sender, recipient, status: "pending" },
        { sender: recipient, recipient: sender, status: "pending" },
      ],
    });
    if (requestExists) {
      throw new BadRequestError(
        "Pending requests between these users already exists"
      );
    }

    const newFriendRequest = await FriendRequest.create({
      sender,
      recipient,
      message,
      status: "pending",
    });

    // modifying retrieved objects and saving them, instead of performing findByIdAndUpdate, since I trust it would be more performant
    senderUser.friendRequests.sent.push(newFriendRequest._id);
    await senderUser.save();

    recipientUser.friendRequests.received.push(newFriendRequest._id);
    await recipientUser.save();

    res.status(StatusCodes.CREATED).json({
      friendRequest: newFriendRequest,
      message: "Friend request successfully created",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createFriendRequest };
