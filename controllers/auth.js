const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { issueJWT } = require("../utilities/tokenActions");

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body, authMethod: "email" });

    const token = issueJWT(user._id);

    res.status(StatusCodes.CREATED).json({
      user: {
        uid: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
      },
      token,
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
      authMethod: "email",
      $or: [{ email: login }, { nickname: login }],
    });
    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Wrong password");
    }

    const token = issueJWT(user._id);

    res.json({
      user: {
        uid: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const oAuthLogin = (req, res) => {
  const token = issueJWT(req.user._id);

  res.redirect(
    `http://localhost:5173/oauth?token=${token.token}&uid=${req.user._id}&nickname=${req.user.nickname}&email=${req.user.email}`
  );
};

const validate = (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Token valid" });
};

module.exports = { register, login, oAuthLogin, validate };
