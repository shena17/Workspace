const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  getRole,
  registerUser,
  getUser,
  login,
  getAllUsers,
  deleteEmployee,
  updateEmployee,
  getNewToken,
  downProfileSummery
} = require("../controllers/userController");

// GET ROLE
router.get("/getRole", protect, getRole);

//REGISTER
router.post("/register", registerUser);

// GET USER
router.get("/get",protect, getUser);

// GET ALL USERS
router.get("/getAllUsers", getAllUsers);

// UPDATE PROJECT DETAILS
router.put("/updateUser/:id", updateEmployee);

// DELETE USER
router.delete("/deleteUser/:id", deleteEmployee);

//LOGIN
router.post("/login", login);

//GET NEW TOKEN
router.post("/token/:id", getNewToken);

// DOWNLOAD A SUMMERY REPORT OF THE USER
router.get("/downProfileSummery/:id", downProfileSummery);

module.exports = router;
