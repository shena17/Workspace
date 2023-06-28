const Task = require("../../models/Task.model");
const User= require("../../models/User.model");

function getNumberOfdays(d1,d2){
    const oneDay = 1000 * 60 * 60 * 24;
    var dueDate=new Date(d1);
    var today=new Date(d2);
    var timeDiff=dueDate.getTime()-today.getTime();
    var days=timeDiff/oneDay;

    return days;
}

const addCredits=async(dueDate,completedDate,credits,userId)=>{
    //take the due date and current date compare if passed then 50% else 100% if more then give bonus point

    var due=new Date(dueDate)
    var completed=new Date(completedDate)
    var awardedPoints=0
    var numberOfdays=getNumberOfdays(due,completed)

    if(numberOfdays>0){
        awardedPoints=credits+1
    }else if (numberOfdays==0) {
        awardedPoints=credits
    } else {
        awardedPoints=credits*0.5
    }
    await User.findByIdAndUpdate(userId,{
        $push:{
            creditPoints:{
                date:completed,
                cp:awardedPoints,
            }
        }
    })

}

module.exports={addCredits};