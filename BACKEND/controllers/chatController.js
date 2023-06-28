const GroupChat = require("../models/Chat.model");

exports.getAllGroupChats = async (req, res) => {
  try {
    const groupChats = await GroupChat.find().populate("members createdBy");
    res.json(groupChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getGroupChatById = async (req, res) => {
  try {
    const groupChat = await GroupChat.findById(req.params.groupId).populate(
      "members createdBy"
    );
    if (!groupChat) {
      return res.status(404).json({ error: "Group chat not found" });
    }
    res.json(groupChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user.id;
    const groupChat = new GroupChat({ name, members, createdBy });
    await groupChat.save();
    res.json(groupChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const groupChat = await GroupChat.findById(req.params.groupId);
    if (!groupChat) {
      return res.status(404).json({ error: "Group chat not found" });
    }
    groupChat.name = name;
    await groupChat.save();
    res.json(groupChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupChat = await GroupChat.findById(req.params.groupId);
    if (!groupChat) {
      return res.status(404).json({ error: "Group chat not found" });
    }
    await groupChat.remove();
    res.json({ message: "Group chat deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
