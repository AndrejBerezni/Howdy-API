const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getUsers = async (req, res, next) => {
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

module.exports = { getUsers };
