const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newProject = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    deadline: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    progress: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", newProject);

module.exports = Project;
