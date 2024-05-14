const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      message: "Something went wrong, please try again later.",
      error: err,
    });
};

module.exports = errorHandlerMiddleware;
