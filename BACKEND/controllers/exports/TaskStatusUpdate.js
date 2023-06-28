const Project = require("../../models/Project.model");
const Task = require("../../models/Task.model");

function getNumberOfdays(d1,d2){
    const oneDay = 1000 * 60 * 60 * 24;
    var dueDate=new Date(d1);
    var today=new Date(d2);
    var timeDiff=dueDate.getTime()-today.getTime();
    var days=timeDiff/oneDay;

    return days;
}

const updateStatus= async (task)=>{
    task.map(async (data)=>{
        const {
            _id,
            workLeft,
            totalWork,
            dueDate,
            hrsWorked,
            stage,
            completedDate,
        }=data.toObject()

        //calculation for possile work

        var workDoneRate=(totalWork-workLeft)/((hrsWorked.length)-1)
        var currDate=new Date();
        var numberOfdays=getNumberOfdays(dueDate,currDate);
        var possibleWork=workDoneRate*numberOfdays;

        if(workLeft>possibleWork && numberOfdays<=2 && !completedDate){
            await Task.findByIdAndUpdate(_id,{
                stage:"Risk",
            });
        }

    });


}

module.exports = { updateStatus};