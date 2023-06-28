const mongoose = require("mongoose");

const GroupChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupChat",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const GroupChat = mongoose.model("GroupChat", GroupChatSchema);
const Message = mongoose.model("Message", MessageSchema);

module.exports = {
  GroupChat,
  Message,
};
