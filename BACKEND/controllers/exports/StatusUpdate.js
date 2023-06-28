const Project = require("../../models/Project.model");
const Task = require("../../models/Task.model");

// DATE DIFFERENCE
const dateDifference = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);

  function diff() {
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  if (diff() == 1) {
    return diff();
  } else {
    return diff();
  }
};

const updateStatus = async (project) => {
  project.map(async (data) => {
    const { _id, status, progress, startDate, deadline } = data.toObject();
    if (status === "Not Started") {
      if (
        dateDifference(
          new Date().toLocaleDateString(),
          new Date(startDate).toLocaleDateString()
        ) <= 0
      ) {
        await Project.findByIdAndUpdate(_id, {
          status: "Started",
        });
      }
    } else if (status === "Late") {
      if (
        dateDifference(
          new Date().toLocaleDateString(),
          new Date(deadline).toLocaleDateString()
        ) > 0
      ) {
        await Project.findByIdAndUpdate(_id, {
          status: "In Progress",
        });
      }
    } else if (
      status === "Started" &&
      dateDifference(
        new Date(startDate).toLocaleDateString(),
        new Date().toLocaleDateString()
      ) > 2
    ) {
      await Project.findByIdAndUpdate(_id, {
        status: "In Progress",
      });
    } else if (
      progress === 100 &&
      status !== "Completed" &&
      dateDifference(
        new Date(startDate).toLocaleDateString(),
        new Date().toLocaleDateString()
      ) > 0
    ) {
      await Project.findByIdAndUpdate(_id, {
        status: "Early",
      });
    } else if (status === "Early" && progress !== 100) {
      await Project.findByIdAndUpdate(_id, {
        status: "In Progress",
      });
    } else {
      if (
        dateDifference(
          new Date().toLocaleDateString(),
          new Date(deadline).toLocaleDateString()
        ) <= 0 &&
        status !== "Completed"
      ) {
        await Project.findByIdAndUpdate(_id, {
          status: "Late",
        });
      }
    }
  });
};

const setProgress = async (project) => {
  project.map(async (data) => {
    var completed = 0;
    var progress = 0;
    const { _id, status, startDate, deadline } = data.toObject();

    const tasks = await Task.find({ projectId: _id });

    tasks.map((task) => {
      if (task.stage === "Completed") {
        ++completed;
      } else if (task.stage === "Started") {
        completed += 0.1;
      } else if (task.stage === "InProgress") {
        completed += 0.5;
      }
    });

    if (completed > 0) {
      progress = (completed / tasks.length) * 100;
      await Project.findByIdAndUpdate(_id, { progress: progress.toFixed(0) });
    } else if (tasks.length === 0) {
      await Project.findByIdAndUpdate(_id, { progress: 0 });
    }
  });
};

module.exports = { updateStatus, setProgress };
