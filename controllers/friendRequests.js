const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
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
    senderUser.friendRequests.sent.push({
      _id: newFriendRequest._id,
      recipient,
    });
    await senderUser.save();

    recipientUser.friendRequests.received.push({
      _id: newFriendRequest._id,
      sender,
    });
    await recipientUser.save();

    res.status(StatusCodes.CREATED).json({
      friendRequest: newFriendRequest,
      message: "Friend request successfully created",
    });
  } catch (err) {
    next(err);
  }
};

const respondToFriendRequest = async (req, res, next) => {
  try {
    const { requestID, accepted } = req.body;

    //accepted should be 'yes' or 'no' - I did not want to use boolean, since some of the validation,
    // (like the one on the next line), would require additional logic if accepted === false
    if (
      !requestID ||
      !accepted ||
      !mongoose.Types.ObjectId.isValid(requestID)
    ) {
      throw new BadRequestError("Missing details to respond to friend request");
    }

    switch (accepted) {
      case "yes": //update request status to 'accepted', remove request from User documents, and add users to each other as friends
        const acceptedRequest = await FriendRequest.findByIdAndUpdate(
          requestID,
          { status: "accepted" }
        );
        const acceptSender = await User.findByIdAndUpdate(
          acceptedRequest.sender,
          {
            $pull: { "friendRequests.sent": { _id: requestID } },
            $push: { friends: acceptedRequest.recipient },
          }
        );
        const acceptRecipient = await User.findByIdAndUpdate(
          acceptedRequest.recipient,
          {
            $pull: { "friendRequests.received": { _id: requestID } },
            $push: { friends: acceptedRequest.sender },
          }
        );
        res.status(StatusCodes.OK).json({
          message: `Users with ids ${acceptSender._id} and ${acceptRecipient._id} are now friends`,
        });
        break;
      case "no": // update request status to 'declined' and remove request from User documents
        const declinedRequest = await FriendRequest.findByIdAndUpdate(
          requestID,
          { status: "declined" }
        );
        const declinedSender = await User.findByIdAndUpdate(
          declinedRequest.sender,
          {
            $pull: { "friendRequests.sent": { _id: requestID } },
          }
        );
        const declinedRecipient = await User.findByIdAndUpdate(
          declinedRequest.recipient,
          {
            $pull: { "friendRequests.received": { _id: requestID } },
          }
        );
        res.status(StatusCodes.OK).json({
          message: `User with id: ${declinedRecipient._id}, declined friend request from user with id: ${declinedSender._id}`,
        });
        break;
      default:
        throw new BadRequestError(
          "Incorrect information about acceptance of request provided - please answer with 'yes' or 'no' "
        );
    }
  } catch (err) {
    next(err);
  }
};

const withdrawFriendRequest = async (req, res, next) => {
  try {
    const { requestID } = req.body;

    if (!requestID || !mongoose.Types.ObjectId.isValid(requestID)) {
      throw new BadRequestError("Please provide valid friend request id");
    }

    const friendRequest = await FriendRequest.findById(requestID);

    if (!friendRequest || friendRequest.status !== "pending") {
      throw new NotFoundError(`Friend request with id: ${requestID} not found`);
    }

    await User.findByIdAndUpdate(friendRequest.sender, {
      $pull: { "friendRequests.sent": { _id: requestID } },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $pull: { "friendRequests.received": { _id: requestID } },
    });

    const deletedRequest = await FriendRequest.deleteOne({ _id: requestID });
    if (deletedRequest.deletedCount === 0) {
      throw new CustomAPIErrorError(
        `Unable to withdraw friend request with id: ${requestID} - Please try again later`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: `Successfully withdrawn request with id:${requestID}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFriendRequest,
  respondToFriendRequest,
  withdrawFriendRequest,
};
