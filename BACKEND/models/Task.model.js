const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newTask = new Schema(
    {
        taskName:{
            type : String,
            required : true,
        },
        dueDate:{
            type : Date,
            required : true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        restartDate:{
            type: Date,
        },
        stage:{
            type: String,
            required : true,
        },
        priority:{
            type: String,
            required : true,
        },
        credits:{
            type: Number,
            required : true,
        },
        description:{
            type: String,
            required : true,
        },
        assignee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        nextAssignee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        isStarted:{
            type: Boolean,
            default: false,
        },
        hrsWorked:{
            type: Array,
        },
        workLeft:{
            type:Number,
        },
        totalWork:{
            type:Number,
        },
        completedDate:{
            type:Date,
        },
        isRequested:{
            type:Boolean,
            default:false,
        }
    },
    { timestamps: true}
);

const Task = mongoose.model("Task",newTask);

module.exports = Task;
