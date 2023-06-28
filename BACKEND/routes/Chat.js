const express = require("express");
const router = express.Router();
const groupChatController = require("../controllers/chatController");
const { protect } = require("../middleware/authorization");

router.get("/", protect, groupChatController.getAllGroupChats);
router.get("/:groupId", protect, groupChatController.getGroupChatById);
router.post("/", protect, groupChatController.createGroupChat);
router.put("/:groupId/rename", protect, groupChatController.renameGroup);
router.delete("/:groupId", protect, groupChatController.deleteGroup);

module.exports = router;
``;
