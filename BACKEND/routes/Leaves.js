const router = require("express").Router();

const{
    requestLeave,
    getLeaves,
    updateLeave,
    deleteLeave,
    getLeavesByStatus,
    getLeavesByID,
    getsingleLeaveReport,
    getAccRejLeaveViewReport
} = require("../controllers/leaveController");

//CREATE A LEAVE
router.post("/requestLeave", requestLeave);

//GET LEAVES FILTERED BY USERNAME
router.get("/getLeaves", getLeaves);

//GET LEAVES FILTERED BY STATUS
router.get("/getLeavesByStatus", getLeavesByStatus);

//GET PENDING LEAVE LIST REPORT
router.get("/getsingleLeaveReport/:id", getsingleLeaveReport)

//Get Report for approved and rejected leaves for manager
router.get("/getAccRejLeaveViewReport", getAccRejLeaveViewReport)

//GET LEAVED BY ID
router.get("/getLeavesById/:id", getLeavesByID);

//UPDATE LEAVE
router.put("/updateLeave/:id", updateLeave);

//DELETE LEAVE
router.delete("/deleteLeave/:id", deleteLeave)


module.exports = router;