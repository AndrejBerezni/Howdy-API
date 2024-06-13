const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    if (!query) {
      throw new BadRequestError("Please provide search terms");
    }

    const queryTerms = query
      .trim()
      .split(/\s+/)
      .map((term) => new RegExp(term, "i"));

    const users = await User.find({
      $or: [
        { firstName: { $in: queryTerms } },
        { lastName: { $in: queryTerms } },
        { nickname: { $in: queryTerms } },
        { email: { $in: queryTerms } },
      ],
    })
      .select("nickname email profilePicture firstName lastName")
      .skip(skip)
      .limit(limit)
      .sort({ nickname: -1 });

    res
      .status(StatusCodes.OK)
      .json({ numberOfResults: users.length, results: users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new NotFoundError(`User with id: ${id} does not exist.`);
    }

    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "nickname email profilePicture firstName lastName status"
    );

    res.status(StatusCodes.OK).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        profilePicture: user.profilePicture,
        status: user.status,
      },
      friends,
      friendRequests: user.friendRequests,
      chats: user.chats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchUsers, getUser };
