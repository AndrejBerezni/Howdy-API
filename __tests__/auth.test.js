const { login, register } = require("../controllers/auth");
const { StatusCodes } = require("http-status-codes"); // Import the necessary status codes
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { expect } = require("@jest/globals");

const loginReq = {
  body: {
    login: "username",
    password: "password",
  },
};

const registerReq = {
  body: {
    firstName: "firstName",
    lastName: "lastName",
    nickname: "nickname",
    email: "email@email.com",
    password: "password",
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

describe("email and password login", () => {
  it("user should login with correct credentials", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: "user_id",
      checkPassword: jest.fn().mockResolvedValue(true),
    });
    await login(loginReq, res, next);

    expect(User.findOne).toHaveBeenCalledWith({
      authMethod: "email",
      $or: [{ email: "username" }, { nickname: "username" }],
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("wrong password should return UnauthenticatedError", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: "user_id",
      checkPassword: jest.fn().mockResolvedValue(false),
    });
    await login(loginReq, res, next);

    expect(next).toHaveBeenCalledWith(
      new UnauthenticatedError("Wrong password")
    );
  });

  it("invalid login credentials should return UnauthenticatedError", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    await login(loginReq, res, next);

    expect(next).toHaveBeenCalledWith(
      new UnauthenticatedError("Invalid credentials")
    );
  });

  it("missing credentials should return BadRequestError", async () => {
    loginReq.body = {}; //since we are overwriting body, this test is the last one
    await login(loginReq, res, next);

    expect(next).toHaveBeenCalledWith(
      new BadRequestError("Please provide login credentials")
    );
  });
});

describe("email and password register", () => {
  it("user should be able to register with all information provided", async () => {
    User.create = jest.fn().mockResolvedValue({
      user: "user_id",
    });
    await register(registerReq, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
