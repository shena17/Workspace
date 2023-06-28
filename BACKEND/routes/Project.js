const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  createProject,
  getProjects,
  showProject,
  updateProject,
  deleteProject,
  updateCompletion,
  checkProject,
  getTeamDetails,
  getProjectTasks,
  homeData,
  getBurndown,
  getBurndownDetails,
} = require("../controllers/projectController");

// ADD PROJECT
router.post("/create", protect, createProject);

// GET PROJECTS
router.get("/getProjects", protect, getProjects);

// UPDATE PROJECT DETAILS
router.put("/updateProject/:id", updateProject);

// DELETE PROJECT
router.delete("/deleteProject/:id", protect, deleteProject);

//
// EXTRA FUNCTIONS
//

// RETRIEVE PROJECT
router.get("/showProject/:id", protect, showProject);

// UPDATE PROJECT AS STARTED
router.put("/updateCompletion/:id", protect, updateCompletion);

//CHECK IF THE PROJECT EXISTS
router.post("/checkProject", protect, checkProject);

// GET TASKS OF A PROJECT
router.get("/getProjectTasks/:id", protect, getProjectTasks);

// HOME PAGE DATA
router.get("/homeData", protect, homeData);

// GET BURNDOWN CHART DATA
router.get("/getBurndown/:id", protect, getBurndown);

//GET DATA FOR CHART
router.get("/getData/:id",protect, getBurndownDetails);

module.exports = router;
