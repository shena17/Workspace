const Task = require("../models/Task.model");
const User = require("../models/User.model");
const Notification=require("../models/Notification.model");
const Project = require("../models/Project.model");
const Team = require("../models/Team.model");
const {updateStatus}=require("./exports/TaskStatusUpdate");
const { addCredits } = require("./exports/TaskAddCredits");

//Creat Task
const createTask = async (req, res) => {
  //getting the data from request body

  const taskName = req.body.taskName;
  const dueDate = req.body.dueDate;
  const startDate= req.body.startDate;
  const stage = req.body.stage;
  const priority = req.body.priority;
  const credits = req.body.credits;
  const description = req.body.description;
  const assignee = req.body.assignee;
  const nextAssignee = req.body.nextAssignee;
  const projectId = req.body.projectId;
  const workLeft = req.body.workLeft;
  const totalWork=req.body.workLeft;

  // Check if the same Task name exists
  const taskExists = await Task.findOne({ taskName });
  if (taskExists) {
    res.status(401).json({
      errorMessage:
        "Task name already exists! Please choose another name.",
      status: false,
    });
  }else{
    //creating an object
      const newTask = new Task({
        taskName,
        dueDate,
        startDate,
        stage,
        priority,
        credits,
        description,
        assignee,
        nextAssignee,
        projectId,
        workLeft,
        totalWork,
        hrsWorked:{
            x:startDate,
            y:workLeft,
        }
      });
    
      newTask
        .save()
        .then(() => {
          res.status(200).json({
            data: "Task created successfully",
            status: true,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json({
            data: "Task Not created",
            status: false,
          });
        });
    };
    }




//get employees in the team using projectid
const getEmp=async (req,res)=>{
    const projectData = await Project.findById(req.params.id);
    const teamData = await Team.findById(projectData.team).populate({path:'members', select:{'_id':1,'fullName':1,'designation':1}});

    if(teamData){
      res.json(teamData.members);
    }else{
        res.status(401).json({
            errorMessage:"fail",
            status:false,
        })
    }
    
}
//get employee task
const getTaskEmp= async(req,res)=>{
   const task= await Task.find({assignee:req.user.id}).populate('projectId','projectName')

   updateStatus(task);

   await Task.find({assignee:req.user.id}).populate('projectId','projectName')
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.json(err);
    });
}

//get project task
//change the email to image src when needed
const getTaskProj = async (req, res) => {

  const task=await Task.find({ projectId: req.params.id })
  .populate({ path: "assignee", select: { fullName: 1, email: 1 } })
  .populate({ path: "projectId", select: { projectName: 1 } })
  .exec()

  updateStatus(task);

  await Task.find({ projectId: req.params.id })
    .populate({ path: "assignee", select: { fullName: 1, email: 1 } })
    .populate({ path: "projectId", select: { projectName: 1 } })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

//get task detail
const getTaskDetail = async (req, res) => {
  await Task.find({ _id: req.params.id })
    .populate("projectId", "projectName")
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};

//update task
const updateTask = async (req, res) => {
  const { taskName, dueDate, priority, credits, description } = req.body;

  const updateData = {
    taskName,
    dueDate,
    priority,
    credits,
    description,
  };

  const update = await Task.findByIdAndUpdate(req.params.id, updateData);

  if (update) {
    res.status(200).json({
      data: "Task Updated Sucessfully",
      status: true,
    });
  } else {
    res.status(401).json({
      data: "Failed to Update Task",
      status: false,
    });
  }
};

//delete task
const deleteTask = async (req, res) => {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (deleted) {
    res.status(200).json({
      data: "Task Deleted Successfully",
      status: true,
    });
  } else {
    res.status(401).json({
      errrorMessage: "Failed to delete Task!",
      status: false,
    });
  }
};

//update the task state start and restart
const updateState=async(req,res)=>{
    const {isStarted,restartDate}=req.body;
    
    const update= await Task.findByIdAndUpdate(req.params.id,{
        isStarted,
        restartDate,
        stage:"InProgress"
    });
    if (update) {
        res.status(200).json({
          data: "Task state Updated",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to update Task",
          status: false,
        });
      }
};

//pause the task
const pauseTask=async(req,res)=>{
    const{isStarted,workLeft}=req.body;
    const date=new Date().setUTCHours(0,0,0,0);
    const update = await Task.findByIdAndUpdate(req.params.id,{
        isStarted,
        workLeft,
        $push:{
            hrsWorked:{
                x:date,
                y:workLeft,
            }
        }
    });
    if(update){
        res.status(200).json({
            data: "Task state Updated",
            status: true,
          });
        } else {
          res.status(401).json({
            errorMessage: "Failed to update Task",
            status: false,
          });
        }

}

//complete project
const completeTask=async(req,res)=>{
  const {
    stage,
    completedDate, 
    dueDate,
    credits,
    userId,
  } = req.body;
  
  //addCredits(dueDate,completedDate,credits,userId)
  const update=await Task.findByIdAndUpdate(req.params.id,{
    stage,
    completedDate,
  });
  
  if(update){
    addCredits(dueDate,completedDate,credits,userId)
    res.status(200).json({
      data: "Task Updated",
      status: true,
    });
  }else{
    res.status(401).json({
      errorMessage: "Failed to complete the Task",
      status: false,
    });
  }
}

//Request Extension
const requestExtention= async(req,res)=>{
  const {
    isRequested,
    taskName,
    assignee,
  } = req.body;

  var notificationName=taskName;
  var notificationType="extension";
  var notificationDate=new Date();
  var taskId=req.params.id;

  const notification=new Notification({
    notificationName,
    notificationType,
    notificationDate,
    taskId,
    assignee,
  })

  notification.save()
  
  const update= await Task.findByIdAndUpdate(req.params.id,{
    isRequested,
  });

  

  if(update){
    res.status(200).json({
      data: "Request sent",
      status: true,
    });
  }else{
    res.status(401).json({
      errorMessage: "Failed to send",
      status: false,
    });
  }
}

//generate report

const generateReport= async (req,res)=>{
  var task=[]
  var projects=[]
  var projectTasks=[]

  const tasks= await Task.find({assignee:req.user.id}).populate('projectId','projectName')

  if(tasks){
    tasks.forEach((task)=>{
      var isTrue=projects.includes(task.projectId.projectName)
      if(!isTrue){
        projects.push(task.projectId.projectName);
      }
    })

    projects.forEach((project)=>{
      tasks.forEach((t)=>{
        if(t.projectId.projectName==project){
          task.push(t.taskName);
        }
      })

      var count=task.length;
  
      projectTasks.push({
        projectName:project,
        tasks:task,
        count:count,
      })
  
      task=[];
      
    })

  }

  res.json(projectTasks);
}

module.exports = {
  createTask,
  getEmp,
  getTaskEmp,
  getTaskDetail,
  updateTask,
  deleteTask,
  getTaskProj,
  updateState,
  pauseTask,
  completeTask,
  requestExtention,
  generateReport,
};
