const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newNotification = new Schema(
    {
        notificationName:{
            type : String,
            required : true,
        },
        notificationType:{
            type: String,
            required : true,
        },
        notificationDate:{
            type : Date,
            required : true,
        },
        taskId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
        assignee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isWatched:{
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true}
);

const Notification = mongoose.model("Notification",newNotification);

module.exports = Notification;
