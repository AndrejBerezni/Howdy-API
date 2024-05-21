const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: {
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },

  messages: {
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message",
  },

  //to add files when I implement file sharing
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
