const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    subject: { type: String, required: true },
    platform: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    organizer: {type:String, required: true}
}, {
    timestamps: true,
})

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;