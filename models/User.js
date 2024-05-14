const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
    minlength: 2,
    maxlength: 50,
  },
  nickname: {
    type: String,
    required: [true, "Please provide nickname"],
    minlength: 5,
    maxlength: 32,
    unique: [true, "Nickname already exists, please choose another one"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: [true, "Email already registered"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    match: [
      /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
      "Password must contain at least one number, one special character, and have the length of at least 8 characters",
    ],
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  chats: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  friendRequests: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

UserSchema.pre("save", async function (next) {
  //using normal function declaration instead of arrow, because of this keyword
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // 'this' reffers to the document

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
