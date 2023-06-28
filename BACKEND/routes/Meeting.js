const express = require("express");
const router = express.Router();

const {
    addMeeting,
    getMeetingById,
    deleteMeeting,
    getMeeting,
    updateMeeting,
} = require("../controllers/meetingController");

//@route  POST api/meeting
//@desc   add meeting
router.post("/add", addMeeting);

//@route  GET api/meeting
//@desc   get meeting by Id
router.get("/meeting/:id", getMeetingById);

//@route  DELETE api/meeting
//@desc   delete meeting
router.delete("/deletemeeting/:id", deleteMeeting);

//@route  GET api/meeting/all
//@desc   get all meetings
router.get("/", getMeeting);

//@route  PUT api/meeting
//@desc   update meeting
router.put("/editmeeting/:id", updateMeeting);


module.exports = router;
