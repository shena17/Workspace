const Project = require("../models/Project.model");
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Task = require("../models/Task.model");
const { updateStatus, setProgress } = require("./exports/StatusUpdate");
const { getTaskEmp } = require("./taskController");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      company,
      credits,
      team,
      deadline,
      startDate,
      description,
    } = req.body;

    // Check if the same project name exists
    const projectExists = await Project.findOne({ projectName });
    if (projectExists) {
      res.status(401).json({
        errorMessage:
          "Project name already exists! Please choose another name.",
        status: false,
      });
    } else {
      const project = await Project.create({
        projectName,
        company,
        credits,
        team,
        deadline,
        startDate,
        description,
        status: "Not Started",
        progress: 0,
      });
      if (project) {
        res.status(200).json({
          data: "Project created successfully",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to create the project!",
          status: false,
        });
      }
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
      status: false,
    });
  }
};

// GET PROJECT DETAILS
const getProjects = async (req, res) => {
  const project = await Project.find().populate({
    path: "team",
    match: { members: { $eq: req.user._id } },
  });

  updateStatus(project);
  setProgress(project);

  var proj = [];
  await Project.find()
    .populate({
      path: "team",
      match: { members: { $eq: req.user._id } },
    })
    .then((data) => {
      data.forEach((project) => {
        if (project.team !== null) {
          proj.push(project);
        }
      });
      res.json(proj);
    })
    .catch((err) => {
      res.json(err);
    });
};

// UPDATE PROJECT DETAILS
const updateProject = async (req, res) => {
  try {
    const {
      currentProject,
      projectName,
      company,
      credits,
      startDate,
      deadline,
      description,
    } = req.body;

    // Check if the same project name exists
    const projectExists = await Project.findOne({ projectName });
    if (projectExists && projectExists.projectName !== currentProject) {
      res.status(401).json({
        errorMessage:
          "Project name already exists! Please choose another name.",
        status: false,
      });
    } else {
      const update = await Project.findByIdAndUpdate(req.params.id, {
        projectName,
        company,
        credits,
        startDate,
        deadline,
        description,
      });

      if (update) {
        res.status(200).json({
          data: "Project updated successfully",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to update the project!",
          status: false,
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "Project Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete project!",
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

// EXTRA FUNCTIONS

// RETRIEVE PROJECT
const showProject = async (req, res) => {
  const project = await Project.find().populate({
    path: "team",
    match: { members: { $eq: req.user._id } },
  });

  setProgress(project);

  await Project.find({ _id: req.params.id })
    .populate("team")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

//UPDATE PROJECT AS STARTED
const updateCompletion = async (req, res) => {
  const { status } = req.body;

  try {
    const update = await Project.findByIdAndUpdate(req.params.id, {
      status,
    });

    if (update) {
      res.status(200).json({
        data: "Project Updated",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Failed to complete the project",
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

// CHECK IF THE PROJECT EXISTS
const checkProject = async (req, res) => {
  try {
    const { projectName } = req.body;

    // Check if the same project name exists
    const projectExists = await Project.findOne({ projectName });
    if (projectExists) {
      res.status(401).json({
        errorMessage:
          "Project name already exists! Please choose another name.",
        status: false,
      });
    } else {
      res.status(200).json({ data: "Checked" });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
      status: false,
    });
  }
};

// GET TASKS OF A PROJECT
const getProjectTasks = async (req, res) => {
  await Task.find({ projectId: req.params.id })
    .sort({
      dueDate: 1,
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

// HOME PAGE DATA
const homeData = async (req, res) => {
  var proj = [];
  var completedProjs = 0;
  var completedTasks = 0;
  var inProgress = 0;
  var inQueue = 0;

  const tasks = await Task.find({ assignee: req.user.id });

  const projects = await Project.find().populate({
    path: "team",
    match: { members: { $eq: req.user._id } },
  });

  projects.forEach((project) => {
    if (project.team !== null) {
      proj.push(project);
      if (project.status === "Completed") {
        ++completedProjs;
      }
    }
  });

  tasks.forEach((task) => {
    if (task.stage === "Completed") {
      ++completedTasks;
    } else if (task.stage === "Started" || task.stage === "InProgress") {
      ++inProgress;
    } else if (task.stage === "NotStarted") {
      ++inQueue;
    }
  });

  res.json({
    projectsCompleted: completedProjs,
    totalProjects: proj.length,
    tasksCompleted: completedTasks,
    totalTasks: tasks.length,
    tasksInProgress: inProgress,
    tasksInQueue: inQueue,
  });
};

// GET BURNDOWN CHART DATA
const getBurndown = async (req, res) => {
  const project = await Project.findById(req.params.id);

  res.json({
    startDate: project.startDate,
    deadline: project.deadline,
  });
};

//getting data for chart
const getBurndownDetails=async(req,res)=>{

  const projectData=await Project.findById(req.params.id);

  if(projectData){
    const oneDay = 1000 * 60 * 60 * 24;
    var timeDiff=projectData.deadline.getTime()-projectData.startDate.getTime();
    var days=timeDiff/oneDay
  }
  else{
    res.json(err);
  }

  
  const projectTasks=await Task.find({projectId:req.params.id});
  if(projectTasks){
    var len=projectTasks.length
    //var len=20;
    var remaing=len;
    var actualArr=[
      {
        x:projectData.startDate,
        y:len,
      }
    ];
    projectTasks.map((e)=>{
      var comDate=e.completedDate;
      var count=0;
      
      projectTasks.map((e2)=>{
        if(e2.stage=="Completed" && e2.completedDate==comDate){
          count++;
        }
      })
      if(count!=0&&comDate!=undefined){
        remaing=remaing-count;
        var element={
          x:comDate,
          y:remaing,
        }
        actualArr.push(element);
      }
      
    }
    )
  }else{
    res.json(err)
  }

  
  var velocity=len/days;


  res.json({
    days,
    len,
    velocity,
    startDate:projectData.startDate,
    endDate:projectData.deadline,
    actualArr
  });
}

module.exports = {
  createProject,
  getProjects,
  showProject,
  updateProject,
  deleteProject,
  updateCompletion,
  checkProject,
  getProjectTasks,
  homeData,
  getBurndown,
  getBurndownDetails,

};
