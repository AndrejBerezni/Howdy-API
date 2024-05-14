const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({
      user: {
        uid: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      throw new BadRequestError("Please provide login credentials");
    }

    const user = await User.findOne({
      $or: [{ email: login }, { nickname: login }],
    });
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Wrong password");
    }

    res.json({
      user: {
        uid: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
