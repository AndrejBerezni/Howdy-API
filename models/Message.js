const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chat: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },

  sender: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  //to add files when I implement file sharing
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
