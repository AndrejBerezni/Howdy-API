const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    res.send(`${user} registered`);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const { user } = req.body;
  res.send(`${user} registered`);
};

module.exports = { register, login };
