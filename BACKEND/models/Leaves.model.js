const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newLeaveRequest = new Schema(
    {
        leaveType:{
            type: String,
            required: true,
        },
        username:{
            type: String,
            required: true,
        },
        userId:{
            type: String,
            required: true,
        },
        reqdDate:{
            type: Date,
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
        },
        remainingLeaves:{
            type: Number,
        },
        reqDatesNo:{
            type: Number,
        },
        leaveDates:{
            type: Number,
        },
        reason:{
            type: String,
            required: true,
        },
        status:{
            type: String,        },
    },
    {
        timestamps: true,
    }
);

const Leave = mongoose.model("Leave", newLeaveRequest);

module.exports = Leave;