const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: [2, "First name must be longer than 2 characters"],
    maxlength: [50, "First name can not be longer than 50 characters"],
  },

  lastName: {
    type: String,
    minlength: [2, "Last name must be longer than 2 characters"],
    maxlength: [50, "Last name can not be longer than 50 characters"],
  },

  nickname: {
    type: String,
    required: [true, "Please provide nickname"],
    minlength: [3, "Nickname must be longer than 3 characters"],
    maxlength: [64, "Nickname can not be longer than 64 characters"],
    unique: [true, "Nickname already exists, please choose another one"],
  },

  email: {
    type: String,
    required: ["true", "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: [true, "Email already registered"],
  },

  password: {
    type: String,
    validate: {
      validator: function (v) {
        if (this.authMethod === "email") {
          return v != null && v.trim().length > 0;
          // Password is required if authMethod is 'email'
        }
        return true;
      },
      message: "Please provide password",
    },
    minlength: [
      8,
      "Password must contain at least one number, one special character, and have the length of at least 8 characters",
    ],
    match: [
      /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
      "Password must contain at least one number, one special character, and have the length of at least 8 characters",
    ],
  },

  profilePicture: String,

  status: {
    type: String,
    required: true,
    default: "offline",
    enum: ["online", "offline", "busy"],
  },

  authMethod: {
    type: String,
    enum: ["email", "discord", "google"],
    required: true,
    default: "email",
  },

  oAuthId: {
    type: {},
  },

  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },

  chats: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Chat",
    default: [],
  },

  friendRequests: {
    sent: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "FriendRequest",
      default: [],
    },
    received: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "FriendRequest",
      default: [],
    },
  },
});

UserSchema.pre("save", async function (next) {
  //using normal function declaration instead of arrow, because of this keyword
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // 'this' reffers to the document
  }
  next();
});

UserSchema.methods.checkPassword = async function (candidate) {
  const passwordCorrect = await bcrypt.compare(candidate, this.password);
  return passwordCorrect;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
