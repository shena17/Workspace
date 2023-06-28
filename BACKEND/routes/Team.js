const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  createTeam,
  getTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
  getRelevantTeams,
  getRelevantTeams2,
  getUsersWithoutLeaders,
  getTeamMembers,
  getTeamMembersForEdit,
  getReport,
  getReport2,
  leaderboard,
  leaderboard2,
  trackEmployee,
  trackEmployee2,
  returnLoggedId
} = require("../controllers/teamController");

//ADD TEAM
router.post("/create", protect, createTeam);

//REPORT GENARATION
router.get("/getReport2", getReport2);

//GET ALL TEAMS
router.get("/allTeams", getAllTeams);

//DELETE TEAM
router.delete("/delete/:id", deleteTeam);

//UPDATE TEAM
router.put("/updateTeam/:id",protect, updateTeam);

//OTHER API
//GET ALL TEAMS WITH EMPLOYEE AND PROJECT DETAILS
router.get("/report", getReport);

//logedId
router.get("/loggedId",protect,  returnLoggedId);

//Track Employee
router.get("/trackEmployee", trackEmployee)

//Track Employee 2
router.get("/trackEmployee2/:id", trackEmployee2)

//LEADERBOARD
router.get("/leaderboard", leaderboard);

//LEADERBOARD 2
router.get("/leaderboard2", leaderboard2);

//GET SPECIFIC TEAM
router.get("/:id", getTeam);

//GET RELEVANT TEAMS1
router.get("/teams/relevant", protect, getRelevantTeams);

//GET RELEVANT TEAMS2
router.get("/teams/relevant2", protect, getRelevantTeams2);

//WITHOUT Lerders
router.get("/get/otherUsers", getUsersWithoutLeaders);

//GET TEAM MEMBERS
router.get("/teamMembers/:id", protect, getTeamMembers);

//GET TEAM MEMBERS FOR EDIT
router.get("/editMembers/:id", protect, getTeamMembersForEdit);


module.exports = router;
