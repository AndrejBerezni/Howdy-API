const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        friends: user.friends,
        chats: user.chats,
        friendRequests: user.friendRequests,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const { user } = req.body;
  res.send(`${user} registered`);
};

module.exports = { register, login };
