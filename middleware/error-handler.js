const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong, please try again later.",
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors).map(
      (item) => item.message
    )[0];
    // .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.message = `User with that ${Object.keys(
      err.keyValue
    )} alredy exists, please choose another ${Object.keys(err.keyValue)}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json({
    message: customError.message,
  });
};

module.exports = errorHandlerMiddleware;
