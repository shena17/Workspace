const Leave = require("../models/Leaves.model");

//Create a leave request
const requestLeave = async (req,res) => {
    const{
        leaveType,
        username,
        userId,
        reqdDate,
        startDate,
        endDate,
        remainingLeaves,
        reqDatesNo,
        leaveDates,
        reason,
        status,
    } = req.body;

    const leave = await Leave.create({
        leaveType,
        username,
        userId,
        reqdDate,
        startDate,
        endDate,
        remainingLeaves,
        reqDatesNo,
        leaveDates,
        reason,
        status,
    });

    if(leave){
        res.status(201);
        res.json("Request sent");
    }else{
        res.status(400);
        res.json("Requesting leave has failed");
    }
};

//Get leave requests by username
const getLeaves = async (req, res) => {
    const { username } = req.query;
    try {
      const leaves = await Leave.find({ username: username });
      res.json(leaves);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  //Get leave requests by status
const getLeavesByStatus = async (req, res) => {
  const { status } = req.query;
  try {
    const leaves = await Leave.find({ status: status });
    res.json(leaves);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get leave requests by ID
const getLeavesByID = async (req, res) => {
  const { id } = req.params;
  try {
    const leaves = await Leave.findById(id);
    res.json(leaves);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Update Leave request details
const updateLeave = async (req, res) => {
    try {
      const { 
        leaveType,
        username,
        userId,
        reqdDate,
        startDate,
        endDate,
        remainingLeaves,
        reqDatesNo,
        leaveDates,
        reason,
        status,
      } = req.body;
  
        //Updating
        const update = await Leave.findByIdAndUpdate(req.params.id, {
            leaveType,
            username,
            userId,
            reqdDate,
            startDate,
            endDate,
            remainingLeaves,
            reqDatesNo,
            leaveDates,
            reason,
            status,
        });
  
        if (update) {
          res.status(200).json({
            data: "Leave updated successfully",
            status: true,
          });
        } else {
          res.status(401).json({
            errorMessage: "Failed to update the Leave!",
            status: false,
          });
        }
      
    } catch (error) {
      res.status(401).json({
        errorMessage: "Something went wrong!\n" + error,
        status: false,
      });
    }
  };

  //Delete Leave request
  const deleteLeave = async (req, res) => {
    try {
      const deleted = await Leave.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Leave request Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete Leave Request!",
          status: false,
        });
      }
    } catch (error) {
      res.status(401).json({
        errorMessage: "Something went wrong!\n" + error,
        status: false,
      });
    }
  };

  //Get Single Leave Report
  const getsingleLeaveReport = async(req,res) => {
    var report = []

    try {
      const leaves = await Leave.findById(req.params.id)

        report.push({
           leaveID: leaves._id,
           username: leaves.username,
           leaveType: leaves.leaveType,
           requestedDate: leaves.reqdDate,
           startDate: leaves.startDate,
           endDate: leaves.endDate,
           requestedLeaves: leaves.reqDatesNo,
           reason: leaves.reason,
           status: leaves.status
        })
      
      res.json(report)

    }catch (error) {
      console.log(error)
    }
  }

  //Get Report for approved and rejected leaves for manager
  const getAccRejLeaveViewReport = async(req,res) => {
    var report = []

    try {
      const leaves = await Leave.find({status: ["approved","rejected"]})

        leaves.forEach(async(leave) => {
          report.push({
            leaveID: leave._id,
            username: leave.username,
            leaveType: leave.leaveType,
            requestedDate: leave.reqdDate,
            startDate: leave.startDate,
            endDate: leave.endDate,
            requestedLeaves: leave.reqDatesNo,
            reason: leave.reason,
            status: leave.status
         })
        })
      
      res.json(report)

    }catch (error) {
      console.log(error)
    }
  }
  

module.exports = {
    requestLeave,
    getLeaves,
    updateLeave,
    deleteLeave,
    getLeavesByStatus,
    getLeavesByID,
    getsingleLeaveReport,
    getAccRejLeaveViewReport
}