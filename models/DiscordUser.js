const mongoosee = require("mongoose");

const DiscordUserSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: [true, "Discord ID must be provided"],
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

const DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);

module.exports = DiscordUser;
