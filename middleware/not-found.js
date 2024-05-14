const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "Resource you are trying to access was not found." });
};

module.exports = notFoundMiddleware;
