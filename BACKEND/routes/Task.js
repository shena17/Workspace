const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const{
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
}=require("../controllers/taskController");

//create task
router.post("/create", protect, createTask);

//get employees in the team using projectid
router.get("/getEmp/:id", protect, getEmp);

//get employee task
router.get("/", protect, getTaskEmp);

//get project task
router.get("/projectTask/:id", protect, getTaskProj);

//get task detail
router.get("/viewTask/:id", protect, getTaskDetail);

//update task
router.put("/updateTask/:id", protect, updateTask);

//delete task
router.delete("/deleteTask/:id", protect, deleteTask);

//update the task state start and restart
router.put("/setTaskState/:id", protect, updateState);

//pause the task
router.put("/pauseTask/:id", protect, pauseTask);

//complete task
router.put("/completeTask/:id", protect, completeTask);

//request extention
router.put("/requestExtention/:id", protect, requestExtention);

//generate report
router.get("/generateReport/", protect, generateReport);

module.exports=router;