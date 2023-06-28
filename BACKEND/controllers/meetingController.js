const Meeting = require("../models/Meeting.model");

// add Meeting
const addMeeting = async (req, res) => {

    const {subject, platform, date, time, organizer} = req.body;
    const meeting = new Meeting({
        subject,
        platform,
        date,
        time,
        organizer,
    });

    await meeting.save()
        .then(() => res.json('Meeting added!'+ meeting))
        .catch(err => res.status(400).json('Error (create): ' + err));
}

// update Meeting
const updateMeeting = async (req, res) => {
    Meeting.findByIdAndUpdate(req.params.id)
        .then((existingMeeting) => {
            existingMeeting.subject = req.body.subject;
            existingMeeting.platform = req.body.platform;
            existingMeeting.date = Date.parse(req.body.date);
            existingMeeting.time = req.body.time;
            existingMeeting.organizer = req.body.organizer;

            existingMeeting.save()
                .then((updatedMeeting) => res.json("Meeting Updated : "+updatedMeeting))
                .catch((error) => res.status(400).json("Error:" + error ));
        })
        .catch((error) => res.status(400).json("Error (update): " + error));
}

// delete Meeting
const deleteMeeting = async (req, res) => {
    console.log(req.params.id);
    Meeting.findByIdAndDelete(req.params.id)
        .then(() => res.json('Meeting deleted'))
        .catch(err => res.status(400).json('Error (delete): ' + err));
};

// get Meeting by id
const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (meeting)
            res.json(meeting);
        else {
            res.json("No Meeting from this ID")
        }
    } catch (error) {
        res.status(500).send("Server Error : " + error);
    }
};

// get all Meetings
const getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.find();
        res.json(meeting);
    } catch (error) {
        res.status(500).send("Server Error (getAll): " + error);
    }
}

//export 
module.exports = {
    addMeeting,
    getMeetingById,
    deleteMeeting,
    getMeeting,
    updateMeeting,
};